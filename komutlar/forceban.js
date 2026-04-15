/**
 * @file forceban.js
 * @description ID ile zorla yasaklama komutu (Hybrid & Localized)
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("forceban")
        .setDescription("Permanently ban a user via ID")
        .setNameLocalizations({ tr: "zorlaban", "es-ES": "forzarban" })
        .setDescriptionLocalizations({ tr: "Bir kullanıcıyı ID ile kalıcı yasaklar", "es-ES": "Banear permanentemente por ID" })
        .addStringOption(o => o.setName("id").setDescription("User ID").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    calistir: async function (etkilesim) {
        const id = etkilesim.options.getString("id");
        try {
            await etkilesim.guild.members.ban(id, { reason: "[guardxnsole] Forceban by " + etkilesim.user.tag });
            await etkilesim.reply({ content: `🔨 \`${id}\` başarıyla sunucudan (ID ile) yasaklandı.` });
        } catch (e) {
            await etkilesim.reply({ content: `❌ İşlem başarısız. Hata: ${e.message}`, ephemeral: true });
        }
    },

    prefixCalistir: async function (mesaj, args) {
        if (!args[0]) return mesaj.reply("Lütfen bir ID belirtin.");
        try {
            await mesaj.guild.members.ban(args[0], { reason: "[guardxnsole] Forceban by " + mesaj.author.tag });
            await mesaj.reply(`🔨 \`${args[0]}\` başarıyla yasaklandı.`);
        } catch (e) {
            await mesaj.reply(`❌ İşlem başarısız.`);
        }
    }
};
