/**
 * @file main.js
 * @description Botun ana giriş noktası. Yapılandırmayı yükler ve istemciyi başlatır.
 * @author guardxnsole
 */

const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const fs = require("fs");
const yol = require("path");

if (!fs.existsSync(yol.join(__dirname, ".env"))) {
    const envTemplate = `BOT_TOKENI=\nISTEMCI_ID=\nSAHIP_ID=\n`;
    fs.writeFileSync(yol.join(__dirname, ".env"), envTemplate);
    console.log("[guardxnsole] .env dosyasi bulunamadi, taslak olusturuldu. Lutfen icini doldurup botu tekrar baslatin.");
    process.exit(0);
}

const yapilandirma = require("./config");
const { veritabaniBaglan } = require("./baglanti/db");

var istemci = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message
    ]
});

istemci.komutlar = new Collection();

var komutDizini = yol.join(__dirname, "komutlar");
fs.readdirSync(komutDizini).filter(function (d) { return d.endsWith(".js"); }).forEach(function (dosya) {
    var k = require(yol.join(komutDizini, dosya));
    if (k.veri && k.calistir) { istemci.komutlar.set(k.veri.name, k); console.log("[guardxnsole] komut: " + k.veri.name); }
});

var olayDizini = yol.join(__dirname, "events");
fs.readdirSync(olayDizini).filter(function (d) { return d.endsWith(".js"); }).forEach(function (dosya) {
    try {
        var o = require(yol.join(olayDizini, dosya));
        if (o.ad && o.calistir) {
            if (o.birKez) {
                istemci.once(o.ad, function () { var a = Array.from(arguments); a.push(istemci); o.calistir.apply(null, a); });
            } else {
                istemci.on(o.ad, function () { var a = Array.from(arguments); a.push(istemci); o.calistir.apply(null, a); });
            }
            console.log("[guardxnsole] olay yuklendi: " + dosya);
        }
    } catch (h) {
        console.error("[guardxnsole] olay yukleme hatasi (" + dosya + "):", h.message);
    }
});

async function basla() {
    try {
        await veritabaniBaglan();
        console.log("[guardxnsole] bot giris yapiyor...");
        await istemci.login(yapilandirma.botTokeni);
    } catch (h) {
        console.error("[guardxnsole] baslangic hatasi:", h.message);
        setTimeout(() => process.exit(1), 3000);
    }
}

basla();

process.on("unhandledRejection", function (h) { console.error("[guardxnsole] promise:", h); });
process.on("uncaughtException", function (h) { console.error("[guardxnsole] istisna:", h); });