/**
 * @file uye.guncelle.js
 * @description Discord olaylarını (mesaj, üye katılımı, kanal silme vb.) dinleyen ve guard filtrelerine yönlendiren modüller.
 * @author guardxnsole
 */

const { Events, AuditLogEvent, PermissionFlagsBits } = require("discord.js");
const Ayar = require("../models/ayar.model");
const whitelist = require("../models/whitelist.model");
const config = require("../config");
const Ceza = require("../tools/ceza");

var tehlikeliIzinler = [
    PermissionFlagsBits.Administrator,
    PermissionFlagsBits.ManageGuild,
    PermissionFlagsBits.ManageRoles,
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.BanMembers
];

module.exports = {
    ad: Events.GuildMemberUpdate,
    birKez: false,
    calistir: async function (eski, yeni, istemci) {
        var ayar = await Ayar.getir(yeni.guild.id);
        if (!ayar.rolKoruma) return;

        var eklenen = yeni.roles.cache.filter(function (r) { return !eski.roles.cache.has(r.id); });
        if (eklenen.size === 0) return;

        var tehlikeli = false;
        eklenen.forEach(function (r) {
            for (var i = 0; i < tehlikeliIzinler.length; i++) {
                if (r.permissions.has(tehlikeliIzinler[i])) { tehlikeli = true; break; }
            }
        });
        if (!tehlikeli) return;

        try {
            var dk = await yeni.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberRoleUpdate });
            var giris = dk.entries.first();
            if (!giris) return;
            if (Date.now() - giris.createdTimestamp > 5000) return;

            var yurutucu = giris.executor;
            if (yurutucu.id === istemci.user.id) return;
            if (yurutucu.id === yeni.guild.ownerId) return;
            if (yurutucu.id === config.sahipId) return;

            var wl = await whitelist.kontrol(yeni.guild.id, yurutucu.id);
            if (wl) return;

            for (var [, r] of eklenen) {
                try { await yeni.roles.remove(r, "[guardxnsole] yetkisiz tehlikeli rol verme"); } catch (e) {  }
            }

            var rolIsimleri = eklenen.map(function (r) { return r.name; }).join(", ");

            await Ceza.uygula(yeni.guild, yurutucu, "tehlikeli_rol_verme",
                "Tehlikeli rol verildi: " + rolIsimleri + " -> " + (yeni.user.tag || yeni.user.id),
                ayar.cezaTuru);
        } catch (h) {
            console.error("[guardxnsole] uye guncelleme hatasi:", h.message);
        }
    }
};