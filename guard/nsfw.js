/**
 * @file nsfw.js
 * @description Botun temel koruma mantığı (Raid, Spam, NSFW, Yasaklama koruması vb.) bu dizindedir.
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
    console.log("[guardxnsole] NSFWJS modeli yukleniyor (Native Node.js Backend)...");
    
    
    model = await nsfw.load("InceptionV3", { size: 299 });
    console.log("[guardxnsole] NSFWJS modeli hazir (Hardware Acceleration aktif, InceptionV3 yuklendi).");
    return model;
}

modelYukle().catch(e => console.error("[guardxnsole] NSFWJS yukleme hatasi:", e.message));

var NSFW = {};


function jpegTensor(buf) {
    try {
        
        return tf.node.decodeJpeg(buf, 3);
    } catch (e) {
        
        var d = jpeg.decode(buf, { useTArray: true });
        var vals = new Int32Array(d.width * d.height * 3);
        for (var i = 0; i < d.width * d.height; i++) {
            vals[i * 3] = d.data[i * 4];
            vals[i * 3 + 1] = d.data[i * 4 + 1];
            vals[i * 3 + 2] = d.data[i * 4 + 2];
        }
        return tf.tensor3d(vals, [d.height, d.width, 3], "int32");
    }
}


function rgbaTensor(w, h, buf) {
    var vals = new Int32Array(w * h * 3);
    for (var i = 0; i < w * h; i++) {
        vals[i * 3] = buf[i * 4];
        vals[i * 3 + 1] = buf[i * 4 + 1];
        vals[i * 3 + 2] = buf[i * 4 + 2];
    }
    return tf.tensor3d(vals, [h, w, 3], "int32");
}


async function indir(url) {
    var r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 DiscordBot" } });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return Buffer.from(await r.arrayBuffer());
}


async function tara(tensor) {
    var ai = await modelYukle();
    var tahmin = await ai.classify(tensor);
    tensor.dispose();
    var skor = 0, detay = "";
    tahmin.forEach(function(t) {
        if (["Porn", "Hentai", "Sexy"].includes(t.className)) skor += t.probability;
        detay += t.className + ": %" + (t.probability * 100).toFixed(1) + " | ";
    });
    var ihlal = skor > 0.70 || tahmin.some(function(t) {
        return ["Porn", "Hentai"].includes(t.className) && t.probability > 0.50;
    });
    return { ihlal: ihlal, detay: detay };
}


async function proxyIleTara(url) {
    var jpegUrl = url.replace("cdn.discordapp.com", "media.discordapp.net");
    if (jpegUrl.indexOf("?") !== -1) jpegUrl += "&format=jpeg";
    else jpegUrl += "?format=jpeg";
    var buf = await indir(jpegUrl);
    var tensor = jpegTensor(buf);
    return await tara(tensor);
}


async function gifDerin(url) {
    var buf = await indir(url);
    var reader = new GifReader(buf);
    var frames = reader.numFrames();
    if (frames <= 0) throw new Error("0 kare");

    
    var hedef = [0];
    if (frames > 20) {
        
        hedef.push(Math.floor(frames / 4));
        hedef.push(Math.floor(frames / 2));
        hedef.push(Math.floor(frames * 3 / 4));
    } else if (frames > 2) {
        hedef.push(Math.floor(frames / 2));
    }
    if (frames > 1) hedef.push(frames - 1);

    var pixels = new Uint8Array(reader.width * reader.height * 4);

    console.log("[guardxnsole] [GIF-OPTIMIZE] " + frames + " kareden " + hedef.length + " nokta analiz ediliyor");

    for (var i = 0; i <= hedef[hedef.length - 1]; i++) {
        try { reader.decodeAndBlitFrameRGBA(i, pixels); } catch(e) { continue; }
        if (hedef.indexOf(i) === -1) continue;

        var tensor = rgbaTensor(reader.width, reader.height, pixels);
        var sonuc = await tara(tensor);
        if (sonuc.ihlal) return sonuc;
    }
    return { ihlal: false, detay: "Temiz" };
}


async function videoTaraFfmpeg(url) {
    var gecici = path.join(__dirname, "..", "database", "nsfw_tmp_" + Date.now() + ".mp4");
    try {
        var buf = await indir(url);
        fs.writeFileSync(gecici, buf);

        var kareBuf = await new Promise(function(resolve, reject) {
            var parts = [];
            var out = new Writable({
                write: function(chunk, enc, next) { parts.push(chunk); next(); }
            });
            var timer = setTimeout(function() { reject(new Error("Zaman asimi")); }, 25000);

            ffmpeg(gecici)
                .seekInput("0.5") 
                .frames(1)
                .format("image2")
                .videoCodec("mjpeg")
                .outputOptions("-q:v 2")
                .on("end", function() { clearTimeout(timer); resolve(Buffer.concat(parts)); })
                .on("error", function(err) { clearTimeout(timer); reject(err); })
                .pipe(out, { end: true });
        });

        if (kareBuf.length < 100) throw new Error("Bos kare");

        var tensor = jpegTensor(kareBuf);
        return await tara(tensor);
    } finally {
        try { fs.unlinkSync(gecici); } catch(e) {}
    }
}

NSFW.kontrolEt = async function(mesaj) {
    var ekler = mesaj.attachments ? mesaj.attachments.size : 0;
    var embedler = mesaj.embeds ? mesaj.embeds.length : 0;
    if (ekler === 0 && embedler === 0) return false;

    var ayar;
    try { ayar = await Ayar.getir(mesaj.guild.id); } catch(e) { return false; }
    if (!ayar || !ayar.nsfwKoruma) return false;

    var liste = [];

    
    if (mesaj.attachments) {
        mesaj.attachments.forEach(function(a) {
            var ct = (a.contentType || "").toLowerCase();
            var isim = (a.name || "dosya").toLowerCase();
            var ext = isim.split(".").pop();

            if (ct.indexOf("image/gif") !== -1 || ext === "gif") {
                liste.push({ url: a.url, ad: a.name || "gif", tip: "gif" });
            } else if (ct.indexOf("video/") !== -1 || ["mp4","webm","mov","avi","mkv","flv"].indexOf(ext) !== -1) {
                liste.push({ url: a.url, ad: a.name || "video", tip: "video" });
            } else if (ct.indexOf("image/") !== -1 || ["png","jpg","jpeg","webp","bmp","tiff"].indexOf(ext) !== -1) {
                liste.push({ url: a.url, ad: a.name || "gorsel", tip: "gorsel" });
            }
        });
    }

    
    if (mesaj.embeds) {
        mesaj.embeds.forEach(function(e, i) {
            var t_u = e.thumbnail ? (e.thumbnail.proxyURL || e.thumbnail.url) : null;
            var i_u = e.image ? (e.image.proxyURL || e.image.url) : null;
            var v_u = e.video ? e.video.url : null;

            if (v_u) {
                liste.push({ url: v_u, ad: "embed_vid_" + i, tip: "video" });
            } 
            else if (t_u || i_u) {
                var tespitUrl = t_u || i_u;
                var hedefLink = (e.url || tespitUrl).toLowerCase();

                if (tespitUrl.includes(".gif") || hedefLink.includes(".gif")) {
                    liste.push({ url: tespitUrl, ad: "embed_gif_" + i, tip: "gif" });
                } else {
                    liste.push({ url: tespitUrl, ad: "embed_img_" + i, tip: "gorsel" });
                }
            }
        });
    }

    if (liste.length === 0) return false;

    for (var idx = 0; idx < liste.length; idx++) {
        var m = liste[idx];
        try {
            var sonuc = null;

            if (m.tip === "gif") {
                try {
                    sonuc = await proxyIleTara(m.url);
                } catch(pe) {
                    try {
                        sonuc = await gifDerin(m.url);
                    } catch(ge) {
                        sonuc = { ihlal: false, detay: "Taranamadi" };
                    }
                }
                
                if (sonuc && !sonuc.ihlal) {
                    try {
                        var derinSonuc = await gifDerin(m.url);
                        if (derinSonuc.ihlal) sonuc = derinSonuc;
                    } catch(de) {}
                }

            } else if (m.tip === "video") {
                try {
                    sonuc = await videoTaraFfmpeg(m.url);
                } catch(ve) {
                    sonuc = { ihlal: false, detay: "Taranamadi" };
                }

            } else {
                try {
                    sonuc = await proxyIleTara(m.url);
                } catch(ie) {
                    try {
                        var buf = await indir(m.url);
                        var tensor = jpegTensor(buf);
                        sonuc = await tara(tensor);
                    } catch(ie2) {
                        sonuc = { ihlal: false, detay: "Taranamadi" };
                    }
                }
            }

            if (sonuc && sonuc.ihlal) {
                await mesaj.delete().catch(function() {});

                var basliklar = { gif: "⚠️ NSFW GIF TESPİT EDİLDİ", video: "⚠️ NSFW VİDEO TESPİT EDİLDİ", gorsel: "⚠️ NSFW İÇERİK TESPİT EDİLDİ" };
                
                await kayitci.log(mesaj.guild, basliklar[m.tip] || basliklar.gorsel,
                    "Kullanici: " + mesaj.author.tag + " (" + mesaj.author.id + ")\n" +
                    "Kanal: <#" + mesaj.channel.id + ">\n" +
                    "Medya: " + m.ad + " (" + m.tip + ")\n" +
                    "Tespit: " + sonuc.detay,
                    0xe74c3c, "guard");

                const msg = (await kayitci.mesaj(mesaj.guild.id, "GUARD.NSFW_UYARI")).replace("{uye}", `<@${mesaj.author.id}>`);
                await mesaj.channel.send({ content: msg }).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
                
                return true;
            }

        } catch(h) {
            console.error("[guardxnsole] Tarama hatasi (" + m.ad + "): " + h.message);
        }
    }

    return false;
};

module.exports = NSFW;
