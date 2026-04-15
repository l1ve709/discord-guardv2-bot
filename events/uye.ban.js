/**
 * @file uye.ban.js
 * @description Discord olaylarını (mesaj, üye katılımı, kanal silme vb.) dinleyen ve guard filtrelerine yönlendiren modüller.
 * @author guardxnsole
 */

const { Events, AuditLogEvent } = require("discord.js");
const denetleyici = require("../guard/denetleyici");
const Ban = require("../guard/ban");
const Ceza = require("../tools/ceza");

module.exports = {
    ad: Events.GuildBanAdd,
    birKez: false,
    calistir: async function (ban, istemci) {
        var s = await denetleyici.kontrol({
            sunucu: ban.guild,
            denetimTuru: AuditLogEvent.MemberBanAdd,
            eylemTuru: "uye_banla",
            modulAdi: "banKoruma",
            limitAlani: "banLimit",
            istemci: istemci
        });

        if (s.ihlal) {
            await Ban.geriAl(ban.guild, ban.user);
            await Ceza.uygula(ban.guild, s.yurutucu, "toplu_ban",
                "Toplu banlama tespit: " + (ban.user.tag || ban.user.id), s.ayarlar.cezaTuru);
        }
    }
};