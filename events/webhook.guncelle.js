/**
 * @file webhook.guncelle.js
 * @description Discord olaylarını (mesaj, üye katılımı, kanal silme vb.) dinleyen ve guard filtrelerine yönlendiren modüller.
 * @author guardxnsole
 */

const { Events } = require("discord.js");
const Webhook = require("../guard/webhook");

module.exports = {
    ad: Events.WebhooksUpdate,
    birKez: false,
    calistir: async function (kanal, istemci) {
        if (!kanal.guild) return;
        await Webhook.kontrolEt(kanal, istemci);
    }
};