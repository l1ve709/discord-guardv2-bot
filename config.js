/**
 * @file config.js
 * @description Merkezi yapılandırma ve varsayılan ayarlar.
 */

require("dotenv").config();

module.exports = {
    botTokeni: process.env.BOT_TOKENI,
    istemciId: process.env.ISTEMCI_ID,
    sahipler: process.env.SAHIP_ID ? process.env.SAHIP_ID.split(",") : [],

    varsayilan: {
        kanalKoruma: true,
        rolKoruma: true,
        banKoruma: true,
        kickKoruma: true,
        botKoruma: true,
        sunucuKoruma: true,
        webhookKoruma: true,
        emojiKoruma: true,
        spamKoruma: true,
        raidKoruma: true,
        vanityKoruma: true,
        alarmSistemi: true,
        mentionLimit: 5,
        kickLimit: 3,
        adminLimitMultiplier: 3,
        kanalLimit: 3,
        rolLimit: 3,
        banLimit: 3,
        webhookLimit: 2,
        emojiLimit: 3,
        limitSuresi: 15,
        spamMesajSinir: 5,
        spamSaniye: 4,
        spamSusturSure: 10,
        raidKatilimSinir: 10,
        raidSaniye: 8,
        cezaTuru: "banla",
        reklamKoruma: true,
        reklamCeza: "banla",
        nsfwKoruma: true
    },

    reklamDesenleri: [
        /discord\.gg\/[a-zA-Z0-9]+/gi,
        /discord\.com\/invite\/[a-zA-Z0-9]+/gi,
        /discordapp\.com\/invite\/[a-zA-Z0-9]+/gi,
        /dsc\.gg\/[a-zA-Z0-9]+/gi,
        /invite\.gg\/[a-zA-Z0-9]+/gi,
        /discord\.me\/[a-zA-Z0-9]+/gi
    ]
};
