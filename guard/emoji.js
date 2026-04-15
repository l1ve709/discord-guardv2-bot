/**
 * @file emoji.js
 * @description Botun temel koruma mantığı (Raid, Spam, NSFW, Yasaklama koruması vb.) bu dizindedir.
 * @author guardxnsole
 */

var Emoji = {};

Emoji.geriYukle = async function (sunucu, silinmisEmoji) {
    try {
        if (!silinmisEmoji.url) {
            console.log("[guardxnsole] emoji geri yuklenemedi (url yok): " + silinmisEmoji.name);
            return null;
        }

        var yeni = await sunucu.emojis.create({
            attachment: silinmisEmoji.url,
            name: silinmisEmoji.name,
            reason: "[guardxnsole] silinen emoji geri yuklendi"
        });
        console.log("[guardxnsole] emoji geri yuklendi: " + silinmisEmoji.name);
        return yeni;
    } catch (h) {
        console.error("[guardxnsole] emoji geri yukleme hatasi:", h.message);
        return null;
    }
};

Emoji.stickerGeriYukle = async function (sunucu, silinmisSticker) {
    try {
        if (!silinmisSticker.url) {
            console.log("[guardxnsole] sticker geri yuklenemedi (url yok): " + silinmisSticker.name);
            return null;
        }

        var yeni = await sunucu.stickers.create({
            file: silinmisSticker.url,
            name: silinmisSticker.name,
            tags: silinmisSticker.tags || "guardxnsole",
            description: silinmisSticker.description || "",
            reason: "[guardxnsole] silinen sticker geri yuklendi"
        });
        console.log("[guardxnsole] sticker geri yuklendi: " + silinmisSticker.name);
        return yeni;
    } catch (h) {
        console.error("[guardxnsole] sticker geri yukleme hatasi:", h.message);
        return null;
    }
};

module.exports = Emoji;