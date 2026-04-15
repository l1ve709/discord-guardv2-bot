/**
 * @file kanal.sil.js
 * @description Discord olaylarını (mesaj, üye katılımı, kanal silme vb.) dinleyen ve guard filtrelerine yönlendiren modüller.
 * @author guardxnsole
 */

const { Events, AuditLogEvent } = require("discord.js");
const denetleyici = require("../guard/denetleyici");
const Kanal = require("../guard/kanal");
const Ceza = require("../tools/ceza");

module.exports = {
    ad: Events.ChannelDelete,
    birKez: false,
    calistir: async function (kanal, istemci) {
        if (!kanal.guild) return;
        try {
            var s = await denetleyici.kontrol({
                sunucu: kanal.guild,
                denetimTuru: AuditLogEvent.ChannelDelete,
                eylemTuru: "kanal_sil",
                modulAdi: "kanalKoruma",
                limitAlani: "kanalLimit",
                istemci: istemci
            });

            if (s.ihlal) {
                await Kanal.geriYukle(kanal);
                await Ceza.uygula(kanal.guild, s.yurutucu, "kanal_sil",
                    "Yetkisiz kanal silme: #" + kanal.name,
                    s.ayarlar.cezaTuru || "banla");
            }
        } catch (h) {
            console.error("[guardxnsole] kanal silme hatasi:", h.message);
        }
    }
};