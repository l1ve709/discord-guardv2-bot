/**
 * @file mention.js
 * @description Botun temel koruma mantığı (Raid, Spam, NSFW, Yasaklama koruması vb.) bu dizindedir.
 * @author guardxnsole
 */

const Ayar = require("../models/ayar.model");
const Whitelist = require("../models/whitelist.model");
const yapilandirma = require("../config");
const Kayit = require("../models/kayit.model");
const kayitci = require("../tools/kayitci");

var MentionKoruma = {};

MentionKoruma.kontrolEt = async function (mesaj) {
    if (!mesaj.guild) return false;
    if (mesaj.author.bot) return false;
    if (mesaj.author.id === mesaj.guild.ownerId) return false;
    if (yapilandirma.sahipler.includes(mesaj.author.id)) return false;

    var ayar = await Ayar.getir(mesaj.guild.id);
    if (!ayar.mentionLimit) return false;

    if (mesaj.member && mesaj.member.permissions.has("Administrator")) return false;

    var wl = await Whitelist.kontrol(mesaj.guild.id, mesaj.author.id);
    if (wl) return false;

    var etiketSayisi = mesaj.mentions.users.size + mesaj.mentions.roles.size;
    if (mesaj.mentions.everyone) etiketSayisi += 5; 

    if (etiketSayisi >= ayar.mentionLimit) {
        try { await mesaj.delete(); } catch (e) {  }

        if (mesaj.member) {
            try {
                await mesaj.member.timeout(600000, "[guardxnsole] mention spam");
            } catch (e) {
                console.error("[guardxnsole] mention susturma hatasi:", e.message);
            }
        }

        await Kayit.ekle({
            sunucuId: mesaj.guild.id, kullaniciId: mesaj.author.id,
            kullaniciAdi: mesaj.author.tag || mesaj.author.username,
            islem: "mention_spam",
            detay: etiketSayisi + " etiket",
            ceza: "sustur"
        });

        await kayitci.log(mesaj.guild, "Mention Spam Tespit",
            mesaj.author.tag + " | " + etiketSayisi + " etiket ile susturuldu", 0xf1c40f);

        console.log("[guardxnsole] mention spam: " + mesaj.author.tag);
        return true;
    }

    return false;
};

module.exports = MentionKoruma;
