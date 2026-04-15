/**
 * @file test_url.js
 * @description Bot sistem bileşeni.
 * @author guardxnsole
 */

const { fetch } = require("undici"); 
async function test() {
    var url = "https://media.discordapp.net/attachments/1378026072712679474/1391470911378686175/attachment.gif?ex=69d34485&is=69d1f305&hm=d36b4f3cf8f4dde61e16a417bcfb9f2d7f7dadb4bb82e7dc42a819f927d30c38&=";
    var r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 DiscordBot" } });
    console.log(r.status, r.headers.get("content-type"));
}
test().catch(console.error);
