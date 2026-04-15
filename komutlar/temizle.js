/**
 * @file temizle.js
 * @description Toplu mesaj temizleme (Hybrid & Localized)
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("temizle")
        .setDescription("Bulk delete messages")
        .setNameLocalizations({ tr: "temizle", "es-ES": "limpiar" })
        .setDescriptionLocalizations({ tr: "Kanaldaki mesajları toplu temizler", "es-ES": "Eliminar mensajes en masa" })
        .addIntegerOption(o => o.setName("amount").setDescription("Number of messages (1-100)").setRequired(true).setMinValue(1).setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    calistir: async function (etkilesim) {
        const miktar = etkilesim.options.getInteger("amount");
        await etkilesim.channel.bulkDelete(miktar, true);
        await etkilesim.reply({ content: `🧹 **${miktar}** messages deleted.`, ephemeral: true });
    },

    prefixCalistir: async function (mesaj, args) {
        const miktar = parseInt(args[0]) || 10;
        if (miktar > 100) return mesaj.reply("Maksimum 100 mesaj silebilirsiniz.");
        await mesaj.channel.bulkDelete(miktar, true);
        await mesaj.channel.send(`🧹 **${miktar}** mesaj temizlendi.`).then(m => setTimeout(() => m.delete().catch(()=> {}), 3000));
    }
};