/**
 * @file vanity.js
 * @description Botun temel koruma mantığı (Raid, Spam, NSFW, Yasaklama koruması vb.) bu dizindedir.
 * @author guardxnsole
 */

const { AuditLogEvent } = require("discord.js");
const Denetleyici = require("./denetleyici");
const Ceza = require("../tools/ceza");
const kayitci = require("../tools/kayitci");

var VanityKoruma = {};

VanityKoruma.kontrolEt = async function (eskiSunucu, yeniSunucu, istemci) {
    if (eskiSunucu.vanityURLCode === yeniSunucu.vanityURLCode) return;

    try {
        var sonuc = await Denetleyici.kontrol({
            sunucu: yeniSunucu,
            denetimTuru: AuditLogEvent.GuildUpdate,
            eylemTuru: "vanity_degisimi",
            modulAdi: "vanityKoruma",
            limitAlani: "vanityLimit", 
            istemci: istemci
        });

        if (!sonuc.ayarlar || !sonuc.ayarlar.vanityKoruma) return;
        if (!sonuc.ihlal) return;

        
        
        try {
            await yeniSunucu.setVanityCode(eskiSunucu.vanityURLCode, "[guardxnsole] yetkisiz URL değişimi engellendi");
        } catch (e) {
            console.error("[guardxnsole] vanity geri alma hatasi:", e.message);
        }

        await Ceza.uygula(yeniSunucu, sonuc.yurutucu, "vanity_degisimi",
            "Sunucu URL'sini değiştirdi: " + eskiSunucu.vanityURLCode + " -> " + yeniSunucu.vanityURLCode,
            sonuc.ayarlar.cezaTuru || "banla");

    } catch (h) {
        console.error("[guardxnsole] vanity koruma hatasi:", h.message);
    }
};

module.exports = VanityKoruma;
