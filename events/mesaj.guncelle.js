/**
 * @file mesaj.guncelle.js
 * @description Discord olaylarını (mesaj, üye katılımı, kanal silme vb.) dinleyen ve guard filtrelerine yönlendiren modüller.
 * @author guardxnsole
 */

const { Events } = require("discord.js");
const nsfw = require("../guard/nsfw");

module.exports = {
    ad: Events.MessageUpdate,
    birKez: false,
    calistir: async function (eskiMesaj, yeniMesaj, istemci) {
        
        if (yeniMesaj.partial) {
            try { yeniMesaj = await yeniMesaj.fetch(); } catch(e) { return; }
        }
        if (!yeniMesaj.guild) return;
        if (yeniMesaj.author && yeniMesaj.author.bot) return;

        var embedVar = yeniMesaj.embeds && yeniMesaj.embeds.length > 0;
        var ekVar = yeniMesaj.attachments && yeniMesaj.attachments.size > 0;

        if (embedVar || ekVar) {
            console.log("[guardxnsole] [MESAJ-GUNCELLE] Embed/ek tespit edildi, NSFW taramasi baslatiliyor...");
            await nsfw.kontrolEt(yeniMesaj);
        }
    }
};
