/**
 * @file raid.js
 * @description Botun temel koruma mantığı (Raid, Spam, NSFW, Yasaklama koruması vb.) bu dizindedir.
 * @author guardxnsole
 */

const Alarm = require("./alarm");
const Ayar = require("../models/ayar.model");
const kayitci = require("../tools/kayitci");

var katilimlar = {};
var kilitli = {};

async function katilimKontrol(uye) {
    var sId = uye.guild.id;
    try {
        var ayar = await Ayar.getir(sId);
        if (!ayar.raidKoruma) return false;

        if (!katilimlar[sId]) katilimlar[sId] = [];
        katilimlar[sId].push(Date.now());

        var esik = Date.now() - (ayar.raidSaniye * 1000);
        katilimlar[sId] = katilimlar[sId].filter(function (z) { return z > esik; });

        if (katilimlar[sId].length >= ayar.raidKatilimSinir) {
            katilimlar[sId] = [];
            if (kilitli[sId]) return true;
            kilitli[sId] = true;

            console.log("[guardxnsole] RAID TESPIT: " + uye.guild.name);
            try { await uye.guild.setVerificationLevel(4, "[guardxnsole] raid"); } catch (e) {  }

            await Alarm.baslat(uye.guild);

            await kayitci.log(uye.guild, "RAID TESPIT",
                ayar.raidKatilimSinir + " kisi / " + ayar.raidSaniye + " sn\n5 dk sonra koruma normale donecek.", 0xff0000);

            setTimeout(async function () {
                try {
                    await uye.guild.setVerificationLevel(1, "[guardxnsole] raid bitti");
                    delete kilitli[sId];
                    await kayitci.log(uye.guild, "Raid Bitti", "Dogrulama normale dondu.", 0x27ae60);
                } catch (e) {  }
            }, 300000);

            return true;
        }
    } catch (h) {
        console.error("[guardxnsole] raid hatasi:", h.message);
    }
    return false;
}

module.exports = { katilimKontrol };