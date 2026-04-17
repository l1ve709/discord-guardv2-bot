/**
 * @file nsfw.js
 * @description Optimized NSFW detection for Discord messages.
 * @author guardxnsole
 */

const tf = require("@tensorflow/tfjs"); 
const nsfw = require("nsfwjs");
const jpeg = require("jpeg-js");
const { GifReader } = require("omggif");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegStatic = require("ffmpeg-static");
const { Writable } = require("stream");
const fs = require("fs");
const path = require("path");
ffmpeg.setFfmpegPath(ffmpegStatic);
const Ayar = require("../models/ayar.model");
const kayitci = require("../tools/kayitci");

var model = null;

async function modelYukle() {
    if (model) return model;
    // MobileNetV2 is 10-20x faster than InceptionV3 in pure JS mode.
    model = await nsfw.load("MobileNetV2", { size: 224 });
    console.log("[guardxnsole] NSFWJS (MobileNetV2) scanning module ready.");
    return model;
}

modelYukle().catch(e => console.error("[guardxnsole] NSFW model error:", e.message));

var NSFW = {};

const PNG = require("pngjs").PNG;

function decodeToTensor(buf) {
    try {
        if (tf.node && tf.node.decodeImage) return tf.node.decodeImage(buf, 3);
        
        let d;
        try {
            d = jpeg.decode(buf, { useTArray: true });
        } catch (e) {
            // PNG fallback
            try {
                d = PNG.sync.read(buf);
            } catch (pngE) {
                throw new Error("Decoding failed for JPEG/PNG: " + pngE.message);
            }
        }

        const { width, height, data } = d;
        const numPixels = width * height;
        const values = new Int32Array(numPixels * 3);
        for (let i = 0; i < numPixels; i++) {
            values[i * 3] = data[i * 4];
            values[i * 3 + 1] = data[i * 4 + 1];
            values[i * 3 + 2] = data[i * 4 + 2];
        }
        return tf.tensor3d(values, [height, width, 3], "int32");
    } catch (e) {
        throw new Error("Decoding failed: " + e.message);
    }
}

async function indir(url, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const r = await fetch(url, { signal: controller.signal, headers: { "User-Agent": "Mozilla/5.0 Bot" } });
        clearTimeout(id);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return Buffer.from(await r.arrayBuffer());
    } catch (e) {
        clearTimeout(id);
        throw e;
    }
}

async function tara(tensor) {
    const ai = await modelYukle();
    const predictions = await ai.classify(tensor);
    tensor.dispose();
    
    let score = 0;
    let detail = "";
    predictions.forEach(p => {
        if (["Porn", "Hentai", "Sexy"].includes(p.className)) score += p.probability;
        detail += `${p.className}: %${(p.probability * 100).toFixed(1)} | `;
    });
    
    const violation = score > 0.70 || predictions.some(p => ["Porn", "Hentai"].includes(p.className) && p.probability > 0.55);
    return { violation, detail };
}

async function smartScan(url, type) {
    let scanUrl = url;
    // Only Discord CDN works with the proxy strategy
    if (url.includes("discordapp.com") || url.includes("discordapp.net")) {
        scanUrl = url.replace("cdn.discordapp.com", "media.discordapp.net");
        if (!scanUrl.includes("?")) scanUrl += "?format=jpeg";
        else if (!scanUrl.includes("format=")) scanUrl += "&format=jpeg";
    }

    try {
        if (type === "gif" && !scanUrl.includes("format=jpeg")) {
            return await gifScan(url);
        }
        
        if (type === "video") {
            return await videoScan(url);
        }

        const buf = await indir(scanUrl);
        const tensor = decodeToTensor(buf);
        return await tara(tensor);
    } catch (e) {
        // Fallback for failed proxy or format
        if (scanUrl !== url) {
            const buf = await indir(url);
            const tensor = decodeToTensor(buf);
            return await tara(tensor);
        }
        throw e;
    }
}

