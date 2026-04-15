/**
 * @file kayit.komut.js
 * @description Bot sistem bileşeni.
 * @author guardxnsole
 */

const { REST, Routes } = require("discord.js");
const fs = require("fs");
const yol = require("path");
require("dotenv").config();

async function kaydet() {
    var v = [];
    var d = yol.join(__dirname, "komutlar");
    fs.readdirSync(d).filter(function (f) { return f.endsWith(".js"); }).forEach(function (f) {
        var k = require(yol.join(d, f));
        if (k.veri) { 
            v.push(k.veri.toJSON()); 
            console.log("[guardxnsole] Bulunan komut: " + k.veri.name); 
        }
    });

    if (!process.env.BOT_TOKENI || !process.env.ISTEMCI_ID) {
        console.error("[guardxnsole] Hata: BOT_TOKENI veya ISTEMCI_ID bulunamadi!");
        return;
    }

    var rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKENI);
    
    try {
        console.log("[guardxnsole] Komutlar Discord'a gonderiliyor (Global)...");
        await rest.put(Routes.applicationCommands(process.env.ISTEMCI_ID), { body: v });
        console.log("[guardxnsole] Toplam " + v.length + " adet global komut basariyla senkronize edildi!");
        console.log("[guardxnsole] Not: Global komutlarin tum sunucularda gozukmesi 1 saati bulabilir.");
    } catch (h) {
        console.error("[guardxnsole] Kayit hatasi:", h.message);
    }
}

kaydet();