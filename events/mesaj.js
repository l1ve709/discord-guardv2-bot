/**
 * @file mesaj.js
 * @description Discord olaylarını (mesaj, üye katılımı, kanal silme vb.) dinleyen ve guard filtrelerine yönlendiren modüller.
 * @author guardxnsole
 */

const { Events, PermissionFlagsBits } = require("discord.js");
const spam = require("../guard/spam");
const mention = require("../guard/mention");
const nsfw = require("../guard/nsfw");
const Ayar = require("../models/ayar.model");

module.exports = {
    ad: Events.MessageCreate,
    birKez: false,
    calistir: async function (mesaj, istemci) {
        if (!mesaj.guild || mesaj.author.bot) return;

        var reklam = await spam.reklamKontrol(mesaj);
        if (reklam) return;

        var etiket = await mention.kontrolEt(mesaj);
        if (etiket) return;

        var m_nsfw = await nsfw.kontrolEt(mesaj);
        if (m_nsfw) return;

        await spam.kontrolEt(mesaj);

        var ayar = await Ayar.getir(mesaj.guild.id);
        if (ayar.prefixAktif) {
            var p = ayar.prefix || ".";
            if (mesaj.content.startsWith(p)) {
                var args = mesaj.content.slice(p.length).trim().split(/ +/g);
                var komutAdi = args.shift().toLowerCase();
                var k = istemci.komutlar.get(komutAdi);

                if (k) {
                    if (k.veri && k.veri.default_member_permissions) {
                        if (!mesaj.member.permissions.has(BigInt(k.veri.default_member_permissions))) return;
                    }

                    try {
                        if (k.prefixCalistir) {
                            await k.prefixCalistir(mesaj, args, istemci);
                        } else {

                        }
                    } catch (h) {
                        console.error("[guardxnsole] prefix komut hatasi:", h.message);
                    }
                }
            }
        }
    }
};
