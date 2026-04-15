/**
 * @file whitelist.model.js
 * @description Veritabanı tabloları ve veri modelleri için abstraction katmanı.
 * @author guardxnsole
 */

const { havuzGetir } = require("../baglanti/db");

var whitelist = {};

whitelist.ekle = async function (sunucuId, kullaniciId, ekleyenId) {
    var havuz = havuzGetir();
    var [s] = await havuz.execute(
        "INSERT IGNORE INTO whitelist (sunucu_id, kullanici_id, ekleyen_id) VALUES (?,?,?)",
        [sunucuId, kullaniciId, ekleyenId]
    );
    return s.affectedRows > 0;
};

whitelist.cikar = async function (sunucuId, kullaniciId) {
    var havuz = havuzGetir();
    var [s] = await havuz.execute(
        "DELETE FROM whitelist WHERE sunucu_id = ? AND kullanici_id = ?",
        [sunucuId, kullaniciId]
    );
    return s.affectedRows > 0;
};

whitelist.kontrol = async function (sunucuId, kullaniciId) {
    var havuz = havuzGetir();
    var [s] = await havuz.execute(
        "SELECT id FROM whitelist WHERE sunucu_id = ? AND kullanici_id = ?",
        [sunucuId, kullaniciId]
    );
    return s.length > 0;
};

whitelist.listele = async function (sunucuId) {
    var havuz = havuzGetir();
    var [s] = await havuz.execute(
        "SELECT kullanici_id, ekleyen_id, tarih FROM whitelist WHERE sunucu_id = ? ORDER BY tarih DESC",
        [sunucuId]
    );
    return s;
};

module.exports = whitelist;