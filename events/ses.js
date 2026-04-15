/**
 * @file ses.js
 * @description Discord olaylarını (mesaj, üye katılımı, kanal silme vb.) dinleyen ve guard filtrelerine yönlendiren modüller.
 * @author guardxnsole
 */

const { Events, EmbedBuilder } = require("discord.js");
const Ayar = require("../models/ayar.model");
const kayitci = require("../tools/kayitci");

module.exports = {
    ad: Events.VoiceStateUpdate,
    birKez: false,
    calistir: async function (eskiSes, yeniSes, istemci) {
        try {
            if (eskiSes.member && eskiSes.member.user.bot) return;

            var ayar = await Ayar.getir(eskiSes.guild.id);
            if (!ayar.logKanalId) return;

            var embed = new EmbedBuilder().setTimestamp();

            if (!eskiSes.channelId && yeniSes.channelId) {
                
                embed.setTitle("Ses Kanalına Katıldı")
                    .setColor(0x2ecc71)
                    .setDescription(`${yeniSes.member} kullanıcısı **${yeniSes.channel.name}** kanalına katıldı.`);
            } else if (eskiSes.channelId && !yeniSes.channelId) {
                
                embed.setTitle("Ses Kanalından Ayrıldı")
                    .setColor(0xe74c3c)
                    .setDescription(`${eskiSes.member} kullanıcısı **${eskiSes.channel.name}** kanalından ayrıldı.`);
            } else if (eskiSes.channelId && yeniSes.channelId && eskiSes.channelId !== yeniSes.channelId) {
                
                embed.setTitle("Ses Kanalı Değiştirdi")
                    .setColor(0x3498db)
                    .setDescription(`${yeniSes.member} kullanıcısı kanal değiştirdi:\n**Eski:** ${eskiSes.channel.name}\n**Yeni:** ${yeniSes.channel.name}`);
            } else {
                
                return;
            }

            await kayitci.log(eskiSes.guild, embed.data.title, embed.data.description, embed.data.color, "ses");
        } catch (h) {
            console.error("[guardxnsole] ses log hatasi:", h.message);
        }
    }
};
