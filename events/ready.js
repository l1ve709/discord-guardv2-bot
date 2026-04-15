/**
 * @file ready.js
 * @description Bot hazır olduğunda tetiklenen olay ve başlangıç işlemleri.
 */

const { Events, ActivityType } = require("discord.js");
const Ayar = require("../models/ayar.model");
const { komutKaydet } = require("../tools/slash");

module.exports = {
    ad: Events.ClientReady,
    birKez: true,
    calistir: async function (istemci) {
        console.log("[guardxnsole] bot aktif: " + istemci.user.tag);
        console.log("[guardxnsole] " + istemci.guilds.cache.size + " sunucu korunuyor");
        
        const komutListesi = Array.from(istemci.komutlar.values());
        await komutKaydet(komutListesi, istemci);

        istemci.user.setActivity("online | /kurulum", { type: ActivityType.Watching });

        for (var [id] of istemci.guilds.cache) {
            try { await Ayar.getir(id); } catch (e) { }
        }

        console.log("[guardxnsole] ayarlar yuklendi");
    }
};