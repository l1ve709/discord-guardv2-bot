/**
 * @file sticker.sil.js
 * @description Discord olaylarını (mesaj, üye katılımı, kanal silme vb.) dinleyen ve guard filtrelerine yönlendiren modüller.
 * @author guardxnsole
 */

const { Events, AuditLogEvent } = require("discord.js");
const denetleyici = require("../guard/denetleyici");
const Emoji = require("../guard/emoji");
const Ceza = require("../tools/ceza");

module.exports = {
    ad: Events.GuildStickerDelete,
    birKez: false,
    calistir: async function (sticker, istemci) {
        var s = await denetleyici.kontrol({
            sunucu: sticker.guild,
            denetimTuru: AuditLogEvent.StickerDelete,
            eylemTuru: "sticker_sil",
            modulAdi: "emojiKoruma",
            limitAlani: "emojiLimit",
            istemci: istemci
        });

        if (s.ihlal) {
            await Emoji.stickerGeriYukle(sticker.guild, sticker);
            await Ceza.uygula(sticker.guild, s.yurutucu, "sticker_sil",
                "Toplu sticker silme: " + sticker.name, s.ayarlar.cezaTuru);
        }
    }
};