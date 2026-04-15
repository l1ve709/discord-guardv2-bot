/**
 * @file db.js
 * @description Veritabanı ve tampon yönetimi.
 */

const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const yol = require("path");

var db = null;

function veritabaniBaglan() {
    return new Promise((resolve, reject) => {
        const dbDir = yol.join(__dirname, '..', 'database');
        const dbPath = yol.join(dbDir, 'database.sqlite');
        if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
        db = new sqlite3.Database(dbPath, async (err) => {
            if (err) return reject(err);
            db.serialize(() => {
                db.run(`CREATE TABLE IF NOT EXISTS ayarlar (sunucu_id TEXT PRIMARY KEY)`);
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
                    { ad: "dil", tip: "TEXT DEFAULT 'tr'" },
                    { ad: "prefix", tip: "TEXT DEFAULT '.'" },
                    { ad: "prefix_aktif", tip: "INTEGER DEFAULT 0" }
                ];
                const tamamlananlar = sutunlar.map(s => {
                    return new Promise(r => db.run(`ALTER TABLE ayarlar ADD COLUMN ${s.ad} ${s.tip}`, () => r()));
                });
                Promise.all(tamamlananlar).then(() => {
                    console.log("[guardxnsole] Veritabanı sütunları kontrol edildi.");
                    resolve();
                });
            });
        });
    });
}

function havuzGetir() {
    return {
        execute: async function (query, params = []) {
            query = query.replace(/INSERT IGNORE INTO/gi, 'INSERT OR IGNORE INTO');
            return new Promise((res, rej) => {
                const handler = (err, rows) => {
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