/**
 * @file webhook.js
 * @description Botun temel koruma mantığı (Raid, Spam, NSFW, Yasaklama koruması vb.) bu dizindedir.
 * @author guardxnsole
 */

const { AuditLogEvent } = require("discord.js");
const Denetleyici = require("./denetleyici");
const Ceza = require("../tools/ceza");

var Webhook = {};

Webhook.kontrolEt = async function (kanal, istemci) {
    try {
        var sunucu = kanal.guild;
        var sonuc = await Denetleyici.kontrol({
            sunucu: sunucu,
            denetimTuru: AuditLogEvent.WebhookCreate,
            eylemTuru: "webhook_olusturma",
            modulAdi: "webhookKoruma",
            limitAlani: "webhookLimit",
            istemci: istemci
        });

        if (!sonuc.ayarlar || !sonuc.ayarlar.webhookKoruma) return;

        if (sonuc.ihlal) {
            
            var wh = await kanal.fetchWebhooks();
            for (var [, w] of wh) {
                try { await w.delete("[guardxnsole] yetkisiz webhook"); } catch (e) {  }
            }

            await Ceza.uygula(sunucu, sonuc.yurutucu, "webhook_olusturma",
                "Yetkisiz webhook oluşturuldu: #" + kanal.name, 
                sonuc.ayarlar.cezaTuru || "banla");
        }
    } catch (h) {
        console.error("[guardxnsole] webhook koruma hatasi:", h.message);
    }
};

module.exports = Webhook;