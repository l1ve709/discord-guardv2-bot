/**
 * @file uye.katil.js
 * @description Discord olaylarını (mesaj, üye katılımı, kanal silme vb.) dinleyen ve guard filtrelerine yönlendiren modüller.
 * @author guardxnsole
 */

const { Events } = require("discord.js");
const raid = require("../guard/raid");
const bot = require("../guard/bot");

module.exports = {
    ad: Events.GuildMemberAdd,
    birKez: false,
    calistir: async function (uye, istemci) {
        await raid.katilimKontrol(uye);
        await bot.kontrolEt(uye, istemci);
    }
};