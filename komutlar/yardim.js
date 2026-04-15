/**
 * @file yardim.js
 * @description Komut listesi ve yardım menüsü (Hybrid & Localized)
 */

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Kayitci = require("../tools/kayitci");
const diller = require("../tools/diller");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("yardim")
        .setDescription("Komut listesi")
        .setNameLocalizations({ "es-ES": "ayuda" })
        .setDescriptionLocalizations({ tr: "Komut listesini ve yardım menüsünü gösterir", "es-ES": "Mostrar menú de ayuda" }),

    calistir: async function (etkilesim) {
        await this.ortakCalistir(etkilesim, etkilesim.guild.id);
    },

    prefixCalistir: async function (mesaj) {
        await this.ortakCalistir(mesaj, mesaj.guild.id);
    },

    ortakCalistir: async function (ctx, sunucuId) {
        const getMetin = (k) => Kayitci.mesaj(sunucuId, k);
        const dil = (await require("../models/ayar.model").getir(sunucuId)).dil || "tr";
        const komutlar = diller[dil].KOMUTLAR;

        const g = new EmbedBuilder()
            .setTitle("🛡️ guardxnsole | Command Center")
            .setColor(0x3498db)
            .setDescription(await getMetin("KURULUM.BASLIK"))
            .addFields(
                { name: "🛡️ Ultimate Guards", value: 
                    "• Channel Protection (Restore/Delete)\n" +
                    "• Role Protection (Hazardous Perm Detect)\n" +
                    "• Mass Ban/Kick/Emoji Detection\n" +
                    "• Bot & Webhook Guard\n" +
                    "• Raid & Spam Prevention", inline: false },
                { name: "🚀 Commands", value: 
                    Object.values(komutlar).map(k => `\`/${k.ad}\` - ${k.aciklama}`).join("\n"), inline: false }
            )
            .setFooter({ text: "guardxnsole v2.0 • Premium Protection" })
            .setTimestamp();

        if (ctx.reply) await ctx.reply({ embeds: [g] });
        else await ctx.channel.send({ embeds: [g] });
    },

};
