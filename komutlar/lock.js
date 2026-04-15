/**
 * @file lock.js
 * @description Kanalları kilitleme komutu (Hybrid & Localized)
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Lock/Unlock channel")
        .setNameLocalizations({ tr: "kilit", "es-ES": "bloquear" })
        .setDescriptionLocalizations({ tr: "Kanalı mesaj gönderimine kapatır/açar", "es-ES": "Bloquear/Desbloquear canal" })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    calistir: async function (etkilesim) {
        const k = etkilesim.channel;
        const current = k.permissionsFor(etkilesim.guild.roles.everyone).has(PermissionFlagsBits.SendMessages);
        await k.permissionOverwrites.edit(etkilesim.guild.roles.everyone, { SendMessages: !current });
        await etkilesim.reply({ content: `🔒 Channel is now **${!current ? "Locked" : "Unlocked"}**.` });
    },

    prefixCalistir: async function (mesaj) {
        const current = mesaj.channel.permissionsFor(mesaj.guild.roles.everyone).has(PermissionFlagsBits.SendMessages);
        await mesaj.channel.permissionOverwrites.edit(mesaj.guild.roles.everyone, { SendMessages: !current });
        await mesaj.reply(`🔒 Kanal **${!current ? "Kilitlendi" : "Açıldı"}**.`);
    }
};