/**
 * @file alarm.js
 * @description Botun temel koruma mantığı (Raid, Spam, NSFW, Yasaklama koruması vb.) bu dizindedir.
 * @author guardxnsole
 */

const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Ayar = require("../models/ayar.model");
const kayitci = require("../tools/kayitci");

var Alarm = {};
var alarmDurumu = {}; 

Alarm.baslat = async function (sunucu) {
    if (alarmDurumu[sunucu.id]) return;
    
    var ayar = await Ayar.getir(sunucu.id);
    if (!ayar.alarmSistemi) return;

    alarmDurumu[sunucu.id] = true;

    var embed = new EmbedBuilder()
        .setTitle("🚨 ACİL DURUM: SUNUCU ALARMI 🚨")
        .setDescription(`Sunucuda kritik bir tehlike (Raid vb.) algılandığı için **ALARM** modu başlatıldı!\n\n**Yapılan İşlemler:**\n- Tüm yazışma kanalları @everyone için kilitlendi.\n- Sunucu koruması maksimum seviyeye çıkarıldı.`)
        .setColor(0xff0000)
        .setTimestamp()
        .setFooter({ text: "guardxnsole | Alarm Sistemi" });

    await kayitci.log(sunucu, "ALARM BASLATILDI", "@everyone **SUNUCU SALDIRI ALTINDA!**", 0xff0000);

    var kanallar = sunucu.channels.cache.filter(c => c.isTextBased());
    var herkes = sunucu.roles.everyone;

    for (var [id, kanal] of kanallar) {
        try {
            await kanal.permissionOverwrites.edit(herkes, { SendMessages: false }, { reason: "[guardxnsole] ALARM: Lockdown" });
        } catch (e) { }
    }

    console.log(`[guardxnsole] ALARM: ${sunucu.name} sunucusunda lockdown baslatildi.`);
};

Alarm.durdur = async function (sunucu) {
    if (!alarmDurumu[sunucu.id]) return;

    delete alarmDurumu[sunucu.id];

    var kanallar = sunucu.channels.cache.filter(c => c.isTextBased());
    var herkes = sunucu.roles.everyone;

    for (var [id, kanal] of kanallar) {
        try {
            await kanal.permissionOverwrites.edit(herkes, { SendMessages: null }, { reason: "[guardxnsole] ALARM: Lockdown Sonlandirildi" });
        } catch (e) { }
    }

    await kayitci.log(sunucu, "ALARM DURDURULDU", "Sunucu normale döndü, kanalların kilidi açıldı.", 0x2ecc71);
    console.log(`[guardxnsole] ALARM: ${sunucu.name} sunucusunda alarm sonlandirildi.`);
};

Alarm.durum = function (sunucuId) {
    return !!alarmDurumu[sunucuId];
};

module.exports = Alarm;
