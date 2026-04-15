/**
 * @file ayar.js
 * @description Koruma modüllerini açıp kapama (Hybrid & Localized)
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Ayar = require("../models/ayar.model");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("ayar")
        .setDescription("Manage server protection settings")
        .setNameLocalizations({ tr: "ayar", "es-ES": "ajustes" })
        .setDescriptionLocalizations({ tr: "Sunucu koruma ayarlarını yönetir", "es-ES": "Administrar ajustes de protección" })
        .addStringOption(o => o.setName("module").setDescription("Module name").setRequired(true)
            .addChoices(
                { name: "Channel Guard", value: "kanal_koruma" },
                { name: "Role Guard", value: "rol_koruma" },
                { name: "Ban Guard", value: "ban_koruma" },
                { name: "Bot Guard", value: "bot_koruma" },
                { name: "Spam Guard", value: "spam_koruma" }
            ))
        .addBooleanOption(o => o.setName("status").setDescription("Enable or Disable").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    calistir: async function (etkilesim) {
        const modul = etkilesim.options.getString("module");
        const durum = etkilesim.options.getBoolean("status");
        await Ayar.guncelle(etkilesim.guild.id, modul, durum ? 1 : 0);
        await etkilesim.reply({ content: `⚙️ **${modul}** is now **${durum ? "Enabled" : "Disabled"}**.` });
    },

    prefixCalistir: async function (mesaj, args) {
        const modul = args[0];
        const durum = args[1] === "aç" ? 1 : 0;
        if (!modul) return mesaj.reply("Lütfen modül adı ve durum (aç/kapat) belirtin.");
        const basarili = await Ayar.guncelle(mesaj.guild.id, modul, durum);
        if (basarili) await mesaj.reply(`⚙️ **${modul}** ayarı güncellendi.`);
        else await mesaj.reply("❌ Geçersiz modül adı.");
    }
};