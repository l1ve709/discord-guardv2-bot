/**
 * @file kurulum.js
 * @description Akıllı kurulum sistemi (4 Dil Desteği + Prefix Desteği)
 */

const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, MessageFlags } = require("discord.js");
const Ayar = require("../models/ayar.model");
const Kayitci = require("../tools/kayitci");
const config = require("../config");
const diller = require("../tools/diller");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("kurulum")
        .setDescription("Setup server security and log system")
        .setNameLocalizations({ tr: "kurulum", "es-ES": "configuracion" })
        .setDescriptionLocalizations({
            tr: "Sunucu koruma ve log sistemini kurar",
            "es-ES": "Configurar la seguridad del servidor"
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    calistir: async function (etkilesim) {
        if (etkilesim.user.id !== etkilesim.guild.ownerId && etkilesim.user.id !== config.sahipId) {
            const m = await Kayitci.mesaj(etkilesim.guild.id, "GENEL.SAHIP_YOK");
            return await etkilesim.reply({ content: m, flags: [MessageFlags.Ephemeral] });
        }

        const langEmbed = new EmbedBuilder()
            .setTitle("🌍 Localization")
            .setDescription("Lütfen dil seçin / Please select language / Por favor seleccione idioma / الرجاء تحديد اللغة")
            .setColor(0x2b2d31);

        const langRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('lang_tr').setLabel('Türkçe').setEmoji('🇹🇷').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('lang_en').setLabel('English').setEmoji('🇬🇧').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('lang_es').setLabel('Español').setEmoji('🇪🇸').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('lang_ar').setLabel('العربية').setEmoji('🇸🇦').setStyle(ButtonStyle.Primary)
            );

        const yanit = await etkilesim.reply({ embeds: [langEmbed], components: [langRow], fetchReply: true });
        const filtre = i => i.user.id === etkilesim.user.id;

        try {
            const langSecim = await yanit.awaitMessageComponent({ filter: filtre, time: 60000 });
            const secilenDil = langSecim.customId.split('_')[1]; 
            await Ayar.guncelle(etkilesim.guild.id, "dil", secilenDil);

            this.anaMenu(langSecim, etkilesim.guild.id);
        } catch (e) {
            await etkilesim.editReply({ content: "Error/Timeout", embeds: [], components: [] }).catch(()=>{});
        }
    },

    prefixCalistir: async function (mesaj) {
        if (mesaj.author.id !== mesaj.guild.ownerId && mesaj.author.id !== config.sahipId) return;
        const msg = await mesaj.reply("⏳ ...");
        this.anaMenu(msg, mesaj.guild.id);
    },

    anaMenu: async function (ctx, sunucuId) {
        const getMetin = (k) => Kayitci.mesaj(sunucuId, k);
        const ayar = await Ayar.getir(sunucuId);
        
        const embed = new EmbedBuilder()
            .setTitle(await getMetin("KURULUM.BASLIK"))
            .setDescription(await getMetin("KURULUM.ACIKLAMA"))
            .setColor(0x3498db);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('kurulum_coklu').setLabel(await getMetin("KURULUM.BUTON_COKLU")).setEmoji('🛡️').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('kurulum_tekli').setLabel(await getMetin("KURULUM.BUTON_TEKLI")).setEmoji('📑').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('kurulum_nsfw').setLabel(await getMetin("KURULUM.BUTON_NSFW")).setEmoji('🤖').setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId('kurulum_prefix').setLabel((await getMetin("KURULUM.BUTON_PREFIX")).replace("{durum}", ayar.prefixAktif ? "✅" : "❌")).setStyle(ayar.prefixAktif ? ButtonStyle.Success : ButtonStyle.Secondary)
            );

        if (ctx.update) {
            await ctx.update({ embeds: [embed], components: [row] });
        } else if (ctx.editReply) {
            await ctx.editReply({ embeds: [embed], components: [row] });
        } else if (ctx.edit) {
            await ctx.edit({ embeds: [embed], components: [row] });
        }

        const filtre = i => i.user.id === (ctx.user ? ctx.user.id : ctx.author?.id);

        try {
            const secim = await (ctx.message ? ctx.message : ctx).awaitMessageComponent({ filter: filtre, time: 60000 });
            
            if (secim.customId === 'kurulum_prefix') {
                const yeni = !ayar.prefixAktif;
                await Ayar.guncelle(sunucuId, "prefix_aktif", yeni ? 1 : 0);
                const msg = (await getMetin(yeni ? "KURULUM.PREFIX_ACIK" : "KURULUM.PREFIX_KAPALI")).replace("{p}", ayar.prefix || ".");
                return await secim.update({ content: msg, embeds: [], components: [] });
            }

            if (secim.customId === 'kurulum_nsfw') {
                const yeni = !ayar.nsfwKoruma;
                await Ayar.guncelle(sunucuId, "nsfw_koruma", yeni ? 1 : 0);
                const msg = await getMetin(yeni ? "KURULUM.NSFW_ACIK" : "KURULUM.NSFW_KAPALI");
                return await secim.update({ content: msg, embeds: [], components: [] });
            }

            await secim.update({ content: "⏳ ...", embeds: [], components: [] });
            const dil = ayar.dil || "tr";
            const kanalIsimleri = diller[dil].KANALLAR;

            if (secim.customId === 'kurulum_tekli') {
                const logKanal = await secim.guild.channels.create({
                    name: kanalIsimleri.GUARD_LOG,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [{ id: secim.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] }]
                });

                await Ayar.guncelle(sunucuId, "log_kanal_id", logKanal.id);
                const msg = (await getMetin("KURULUM.TAMAMLANDI_TEKLI")).replace("{kanal}", `<#${logKanal.id}>`);
                return await secim.editReply({ content: msg });
            }
        } catch (e) {  }
    }
};
