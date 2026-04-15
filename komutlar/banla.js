/**
 * @file banla.js
 * @description Kullanıcıların `/` (slash) komutları ile etkileşime girdiği komut dosyaları.
 * @author guardxnsole
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Kayit = require("../models/kayit.model");
const kayitci = require("../tools/kayitci");

module.exports = {
    veri: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Kullaniciyi banla")
        .addUserOption(function (s) { return s.setName("kisi").setDescription("Kisi").setRequired(true); })
        .addStringOption(function (s) { return s.setName("sebep").setDescription("Sebep").setRequired(false); })
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    calistir: async function (etkilesim) {
        var hedef = etkilesim.options.getUser("kisi");
        var sebep = etkilesim.options.getString("sebep") || "Belirtilmedi";
        try {
            var uye = await etkilesim.guild.members.fetch(hedef.id);
            if (!uye.bannable) return await etkilesim.reply({ content: "Banlanamaz. -- guardxnsole", ephemeral: true });
            try { await hedef.send("**" + etkilesim.guild.name + "** sunucusundan banlandin. Sebep: " + sebep + " -- guardxnsole"); } catch (e) {  }
            await uye.ban({ reason: "[guardxnsole] " + sebep + " | " + etkilesim.user.tag, deleteMessageSeconds: 86400 });
            await Kayit.ekle({ sunucuId: etkilesim.guild.id, kullaniciId: hedef.id, kullaniciAdi: hedef.tag, islem: "banla", detay: sebep, ceza: "banla" });
            await kayitci.log(etkilesim.guild, "Ban", hedef.tag + " | " + sebep + " | " + etkilesim.user.tag, 0xc0392b);
            await etkilesim.reply({ content: hedef.tag + " banlandi. -- guardxnsole" });
        } catch (h) {
            await etkilesim.reply({ content: "Hata: " + h.message + " -- guardxnsole", ephemeral: true });
        }
    }
};