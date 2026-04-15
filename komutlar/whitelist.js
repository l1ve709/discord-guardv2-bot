/**
 * @file whitelist.js
 * @description Güvenilir kullanıcı listesi yönetimi (Hybrid & Localized)
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Whitelist = require("../models/whitelist.model");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("whitelist")
        .setDescription("Manage trusted user list")
        .setNameLocalizations({ tr: "guvenliliste" })
        .setDescriptionLocalizations({ tr: "Güvenli kullanıcı listesini yönetir" })
        .addSubcommand(s => s.setName("add").setDescription("Add user to whitelist").addUserOption(o => o.setName("user").setDescription("User to add").setRequired(true)))
        .addSubcommand(s => s.setName("remove").setDescription("Remove user from whitelist").addUserOption(o => o.setName("user").setDescription("User to remove").setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    calistir: async function (etkilesim) {
        const sub = etkilesim.options.getSubcommand();
        const user = etkilesim.options.getUser("user");
        
        if (sub === "add") {
            await Whitelist.ekle(etkilesim.guild.id, user.id, etkilesim.user.id);
            await etkilesim.reply({ content: `✅ **${user.tag}** added to whitelist.` });
        } else {
            await Whitelist.sil(etkilesim.guild.id, user.id);
            await etkilesim.reply({ content: `❌ **${user.tag}** removed from whitelist.` });
        }
    },

    prefixCalistir: async function (mesaj, args) {
        const user = mesaj.mentions.users.first() || { id: args[1] };
        if (!user.id) return mesaj.reply("Lütfen bir kullanıcı belirtin.");
        
        if (args[0] === "ekle") {
            await Whitelist.ekle(mesaj.guild.id, user.id, mesaj.author.id);
            await mesaj.reply(`✅ \`${user.id}\` listeye eklendi.`);
        } else {
            await Whitelist.sil(mesaj.guild.id, user.id);
            await mesaj.reply(`❌ \`${user.id}\` listeden çıkarıldı.`);
        }
    }
};