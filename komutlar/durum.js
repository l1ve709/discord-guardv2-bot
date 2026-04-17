/**
 * @file durum.js
 * @description Botun koruma durumunu gösterir (Hybrid & Localized)
 */

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Ayar = require("../models/ayar.model");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("durum")
        .setDescription("Show current protection status")
        .setNameLocalizations({ tr: "durum", "es-ES": "estado" })
        .setDescriptionLocalizations({ tr: "Mevcut koruma durumunu gösterir", "es-ES": "Mostrar estado de protección" }),

    calistir: async function (etkilesim) {
        const ayar = await Ayar.getir(etkilesim.guild.id);
        const embed = new EmbedBuilder()
            .setTitle("Protection Status")
            .setColor(0x2b2d31)
            .addFields(
                { name: "Guards", value: `• Channel: ${ayar.kanalKoruma ? "On" : "Off"}\n• Role: ${ayar.rolKoruma ? "On" : "Off"}\n• Ban/Kick: ${ayar.banKoruma ? "On" : "Off"}\n• Webhook: ${ayar.webhookKoruma ? "On" : "Off"}\n• NSFW: ${ayar.nsfwKoruma ? "On" : "Off"}`, inline: true },
                { name: "System", value: `• Prefix: \`${ayar.prefix}\` (${ayar.prefixAktif ? "Active" : "Disabled"})\n• Language: \`${ayar.dil.toUpperCase()}\``, inline: true }
            );
        await etkilesim.reply({ embeds: [embed] });
    },

    prefixCalistir: async function (mesaj) {
        const ayar = await Ayar.getir(mesaj.guild.id);
        await mesaj.reply(`**Status:**\nPrefix: \`${ayar.prefix}\` | Lang: \`${ayar.dil.toUpperCase()}\` | Guards: ${ayar.kanalKoruma ? "On" : "Off"}`);
    }
};