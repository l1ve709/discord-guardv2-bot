/**
 * @file limit.js
 * @description Koruma limitlerini belirler (Hybrid & Localized)
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Ayar = require("../models/ayar.model");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("limit")
        .setDescription("Define protection thresholds")
        .setNameLocalizations({ tr: "limit", "es-ES": "limite" })
        .setDescriptionLocalizations({ tr: "Koruma limitlerini belirler", "es-ES": "Definir umbrales de protección" })
        .addStringOption(o => o.setName("type").setDescription("Limit type").setRequired(true)
            .addChoices(
                { name: "Ban Limit", value: "ban_limit" },
                { name: "Kick Limit", value: "kick_limit" },
                { name: "Channel Limit", value: "kanal_limit" },
                { name: "Role Limit", value: "rol_limit" }
            ))
        .addIntegerOption(o => o.setName("value").setDescription("Threshold value").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    calistir: async function (etkilesim) {
        const tip = etkilesim.options.getString("type");
        const deger = etkilesim.options.getInteger("value");
        await Ayar.getir(etkilesim.guild.id);
        await Ayar.guncelle(etkilesim.guild.id, tip, deger);
        await etkilesim.reply({ content: `📊 **${tip}** threshold set to **${deger}**.` });
    },

    prefixCalistir: async function (mesaj, args) {
        const tip = args[0];
        const deger = parseInt(args[1]);
        if (!tip || isNaN(deger)) return mesaj.reply("Lütfen tip ve değer belirtin.");
        await Ayar.guncelle(mesaj.guild.id, tip, deger);
        await mesaj.reply(`📊 **${tip}** limiti **${deger}** olarak güncellendi.`);
    }
};