async function gifScan(url) {
    const buf = await indir(url);
    const reader = new GifReader(buf);
    const frames = reader.numFrames();
    if (frames <= 0) return { violation: false, detail: "Empty GIF" };

    // Sample 2-3 frames to save time
    const sampleIndices = [0];
    if (frames > 1) sampleIndices.push(Math.floor(frames / 2));
    if (frames > 10) sampleIndices.push(frames - 1);

    console.log(`[guardxnsole] [NSFW-GIF] ${frames} kareden ${sampleIndices.length} nokta analiz ediliyor...`);

    const pixels = new Uint8Array(reader.width * reader.height * 4);
    for (const i of sampleIndices) {
        try {
            reader.decodeAndBlitFrameRGBA(i, pixels);
            const values = new Int32Array(reader.width * reader.height * 3);
            for (let j = 0; j < reader.width * reader.height; j++) {
                values[j * 3] = pixels[j * 4];
                values[j * 3 + 1] = pixels[j * 4 + 1];
                values[j * 3 + 2] = pixels[j * 4 + 2];
            }
            const tensor = tf.tensor3d(values, [reader.height, reader.width, 3], "int32");
            const res = await tara(tensor);
            if (res.violation) return res;
        } catch (e) { continue; }
    }
    return { violation: false, detail: "Clean" };
}

async function videoScan(url) {
    const tmp = path.join(__dirname, "..", "database", `vid_${Date.now()}.mp4`);
    try {
        const buf = await indir(url, 20000); // 20s for video
        fs.writeFileSync(tmp, buf);

        const frameBuf = await new Promise((resolve, reject) => {
            const chunks = [];
            const stream = new Writable({ write: (c, e, n) => { chunks.push(c); n(); } });
            ffmpeg(tmp)
                .seekInput("0.5")
                .frames(1)
                .format("image2")
                .videoCodec("mjpeg")
                .on("end", () => resolve(Buffer.concat(chunks)))
                .on("error", reject)
                .pipe(stream, { end: true });
        });

        const tensor = decodeToTensor(frameBuf);
        return await tara(tensor);
    } finally {
        try { fs.unlinkSync(tmp); } catch(e) {}
    }
}

NSFW.kontrolEt = async function(mesaj) {
    if (!mesaj.guild || mesaj.author.bot) return false;
    
    const ayar = await Ayar.getir(mesaj.guild.id);
    if (!ayar.nsfwKoruma) return false;

    const mediaList = [];

    // Attachments
    if (mesaj.attachments.size > 0) {
        mesaj.attachments.forEach(a => {
            const ct = (a.contentType || "").toLowerCase();
            const ext = (a.name || "").split(".").pop().toLowerCase();
            
            if (ct.includes("gif") || ext === "gif") mediaList.push({ url: a.url, type: "gif" });
            else if (ct.includes("video") || ["mp4", "mov", "webm"].includes(ext)) mediaList.push({ url: a.url, type: "video" });
            else if (ct.includes("image") || ["jpg", "jpeg", "png", "webp"].includes(ext)) mediaList.push({ url: a.url, type: "image" });
        });
    }

    // Embeds
    if (mesaj.embeds.length > 0) {
        mesaj.embeds.forEach(e => {
            const img = e.image ? (e.image.proxyURL || e.image.url) : null;
            const thumb = e.thumbnail ? (e.thumbnail.proxyURL || e.thumbnail.url) : null;
            const vid = e.video ? e.video.url : null;
            
            if (vid) mediaList.push({ url: vid, type: "video" });
            else if (img || thumb) {
                const url = img || thumb;
                mediaList.push({ url, type: url.includes(".gif") ? "gif" : "image" });
            }
        });
    }

    if (mediaList.length === 0) return false;

    for (const media of mediaList) {
        try {
            const res = await smartScan(media.url, media.type);
            if (res.violation) {
                console.log(`[guardxnsole] [NSFW-TESPIT] ${mesaj.author.tag} tarafından gönderilen ${media.type} ihlal içeriyor! Detay: ${res.detail}`);
                await mesaj.delete().catch(() => {});
                
                await kayitci.log(mesaj.guild, "NSFW Detection", 
                    `User: ${mesaj.author.tag} (${mesaj.author.id})\nType: ${media.type}\nDetail: ${res.detail}`, 
                    0xff0000, "guard");

                const msg = (await kayitci.mesaj(mesaj.guild.id, "GUARD.NSFW_UYARI")).replace("{uye}", `<@${mesaj.author.id}>`);
                await mesaj.channel.send({ content: msg }).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
                
                return true;
            }
        } catch (e) {
            console.error(`[guardxnsole] Scan error for ${media.url}:`, e.message);
        }
    }

    return false;
};

NSFW.modelYukle = modelYukle;
module.exports = NSFW;
