/**
 * @file ban.js
 * @description Moderasyon komutu (Hybrid & Localized)
 */

const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a member from the server")
        .setNameLocalizations({ tr: "yasakla", "es-ES": "banear" })
        .setDescriptionLocalizations({ tr: "Bir üyeyi sunucudan yasaklar", "es-ES": "Banear a un miembro del servidor" })
        .addUserOption(o => o.setName("target").setDescription("User to ban").setRequired(true))
        .addStringOption(o => o.setName("reason").setDescription("Reason for ban"))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    calistir: async function (etkilesim) {
        const hedef = etkilesim.options.getMember("target");
        const sebep = etkilesim.options.getString("reason") || "No reason provided";
        if (!hedef) return etkilesim.reply({ content: "❌ Target not found.", flags: [MessageFlags.Ephemeral] });
        if (!hedef.bannable) return etkilesim.reply({ content: "❌ I cannot ban this user.", flags: [MessageFlags.Ephemeral] });

        await hedef.ban({ reason: sebep });
        await etkilesim.reply({ content: `🔨 **${hedef.user.tag}** has been banned. Reason: ${sebep}` });
    },

    prefixCalistir: async function (mesaj, args) {
        const hedef = mesaj.mentions.members.first() || mesaj.guild.members.cache.get(args[0]);
        const sebep = args.slice(1).join(" ") || "No reason provided";
        if (!hedef) return mesaj.reply("Lütfen bir kullanıcı etiketleyin veya ID girin.");
        if (!hedef.bannable) return mesaj.reply("Bu kullanıcıyı yasaklayamam.");

        await hedef.ban({ reason: sebep });
        await mesaj.reply(`🔨 **${hedef.user.tag}** yasaklandı.`);
    }
};
