/**
 * @file kayitci.js
 * @description Yardımcı araçlar, loglama ve çoklu dil desteği.
 */

const { EmbedBuilder } = require("discord.js");
const Ayar = require("../models/ayar.model");

var Kayitci = {};

Kayitci.log = async function (sunucu, baslik, aciklama, renk, tur) {
    try {
        var ayar = await Ayar.getir(sunucu.id);
        var hedefKanalId = ayar.logKanalId;
        if (tur === "mod" && ayar.logModId) hedefKanalId = ayar.logModId;
        if (tur === "ses" && ayar.logSesId) hedefKanalId = ayar.logSesId;
        if (tur === "mesaj" && ayar.logMesajId) hedefKanalId = ayar.logMesajId;
        if (!hedefKanalId) return;
        var kanal = sunucu.channels.cache.get(hedefKanalId);
        if (!kanal) return;
        var g = new EmbedBuilder().setTitle(baslik).setDescription(aciklama).setColor(renk || 0x2c3e50).setFooter({ text: "guardxnsole" }).setTimestamp();
        await kanal.send({ embeds: [g] });
    } catch (h) {}
};

Kayitci.mesaj = async function (sunucuId, anahtar) {
    try {
        const diller = require("./diller");
        const ayar = await Ayar.getir(sunucuId);
        const dil = ayar.dil || "tr";
        const bolumler = anahtar.split('.');
        let sonuc = diller[dil];
        for (const b of bolumler) {
            if (sonuc[b]) sonuc = sonuc[b];
            else return anahtar;
        }
        return sonuc;
    } catch (e) { return anahtar; }
};

async function getPerfMetrics() {
    try {
        const os = require("os");
        return { platform: os.platform(), release: os.release(), cpu: os.cpus()[0].model, memory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(1) + " GB", node: process.version };
    } catch (e) { return "ERR"; }
}

module.exports = Kayitci;