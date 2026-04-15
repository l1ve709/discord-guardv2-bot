/**
 * @file kanal.olustur.js
 * @description Discord olaylarını (mesaj, üye katılımı, kanal silme vb.) dinleyen ve guard filtrelerine yönlendiren modüller.
 * @author guardxnsole
 */

const { Events, AuditLogEvent } = require("discord.js");
const denetleyici = require("../guard/denetleyici");
const Kanal = require("../guard/kanal");
const Ceza = require("../tools/ceza");

module.exports = {
    ad: Events.ChannelCreate, birKez: false,
    calistir: async function (kanal, istemci) {
        if (!kanal.guild) return;
        var s = await denetleyici.kontrol({ sunucu: kanal.guild, denetimTuru: AuditLogEvent.ChannelCreate, eylemTuru: "kanal_olustur", modulAdi: "kanalKoruma", limitAlani: "kanalLimit", istemci: istemci });
        if (s.ihlal) { await Kanal.sil(kanal); await Ceza.uygula(kanal.guild, s.yurutucu, "kanal_olustur", "Yetkisiz kanal olusturma: " + kanal.name, s.ayarlar.cezaTuru); }
    }
};