/**
 * @file db.js
 * @description Veritabanı ve tablo yönetimi.
 */

const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const yol = require("path");

var db = null;

/**
 * Veritabanına bağlanır ve gerekli tabloları sırayla oluşturur.
 */
function veritabaniBaglan() {
    return new Promise((resolve, reject) => {
        const dbDir = yol.join(__dirname, '..', 'database');
        const dbPath = yol.join(dbDir, 'database.sqlite');
        if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
        
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) return reject(err);
            
            
            db.serialize(async () => {
                try {
                    console.log("[guardxnsole] Veritabanı tabloları kontrol ediliyor...");
                    
                    
                    await runQuery(`CREATE TABLE IF NOT EXISTS ayarlar (sunucu_id TEXT PRIMARY KEY)`);
                    await runQuery(`CREATE TABLE IF NOT EXISTS whitelist (id INTEGER PRIMARY KEY AUTOINCREMENT, sunucu_id TEXT, kullanici_id TEXT, ekleyen_id TEXT, tarih DATETIME DEFAULT CURRENT_TIMESTAMP)`);
                    await runQuery(`CREATE TABLE IF NOT EXISTS kayitlar (sunucu_id TEXT, kullanici_id TEXT, kullanici_adi TEXT, islem TEXT, detay TEXT, ceza TEXT, tarih DATETIME DEFAULT CURRENT_TIMESTAMP)`);

                    
                    const sutunlar = [
                        { ad: "kanal_koruma", tip: "INTEGER DEFAULT 1" },
                        { ad: "rol_koruma", tip: "INTEGER DEFAULT 1" },
                        { ad: "ban_koruma", tip: "INTEGER DEFAULT 1" },
                        { ad: "kick_koruma", tip: "INTEGER DEFAULT 1" },
                        { ad: "bot_koruma", tip: "INTEGER DEFAULT 1" },
                        { ad: "sunucu_koruma", tip: "INTEGER DEFAULT 1" },
                        { ad: "webhook_koruma", tip: "INTEGER DEFAULT 1" },
                        { ad: "emoji_koruma", tip: "INTEGER DEFAULT 1" },
                        { ad: "spam_koruma", tip: "INTEGER DEFAULT 1" },
                        { ad: "raid_koruma", tip: "INTEGER DEFAULT 1" },
                        { ad: "reklam_koruma", tip: "INTEGER DEFAULT 1" },
                        { ad: "nsfw_koruma", tip: "INTEGER DEFAULT 1" },
                        { ad: "vanity_koruma", tip: "INTEGER DEFAULT 1" },
                        { ad: "mention_limit", tip: "INTEGER DEFAULT 5" },
                        { ad: "kick_limit", tip: "INTEGER DEFAULT 3" },
                        { ad: "kanal_limit", tip: "INTEGER DEFAULT 3" },
                        { ad: "rol_limit", tip: "INTEGER DEFAULT 3" },
                        { ad: "ban_limit", tip: "INTEGER DEFAULT 3" },
                        { ad: "webhook_limit", tip: "INTEGER DEFAULT 2" },
                        { ad: "alarm_sistemi", tip: "INTEGER DEFAULT 1" },
                        { ad: "admin_limit_multiplier", tip: "INTEGER DEFAULT 3" },
                        { ad: "emoji_limit", tip: "INTEGER DEFAULT 3" },
                        { ad: "limit_suresi", tip: "INTEGER DEFAULT 15" },
                        { ad: "spam_mesaj_sinir", tip: "INTEGER DEFAULT 5" },
                        { ad: "spam_saniye", tip: "INTEGER DEFAULT 4" },
                        { ad: "spam_sustur_sure", tip: "INTEGER DEFAULT 10" },
                        { ad: "raid_katilim_sinir", tip: "INTEGER DEFAULT 10" },
                        { ad: "raid_saniye", tip: "INTEGER DEFAULT 8" },
                        { ad: "ceza_turu", tip: "TEXT DEFAULT 'banla'" },
                        { ad: "reklam_ceza", tip: "TEXT DEFAULT 'banla'" },
                        { ad: "log_kanal_id", tip: "TEXT" },
                        { ad: "log_mod_id", tip: "TEXT" },
                        { ad: "log_ses_id", tip: "TEXT" },
                        { ad: "log_mesaj_id", tip: "TEXT" },
                        { ad: "muaf_roller", tip: "TEXT" },
                        { ad: "dil", tip: "TEXT DEFAULT 'tr'" },
                        { ad: "prefix", tip: "TEXT DEFAULT '.'" },
                        { ad: "prefix_aktif", tip: "INTEGER DEFAULT 0" }
                    ];

                    
                    const rows = await allQuery(`PRAGMA table_info(ayarlar)`);
                    const mevcutSutunlar = rows.map(r => r.name);
                    
                    for (const s of sutunlar) {
                        if (!mevcutSutunlar.includes(s.ad)) {
                            await runQuery(`ALTER TABLE ayarlar ADD COLUMN ${s.ad} ${s.tip}`);
                            console.log(`[guardxnsole] Yeni sütun eklendi: ${s.ad}`);
                        }
                    }

                    console.log("[guardxnsole] Veritabanı hazır.");
                    resolve();
                } catch (h) {
                    console.error("[guardxnsole] Veritabanı hazırlık hatası:", h.message);
                    reject(h);
                }
            });
        });
    });
}

/**
 * Yardımcı fonksiyon: db.run promisified
 */
function runQuery(sql, params = []) {
    return new Promise((res, rej) => {
        db.run(sql, params, (err) => {
            if (err) rej(err);
            else res();
        });
    });
}

/**
 * Yardımcı fonksiyon: db.all promisified
 */
function allQuery(sql, params = []) {
    return new Promise((res, rej) => {
        db.all(sql, params, (err, rows) => {
            if (err) rej(err);
            else res(rows);
        });
    });
}

/**
 * Veritabanı havuzunu simüle eder.
 */
function havuzGetir() {
    return {
        execute: async function (query, params = []) {
            query = query.replace(/INSERT IGNORE INTO/gi, 'INSERT OR IGNORE INTO');
            return new Promise((res, rej) => {
                const handler = function(err, rows) {
                    if (err) {
                        console.error("[guardxnsole] SQL Hatası:", err.message, "| Sorgu:", query);
                        rej(err);
                    } else {
                        res(query.trim().toUpperCase().startsWith('SELECT') ? [rows] : [{ affectedRows: this.changes, insertId: this.lastID }]);
                    }
                };

                if (query.trim().toUpperCase().startsWith('SELECT')) {
                    db.all(query, params, handler);
                } else {
                    db.run(query, params, function(err) { handler.call(this, err); });
                }
            });
        }
    };
}

module.exports = { veritabaniBaglan, havuzGetir };