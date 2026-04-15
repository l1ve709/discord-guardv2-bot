/**
 * @file kanal.guncelle.js
 * @description Discord olaylarını (mesaj, üye katılımı, kanal silme vb.) dinleyen ve guard filtrelerine yönlendiren modüller.
 * @author guardxnsole
 */

const { Events, AuditLogEvent } = require("discord.js");
const denetleyici = require("../guard/denetleyici");
const Kanal = require("../guard/kanal");
const Ceza = require("../tools/ceza");

module.exports = {
    ad: Events.ChannelUpdate,
    birKez: false,
    calistir: async function (eski, yeni, istemci) {
        if (!yeni.guild) return;

        var s = await denetleyici.kontrol({
            sunucu: yeni.guild,
            denetimTuru: AuditLogEvent.ChannelUpdate,
            eylemTuru: "kanal_guncelle",
            modulAdi: "kanalKoruma",
            limitAlani: "kanalLimit",
            istemci: istemci
        });

        if (s.ihlal) {
            await Kanal.geriAl(eski, yeni);
            await Ceza.uygula(yeni.guild, s.yurutucu, "kanal_guncelle",
                "Yetkisiz kanal degisikligi: " + eski.name, s.ayarlar.cezaTuru);
        }
    }
};