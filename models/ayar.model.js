/**
 * @file ayar.model.js
 * @description Veritabanı tabloları ve veri modelleri için abstraction katmanı.
 */

const { havuzGetir } = require("../baglanti/db");
const yapilandirma = require("../config");

var onbellek = {};
var Ayar = {};

Ayar.getir = async function (sunucuId) {
    if (onbellek[sunucuId]) return onbellek[sunucuId];
    var havuz = havuzGetir();
    var [s] = await havuz.execute("SELECT * FROM ayarlar WHERE sunucu_id = ?", [sunucuId]);
    if (s.length === 0) {
        await Ayar.olustur(sunucuId);
        var [y] = await havuz.execute("SELECT * FROM ayarlar WHERE sunucu_id = ?", [sunucuId]);
        onbellek[sunucuId] = donustur(y[0]);
        return onbellek[sunucuId];
    }
    onbellek[sunucuId] = donustur(s[0]);
    return onbellek[sunucuId];
};

function b(val) { return val ? 1 : 0; }

Ayar.olustur = async function (sunucuId) {
    var havuz = havuzGetir();
    var v = yapilandirma.varsayilan;
    var sql = `INSERT OR IGNORE INTO ayarlar (sunucu_id, kanal_koruma, rol_koruma, ban_koruma, kick_koruma, bot_koruma, sunucu_koruma, webhook_koruma, emoji_koruma, spam_koruma, raid_koruma, reklam_koruma, nsfw_koruma, vanity_koruma, mention_limit, kick_limit, kanal_limit, rol_limit, ban_limit, webhook_limit, alarm_sistemi, admin_limit_multiplier, emoji_limit, limit_suresi, spam_mesaj_sinir, spam_saniye, spam_sustur_sure, raid_katilim_sinir, raid_saniye, ceza_turu, reklam_ceza, dil, prefix, prefix_aktif) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    await havuz.execute(sql, [sunucuId, b(v.kanalKoruma), b(v.rolKoruma), b(v.banKoruma), b(v.kickKoruma), b(v.botKoruma), b(v.sunucuKoruma), b(v.webhookKoruma), b(v.emojiKoruma), b(v.spamKoruma), b(v.raidKoruma), b(v.reklamKoruma), b(v.nsfwKoruma), b(v.vanityKoruma), v.mentionLimit, v.kickLimit, v.kanalLimit, v.rolLimit, v.banLimit, v.webhookLimit, b(v.alarmSistemi), v.adminLimitMultiplier, v.emojiLimit, v.limitSuresi, v.spamMesajSinir, v.spamSaniye, v.spamSusturSure, v.raidKatilimSinir, v.raidSaniye, v.cezaTuru, v.reklamCeza, "tr", ".", 0]);
};

Ayar.guncelle = async function (sunucuId, alan, deger) {
    var havuz = havuzGetir();
    var izinli = ["kanal_koruma","rol_koruma","ban_koruma","kick_koruma","bot_koruma","sunucu_koruma","webhook_koruma","emoji_koruma","spam_koruma","raid_koruma", "reklam_koruma", "nsfw_koruma","vanity_koruma","mention_limit","kick_limit","alarm_sistemi","admin_limit_multiplier","kanal_limit","rol_limit","ban_limit","webhook_limit","emoji_limit","limit_suresi","spam_mesaj_sinir","spam_saniye","spam_sustur_sure","raid_katilim_sinir","raid_saniye","ceza_turu","reklam_ceza","log_kanal_id", "log_mod_id", "log_ses_id", "log_mesaj_id", "muaf_roller", "dil", "prefix", "prefix_aktif"];
    if (!izinli.includes(alan)) return false;
    await havuz.execute("UPDATE ayarlar SET " + alan + " = ? WHERE sunucu_id = ?", [deger, sunucuId]);
    delete onbellek[sunucuId];
    return true;
};

function donustur(s) {
    return {
        sunucuId: s.sunucu_id, kanalKoruma: !!s.kanal_koruma, rolKoruma: !!s.rol_koruma, banKoruma: !!s.ban_koruma, kickKoruma: !!s.kick_koruma, botKoruma: !!s.bot_koruma, sunucu_koruma: !!s.sunucu_koruma, webhookKoruma: !!s.webhook_koruma, emojiKoruma: !!s.emoji_koruma, spamKoruma: !!s.spam_koruma, raidKoruma: !!s.raid_koruma, reklamKoruma: !!s.reklam_koruma, vanityKoruma: !!s.vanity_koruma, nsfwKoruma: !!s.nsfw_koruma, mentionLimit: s.mention_limit, kickLimit: s.kick_limit, alarmSistemi: !!s.alarm_sistemi, adminLimitMultiplier: s.admin_limit_multiplier, kanalLimit: s.kanal_limit, rolLimit: s.rol_limit, banLimit: s.ban_limit, webhookLimit: s.webhook_limit, emojiLimit: s.emoji_limit, limitSuresi: s.limit_suresi, spamMesajSinir: s.spam_mesaj_sinir, spamSaniye: s.spam_saniye, spamSusturSure: s.spam_sustur_sure, raidKatilimSinir: s.raid_katilim_sinir, raidSaniye: s.raid_saniye, cezaTuru: s.ceza_turu, reklamCeza: s.reklam_ceza, logKanalId: s.log_kanal_id, logModId: s.log_mod_id, logSesId: s.log_ses_id, logMesajId: s.log_mesaj_id, muafRoller: s.muaf_roller ? s.muaf_roller.split(",") : [], dil: s.dil || "tr", prefix: s.prefix || ".", prefixAktif: !!s.prefix_aktif
    };
}

module.exports = Ayar;