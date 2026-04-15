/**
 * @file spam.js
 * @description Spam ve reklam filtrelerini içerir.
 */

const Ayar = require("../models/ayar.model");
const Kayit = require("../models/kayit.model");
const kayitci = require("../tools/kayitci");
const yapilandirma = require("../config");

var Spam = {};

var sayac = {};
var ihlalSayac = {};

async function kontrolEt(mesaj) {
    if (!mesaj.guild || !mesaj.member) return;
    if (mesaj.member.permissions.has("Administrator")) return;

    var sunucuId = mesaj.guild.id;
    var kullaniciId = mesaj.author.id;
    var ayar = await Ayar.getir(sunucuId);

    if (!ayar.spamKoruma) return;

    if (!sayac[sunucuId]) sayac[sunucuId] = {};
    if (!sayac[sunucuId][kullaniciId]) sayac[sunucuId][kullaniciId] = [];

    var simdi = Date.now();
    sayac[sunucuId][kullaniciId].push(simdi);

    var esik = simdi - (ayar.spamSaniye * 1000);
    sayac[sunucuId][kullaniciId] = sayac[sunucuId][kullaniciId].filter(z => z > esik);

    if (sayac[sunucuId][kullaniciId].length >= ayar.spamMesajSinir) {
        sayac[sunucuId][kullaniciId] = [];

        try {
            await mesaj.delete().catch(() => { });

            var anahtar = sunucuId + ":" + kullaniciId;
            ihlalSayac[anahtar] = (ihlalSayac[anahtar] || 0) + 1;

            var sureler = [10, 600, 3600, 86400];
            var sIndex = Math.min(ihlalSayac[anahtar] - 1, sureler.length - 1);
            var cezaSuresi = sureler[sIndex];

            const warning = (await kayitci.mesaj(sunucuId, "GUARD.SPAM_UYARI"))
                .replace("{uye}", `<@${kullaniciId}>`)
                .replace("{sure}", cezaSuresi);

            await mesaj.channel.send({ content: warning }).then(m => setTimeout(() => m.delete().catch(() => { }), 5000));

            if (mesaj.member.moderatable) {
                await mesaj.member.timeout(cezaSuresi * 1000, "Spam koruması (İhlal #" + ihlalSayac[anahtar] + ")").catch(() => { });
            }

            await kayitci.log(mesaj.guild, "Spam Engelleme", `<@${kullaniciId}> spam yaptığı için ${cezaSuresi} saniye susturuldu. (İhlal #${ihlalSayac[anahtar]})`, 0xe67e22);
        } catch (e) { }
    }
}

async function reklamKontrol(mesaj) {
    if (!mesaj.guild || !mesaj.member) return false;
    if (mesaj.member.permissions.has("Administrator")) return false;

    var icerik = mesaj.content;
    var ayar = await Ayar.getir(mesaj.guild.id);
    if (!ayar.reklamKoruma) return false;

    var reklamVar = false;
    for (var desen of yapilandirma.reklamDesenleri) {
        if (desen.test(icerik)) {
            reklamVar = true;
            break;
        }
    }

    if (reklamVar) {
        try {
            await mesaj.delete().catch(() => { });
            const warning = (await kayitci.mesaj(mesaj.guild.id, "GUARD.REKLAM_UYARI")).replace("{uye}", `<@${mesaj.author.id}>`);
            await mesaj.channel.send({ content: warning }).then(m => setTimeout(() => m.delete().catch(() => { }), 5000));

            if (ayar.reklamCeza === "sustur" && mesaj.member.moderatable) {
                await mesaj.member.timeout((ayar.spamSusturSure || 600) * 1000, "Reklam koruması").catch(() => { });
            } else if (ayar.reklamCeza === "at" && mesaj.member.kickable) {
                await mesaj.member.kick("Reklam koruması").catch(() => { });
            } else if (ayar.reklamCeza === "yasakla" && mesaj.member.bannable) {
                await mesaj.member.ban({ reason: "Reklam koruması" }).catch(() => { });
            }

            await Kayit.ekle({
                sunucuId: mesaj.guild.id, kullaniciId: mesaj.author.id,
                kullaniciAdi: mesaj.author.tag || mesaj.author.username,
                islem: "reklam", detay: icerik.substring(0, 200), ceza: ayar.reklamCeza
            });

            await kayitci.log(mesaj.guild, "Reklam Tespit", `<@${mesaj.author.id}> reklam yaptı ve cezalandırıldı.`, 0xff0000);
        } catch (e) { }
        return true;
    }
    return false;
}

setInterval(function () {
    var simdi = Date.now();
    var temizlemeEsigi = 10 * 60 * 1000; 

    Object.keys(sayac).forEach(sunucuId => {
        if (sayac[sunucuId]) {
            Object.keys(sayac[sunucuId]).forEach(kullaniciId => {
                sayac[sunucuId][kullaniciId] = sayac[sunucuId][kullaniciId].filter(z => simdi - z < temizlemeEsigi);
                if (sayac[sunucuId][kullaniciId].length === 0) delete sayac[sunucuId][kullaniciId];
            });
            if (Object.keys(sayac[sunucuId]).length === 0) delete sayac[sunucuId];
        }
    });

    
}, 5 * 60 * 1000);

module.exports = { kontrolEt, reklamKontrol };