/**
 * @file kick.js
 * @description Botun temel koruma mantığı (Raid, Spam, NSFW, Yasaklama koruması vb.) bu dizindedir.
 * @author guardxnsole
 */

var BotKoruma = {};

BotKoruma.kaldir = async function (uye) {
    try {
        if (uye.kickable) {
            await uye.kick("[guardxnsole] yetkisiz bot ekleme");
            console.log("[guardxnsole] yetkisiz bot atildi: " + (uye.user.tag || uye.user.id));
        } else {
            console.log("[guardxnsole] bot atilamadi (yetki yok): " + (uye.user.tag || uye.user.id));
        }
    } catch (h) {
        console.error("[guardxnsole] bot atma hatasi:", h.message);
    }
};

module.exports = BotKoruma;
