/**
 * @file logs.js
 * @description Son koruma kayıtlarını listeler (Hybrid & Localized)
 */

const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const Kayit = require("../models/kayit.model");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("logs")
        .setDescription("List recent protection logs")
        .setNameLocalizations({ tr: "kayitlar", "es-ES": "registros" })
        .setDescriptionLocalizations({ tr: "Son koruma kayıtlarını listeler", "es-ES": "Lista de registros recientes" })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    calistir: async function (etkilesim) {
        const s = await Kayit.listele(etkilesim.guild.id, 10);
        const embed = new EmbedBuilder()
            .setTitle("🛡️ Recent Safety Logs")
            .setColor(0x34495e)
            .setDescription(s.length > 0 ? s.map(r => `\`[${r.tarih}]\` **${r.islem}** - ${r.detay}`).join("\n") : "No logs found.");
        await etkilesim.reply({ embeds: [embed] });
    },

    prefixCalistir: async function (mesaj) {
        const s = await Kayit.listele(mesaj.guild.id, 5);
        const logMetin = s.length > 0 ? s.map(r => `• ${r.islem}: ${r.detay}`).join("\n") : "Kayıt yok.";
        await mesaj.reply(`📜 **Son Kayıtlar:**\n${logMetin}`);
    }
};
