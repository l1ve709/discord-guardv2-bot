/**
 * @file sustur.js
 * @description Moderasyon komutu (Hybrid & Localized)
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("sustur")
        .setDescription("Timeout a member for a duration")
        .setNameLocalizations({ tr: "sustur", "es-ES": "silenciar" })
        .setDescriptionLocalizations({ tr: "Bir üyeyi belirli süre susturur", "es-ES": "Silenciar a un miembro" })
        .addUserOption(o => o.setName("target").setDescription("User to mute").setRequired(true))
        .addIntegerOption(o => o.setName("duration").setDescription("Duration in minutes").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    calistir: async function (etkilesim) {
        const hedef = etkilesim.options.getMember("target");
        const sure = etkilesim.options.getInteger("duration");
        if (!hedef || !hedef.moderatable) return etkilesim.reply({ content: "❌ Cannot mute this user.", ephemeral: true });

        await hedef.timeout(sure * 60000, "[guardxnsole] Manual mute");
        await etkilesim.reply({ content: `🤐 **${hedef.user.tag}** has been muted for ${sure} minutes.` });
    },

    prefixCalistir: async function (mesaj, args) {
        const hedef = mesaj.mentions.members.first() || mesaj.guild.members.cache.get(args[0]);
        const sure = parseInt(args[1]) || 10;
        if (!hedef || !hedef.moderatable) return mesaj.reply("Geçersiz kullanıcı veya yetki yetersiz.");

        await hedef.timeout(sure * 60000, "[guardxnsole] Manual mute");
        await mesaj.reply(`🤐 **${hedef.user.tag}** ${sure} dakika susturuldu.`);
    }
};