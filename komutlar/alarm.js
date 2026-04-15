/**
 * @file alarm.js
 * @description Alarm sistemini yönetir (Hybrid & Localized)
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Ayar = require("../models/ayar.model");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("alarm")
        .setDescription("Toggle alarm system")
        .setNameLocalizations({ tr: "alarm", "es-ES": "alarma" })
        .setDescriptionLocalizations({ tr: "Alarm sistemini açar/kapatır", "es-ES": "Alternar sistema de alarma" })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    calistir: async function (etkilesim) {
        const ayar = await Ayar.getir(etkilesim.guild.id);
        const yeni = !ayar.alarmSistemi;
        await Ayar.guncelle(etkilesim.guild.id, "alarm_sistemi", yeni ? 1 : 0);
        await etkilesim.reply({ content: `🚨 Alarm system is now **${yeni ? "ON" : "OFF"}**.` });
    },

    prefixCalistir: async function (mesaj) {
        const ayar = await Ayar.getir(mesaj.guild.id);
        const yeni = !ayar.alarmSistemi;
        await Ayar.guncelle(mesaj.guild.id, "alarm_sistemi", yeni ? 1 : 0);
        await mesaj.reply(`🚨 Alarm sistemi **${yeni ? "Açıldı" : "Kapatıldı"}**.`);
    }
};
