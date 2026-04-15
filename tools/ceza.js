/**
 * @file ceza.js
 * @description Ceza sistemi, loglama, slash komut kaydı gibi yardımcı araçları içerir.
 * @author guardxnsole
 * @version 2.1.0
 */

const Kayit = require("../models/kayit.model");
const kayitci = require("./kayitci");

var Ceza = {};

Ceza.uygula = async function (sunucu, yurutucu, islem, detay, cezaTuru) {
    var uye = null;
    try {
        uye = await sunucu.members.fetch(yurutucu.id);
    } catch (e) {
        uye = null;
    }

    if (!uye) return;

    var basarili = true;
    var hataMesaji = "";
    var uyguladigimCeza = cezaTuru; 

    if (cezaTuru === "banla") {
        if (uye.bannable) {
            try {
                await uye.ban({ reason: "[guardxnsole] " + islem + ": " + detay, deleteMessageSeconds: 86400 });
            } catch (e) {
                basarili = false;
                hataMesaji = e.message;
                uyguladigimCeza = "rol_al";
            }
        } else {
            basarili = false;
            hataMesaji = "Hiyerarsi / Rol yetersiz";
            uyguladigimCeza = "rol_al";
        }
    } else if (cezaTuru === "at") {
        if (uye.kickable) {
            try {
                await uye.kick("[guardxnsole] " + islem + ": " + detay);
            } catch (e) {
                basarili = false;
                hataMesaji = e.message;
                uyguladigimCeza = "rol_al";
            }
        } else {
            basarili = false;
            hataMesaji = "Hiyerarsi / Rol yetersiz";
            uyguladigimCeza = "rol_al";
        }
    } else if (cezaTuru === "sustur") {
        try {
            await uye.timeout(600000, "[guardxnsole] " + islem + ": " + detay);
            uyguladigimCeza = "sustur";
        } catch (e) {
            basarili = false;
            hataMesaji = e.message;
            uyguladigimCeza = "rol_al";
        }
    }

    if (uyguladigimCeza === "rol_al") {
        var rolIdleri = uye.roles.cache
            .filter(function (r) { return r.id !== sunucu.id && r.editable; })
            .map(function (r) { return r.id; });

        for (var i = 0; i < rolIdleri.length; i++) {
            try {
                await uye.roles.remove(rolIdleri[i], "[guardxnsole] " + islem);
            } catch (e) { 
                basarili = false; 
                hataMesaji = e.message;
            }
        }
    }

    if (!basarili) {
        var yapilandirma = require("../config");
        var sahipId = yapilandirma.sahipId;
        var ownerId = sunucu.ownerId;
        var uyariMesaji = `🚨 **ACİL DURUM UYARISI** 🚨\n\n**${sunucu.name}** sunucusunda bir güvenlik ihlali tespit edildi ancak yetkim bu kullanıcıya müdahale etmeye yetmiyor!\n\n**Şüpheli:** ${yurutucu.tag} (ID: ${yurutucu.id})\n**Eylem:** ${islem}\n**Detay:** ${detay}\n**Hata:** ${hataMesaji}\n\n⚠️ Lütfen sunucuya girip manuel müdahale edin!`;

        var bildirimGidenler = [sahipId, ownerId];
        for (var bId of bildirimGidenler) {
            try {
                var bKullanici = await sunucu.client.users.fetch(bId);
                if (bKullanici) await bKullanici.send(uyariMesaji);
            } catch (e) { }
        }
    }

    await Kayit.ekle({
        sunucuId: sunucu.id,
        kullaniciId: yurutucu.id,
        kullaniciAdi: yurutucu.tag || yurutucu.username || "",
        islem: islem,
        detay: detay,
        ceza: uyguladigimCeza
    });

    var cezaMetin = {
        banla: "BANLANDI",
        at: "ATILDI",
        rol_al: "ROLLERI ALINDI",
        sustur: "SUSTURULDU"
    };

    await kayitci.log(sunucu, "KORUMA IHLALI: " + islem,
        "Kullanici: " + (yurutucu.tag || yurutucu.id) + "\n" +
        "ID: " + yurutucu.id + "\n" +
        "Ceza: " + (cezaMetin[uyguladigimCeza] || uyguladigimCeza) + "\n" +
        "Detay: " + detay,
        0xff0000,
        "mod"
    );
};

module.exports = Ceza;