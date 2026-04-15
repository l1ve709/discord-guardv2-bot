/**
 * @file denetleyici.js
 * @description Botun temel koruma mantığı (Raid, Spam, NSFW, Yasaklama koruması vb.) bu dizindedir.
 * @author guardxnsole
 */

const Ayar = require("../models/ayar.model");
const Whitelist = require("../models/whitelist.model");
const yapilandirma = require("../config");

var sayaclar = {};

function temizle(sunucuId, eylemTuru, kullaniciId) {
    var anahtar = sunucuId + ":" + eylemTuru + ":" + kullaniciId;
    if (!sayaclar[anahtar]) return;
    delete sayaclar[anahtar];
}

function sayacArttir(sunucuId, eylemTuru, kullaniciId, limitSuresi) {
    var anahtar = sunucuId + ":" + eylemTuru + ":" + kullaniciId;
    if (!sayaclar[anahtar]) sayaclar[anahtar] = [];
    sayaclar[anahtar].push(Date.now());
    var esik = Date.now() - (limitSuresi * 1000);
    sayaclar[anahtar] = sayaclar[anahtar].filter(function (z) { return z > esik; });
    return sayaclar[anahtar].length;
}

var Denetleyici = {};

Denetleyici.kontrol = async function (secenekler) {
    var sonuc = { ihlal: false, yurutucu: null, ayarlar: null };
    try {
        var sunucu = secenekler.sunucu;
        var denetimTuru = secenekler.denetimTuru;
        var eylemTuru = secenekler.eylemTuru;
        var modulAdi = secenekler.modulAdi;
        var limitAlani = secenekler.limitAlani;
        var istemci = secenekler.istemci;
        var ayar = await Ayar.getir(sunucu.id);
        sonuc.ayarlar = ayar;
        if (!ayar[modulAdi]) return sonuc;
        var dk;
        try {
            dk = await sunucu.fetchAuditLogs({ limit: 5, type: denetimTuru });
        } catch (e) { return sonuc; }
        var giris = dk.entries.find(e => (Date.now() - e.createdTimestamp) < 15000);
        if (!giris) return sonuc;
        var yurutucu = giris.executor;
        if (!yurutucu || yurutucu.id === istemci.user.id || yurutucu.id === sunucu.ownerId || yurutucu.id === yapilandirma.sahipId) return sonuc;
        var wl = await Whitelist.kontrol(sunucu.id, yurutucu.id);
        if (wl) return sonuc;
        if (ayar.muafRoller && ayar.muafRoller.length > 0) {
            try {
                var uye = await sunucu.members.fetch(yurutucu.id);
                if (uye) {
                    for (var i = 0; i < ayar.muafRoller.length; i++) {
                        if (uye.roles.cache.has(ayar.muafRoller[i].trim())) return sonuc;
                    }
                }
            } catch (e) {}
        }
        sonuc.yurutucu = yurutucu;
        var limit = ayar[limitAlani] || 3;
        try {
            var uye = await sunucu.members.fetch(yurutucu.id);
            if (uye && uye.permissions.has("Administrator")) {
                var carpan = ayar.adminLimitMultiplier || yapilandirma.adminLimitMultiplier || 3;
                limit = limit * carpan;
            }
        } catch (e) {}
        var miktar = sayacArttir(sunucu.id, eylemTuru, yurutucu.id, ayar.limitSuresi || 15);
        if (miktar >= limit) {
            sonuc.ihlal = true;
            temizle(sunucu.id, eylemTuru, yurutucu.id);
        }
    } catch (h) {}
    return sonuc;
};

setInterval(function () {
    var esik = Date.now() - 60000;
    Object.keys(sayaclar).forEach(function (anahtar) {
        sayaclar[anahtar] = sayaclar[anahtar].filter(function (z) { return z > esik; });
        if (sayaclar[anahtar].length === 0) delete sayaclar[anahtar];
    });
}, 30000);

module.exports = Denetleyici;