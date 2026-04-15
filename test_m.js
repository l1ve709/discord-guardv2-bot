/**
 * @file test_m.js
 * @description Bot sistem bileşeni.
 * @author guardxnsole
 */

const { Client, GatewayIntentBits } = require("discord.js");
const yapilandirma = require("./config");
const istemci = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

istemci.once("ready", async () => {
    
    
    console.log("Hazir");
    process.exit(0);
});
istemci.login(yapilandirma.botTokeni);
