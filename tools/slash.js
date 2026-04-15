/**
 * @file slash.js
 * @description Ceza sistemi, loglama, slash komut kaydı gibi yardımcı araçları içerir.
 * @author guardxnsole
 */

const { REST, Routes } = require("discord.js");
const yapilandirma = require("../config");

async function komutKaydet(komutlar, istemci) {
    if (!yapilandirma.botTokeni || !yapilandirma.istemciId) {
        console.error("[guardxnsole] Hata: botTokeni veya istemciId bulunamadi (config)!");
        return;
    }

    const rest = new REST({ version: "10" }).setToken(yapilandirma.botTokeni);
    const v = komutlar.map(k => k.veri.toJSON());

    try {

        await rest.put(Routes.applicationCommands(yapilandirma.istemciId), { body: v });
        console.log(`[guardxnsole] Toplam ${v.length} adet komut senkronize edildi.`);
    } catch (h) {
        console.error("[guardxnsole] Komut senkronizasyon hatasi:", h.message);
    }
}

module.exports = { komutKaydet };
