/**
 * @file kayit.model.js
 * @description Veritabanı tabloları ve veri modelleri için abstraction katmanı.
 * @author guardxnsole
 */

const { havuzGetir } = require("../baglanti/db");

var Kayit = {};

Kayit.ekle = async function (v) {
    var havuz = havuzGetir();
    await havuz.execute(
        "INSERT INTO kayitlar (sunucu_id, kullanici_id, kullanici_adi, islem, detay, ceza) VALUES (?,?,?,?,?,?)",
        [v.sunucuId, v.kullaniciId, v.kullaniciAdi || "", v.islem, v.detay || "", v.ceza || ""]
    );
};

Kayit.listele = async function (sunucuId, limit) {
    var havuz = havuzGetir();
    var l = parseInt(limit) || 20;
    var [s] = await havuz.execute(
        "SELECT * FROM kayitlar WHERE sunucu_id = ? ORDER BY tarih DESC LIMIT " + l,
        [sunucuId]
    );
    return s;
};

module.exports = Kayit;