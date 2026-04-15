/**
 * @file etkilesim.js
 * @description Discord olaylarını (mesaj, üye katılımı, kanal silme vb.) dinleyen ve guard filtrelerine yönlendiren modüller.
 * @author guardxnsole
 */

const { Events } = require("discord.js");

module.exports = {
    ad: Events.InteractionCreate,
    birKez: false,
    calistir: async function (etkilesim, istemci) {
        if (!etkilesim.isChatInputCommand()) return;
        var komut = istemci.komutlar.get(etkilesim.commandName);
        if (!komut) return;

        try {
            await komut.calistir(etkilesim, istemci);
        } catch (h) {
            console.error("[guardxnsole] komut hatasi:", h.message);
            var m = etkilesim.replied || etkilesim.deferred ? "followUp" : "reply";
            try { await etkilesim[m]({ content: "Hata olustu. -- guardxnsole", ephemeral: true }); } catch (e) {  }
        }
    }
};