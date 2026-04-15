/**
 * @file uye.yolla.js
 * @description Discord olaylarını (mesaj, üye katılımı, kanal silme vb.) dinleyen ve guard filtrelerine yönlendiren modüller.
 * @author guardxnsole
 */

const { Events, AuditLogEvent } = require("discord.js");
const denetleyici = require("../guard/denetleyici");
const Ceza = require("../tools/ceza");

module.exports = {
    ad: Events.GuildMemberRemove,
    birKez: false,
    calistir: async function (uye, istemci) {
        try {
            var dk = await uye.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberKick });
            var giris = dk.entries.first();
            if (!giris) return;
            if (Date.now() - giris.createdTimestamp > 5000) return;
            if (giris.target.id !== uye.id) return;

            var s = await denetleyici.kontrol({
                sunucu: uye.guild,
                denetimTuru: AuditLogEvent.MemberKick,
                eylemTuru: "uye_at",
                modulAdi: "kickKoruma",
                limitAlani: "kickLimit",
                istemci: istemci
            });

            if (s.ihlal) {
                await Ceza.uygula(uye.guild, s.yurutucu, "toplu_kick",
                    "Toplu atma tespit: " + (uye.user.tag || uye.user.id), s.ayarlar.cezaTuru);
            }
        } catch (h) {
            console.error("[guardxnsole] kick kontrol hatasi:", h.message);
        }
    }
};