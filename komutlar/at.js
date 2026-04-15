/**
 * @file at.js
 * @description Moderasyon komutu (Hybrid & Localized)
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("at")
        .setDescription("Kick a member from the server")
        .setNameLocalizations({ "en-US": "kick", "es-ES": "expulsar" })
        .setDescriptionLocalizations({ tr: "Bir üyeyi sunucudan atar", "es-ES": "Expulsar a un miembro del servidor" })
        .addUserOption(o => o.setName("target").setDescription("User to kick").setRequired(true))
        .addStringOption(o => o.setName("reason").setDescription("Reason for kick"))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    calistir: async function (etkilesim) {
        const hedef = etkilesim.options.getMember("target");
        const sebep = etkilesim.options.getString("reason") || "No reason provided";
        if (!hedef) return etkilesim.reply({ content: "❌ Target not found.", ephemeral: true });
        if (!hedef.kickable) return etkilesim.reply({ content: "❌ I cannot kick this user.", ephemeral: true });

        await hedef.kick(sebep);
        await etkilesim.reply({ content: `👢 **${hedef.user.tag}** has been kicked. Reason: ${sebep}` });
    },

    prefixCalistir: async function (mesaj, args) {
        const hedef = mesaj.mentions.members.first() || mesaj.guild.members.cache.get(args[0]);
        const sebep = args.slice(1).join(" ") || "No reason provided";
        if (!hedef) return mesaj.reply("Lütfen bir kullanıcı etiketleyin veya ID girin.");
        if (!hedef.kickable) return mesaj.reply("Bu kullanıcıyı atamam.");

        await hedef.kick(sebep);
        await mesaj.reply(`👢 **${hedef.user.tag}** atıldı.`);
    }
};