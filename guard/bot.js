/**
 * @file bot.js
 * @description Botun temel koruma mantığı (Raid, Spam, NSFW, Yasaklama koruması vb.) bu dizindedir.
 * @author guardxnsole
 */

const { AuditLogEvent } = require("discord.js");
const Denetleyici = require("./denetleyici");
const Ceza = require("../tools/ceza");
const kayitci = require("../tools/kayitci");
const Whitelist = require("../models/whitelist.model");

var BotKoruma = {};

BotKoruma.kontrolEt = async function (uye, istemci) {
    if (!uye.user.bot) return;

    var sunucu = uye.guild;
    try {
        var sonuc = await Denetleyici.kontrol({
            sunucu: sunucu,
            denetimTuru: AuditLogEvent.BotAdd,
            eylemTuru: "bot_ekleme",
            modulAdi: "botKoruma",
            limitAlani: "botLimit", 
            istemci: istemci
        });

        if (!sonuc.ayarlar || !sonuc.ayarlar.botKoruma) return;

        
        var dk = await sunucu.fetchAuditLogs({ limit: 1, type: AuditLogEvent.BotAdd });
        var giris = dk.entries.first();
        if (!giris) return;
        if (giris.target.id !== uye.id) return;

        var yurutucu = giris.executor;
        
        
        var wl = await Whitelist.kontrol(sunucu.id, yurutucu.id);
        if (wl) return;

        
        try {
            await uye.ban({ reason: "[guardxnsole] yetkisiz bot girişi" });
            console.log("[guardxnsole] yetkisiz bot yasaklandi: " + uye.user.tag);
        } catch (e) {
            console.error("[guardxnsole] bot yasaklama hatasi:", e.message);
        }

        await Ceza.uygula(sunucu, yurutucu, "bot_ekleme", 
            "Yetkisiz bot ekledi: " + uye.user.tag, 
            sonuc.ayarlar.cezaTuru || "banla");

    } catch (h) {
        console.error("[guardxnsole] bot koruma hatasi:", h.message);
    }
};

module.exports = BotKoruma;
