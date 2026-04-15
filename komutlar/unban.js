/**
 * @file unban.js
 * @description Dinamik ban kaldırma komutu (Hybrid & Localized)
 */

const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const Kayitci = require("../tools/kayitci");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Revoke a user's ban")
        .setNameLocalizations({ tr: "yasakkaldir", "es-ES": "desbanear" })
        .setDescriptionLocalizations({ tr: "Bir kullanıcının yasaklamasını kaldırır", "es-ES": "Revocar el baneo de un usuario" })
        .addStringOption(o => o.setName("id").setDescription("User ID").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    calistir: async function (etkilesim) {
        const id = etkilesim.options.getString("id");
        try {
            await etkilesim.guild.members.unban(id);
            await etkilesim.reply({ content: `✅ <@${id}> (${id}) ban kaldırıldı.` });
        } catch (e) {
            await etkilesim.reply({ content: `❌ Ban kaldırılamadı. Hata: ${e.message}`, ephemeral: true });
        }
    },

    prefixCalistir: async function (mesaj, args) {
        if (!args[0]) return mesaj.reply("Lütfen bir ID belirtin.");
        try {
            await mesaj.guild.members.unban(args[0]);
            await mesaj.reply(`✅ \`${args[0]}\` ban kaldırıldı.`);
        } catch (e) {
            await mesaj.reply(`❌ Ban kaldırılamadı.`);
        }
    }
};
