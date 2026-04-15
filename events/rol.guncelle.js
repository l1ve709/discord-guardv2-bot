/**
 * @file rol.guncelle.js
 * @description Discord olaylarını (mesaj, üye katılımı, kanal silme vb.) dinleyen ve guard filtrelerine yönlendiren modüller.
 * @author guardxnsole
 */

const { Events, AuditLogEvent, PermissionFlagsBits } = require("discord.js");
const denetleyici = require("../guard/denetleyici");
const Rol = require("../guard/rol");
const Ceza = require("../tools/ceza");
const Ayar = require("../models/ayar.model");
const whitelist = require("../models/whitelist.model");
const config = require("../config");

var tehlikeliIzinler = [
    PermissionFlagsBits.Administrator,
    PermissionFlagsBits.ManageGuild,
    PermissionFlagsBits.ManageRoles,
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.BanMembers,
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.ManageWebhooks,
    PermissionFlagsBits.MentionEveryone
];

module.exports = {
    ad: Events.GuildRoleUpdate,
    birKez: false,
    calistir: async function (eski, yeni, istemci) {
        var ayar = await Ayar.getir(yeni.guild.id);
        if (!ayar.rolKoruma) return;

        var tehlikeli = false;
        for (var i = 0; i < tehlikeliIzinler.length; i++) {
            if (!eski.permissions.has(tehlikeliIzinler[i]) && yeni.permissions.has(tehlikeliIzinler[i])) {
                tehlikeli = true;
                break;
            }
        }

        var s = await denetleyici.kontrol({
            sunucu: yeni.guild,
            denetimTuru: AuditLogEvent.RoleUpdate,
            eylemTuru: "rol_guncelle",
            modulAdi: "rolKoruma",
            limitAlani: "rolLimit",
            istemci: istemci
        });

        if (s.ihlal || (tehlikeli && s.yurutucu)) {
            await Rol.geriAl(eski, yeni);
            if (s.yurutucu) {
                var detay = tehlikeli
                    ? "Tehlikeli izin degisikligi: " + eski.name
                    : "Yetkisiz rol degisikligi: " + eski.name;
                await Ceza.uygula(yeni.guild, s.yurutucu, "rol_guncelle", detay, ayar.cezaTuru);
            }
        }
    }
};