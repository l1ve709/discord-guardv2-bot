/**
 * @file kanal.js
 * @description Botun temel koruma mantığı (Raid, Spam, NSFW, Yasaklama koruması vb.) bu dizindedir.
 * @author guardxnsole
 */

const { ChannelType } = require("discord.js");

var Kanal = {};

Kanal.geriYukle = async function (silinmisKanal) {
    try {
        var sunucu = silinmisKanal.guild;
        var ayar = {
            name: silinmisKanal.name,
            type: silinmisKanal.type,
            position: silinmisKanal.rawPosition
        };

        if (silinmisKanal.parent) ayar.parent = silinmisKanal.parentId;

        if (silinmisKanal.type === ChannelType.GuildText) {
            ayar.topic = silinmisKanal.topic || undefined;
            ayar.nsfw = silinmisKanal.nsfw;
            ayar.rateLimitPerUser = silinmisKanal.rateLimitPerUser || 0;
        }

        if (silinmisKanal.type === ChannelType.GuildVoice) {
            ayar.bitrate = silinmisKanal.bitrate;
            ayar.userLimit = silinmisKanal.userLimit;
        }

        if (silinmisKanal.permissionOverwrites && silinmisKanal.permissionOverwrites.cache.size > 0) {
            ayar.permissionOverwrites = silinmisKanal.permissionOverwrites.cache.map(function (u) {
                return { id: u.id, type: u.type, allow: u.allow.bitfield, deny: u.deny.bitfield };
            });
        }

        ayar.reason = "[guardxnsole] silinen kanal geri yuklendi";
        var yeni = await sunucu.channels.create(ayar);
        console.log("[guardxnsole] kanal geri yuklendi: " + silinmisKanal.name);
        return yeni;
    } catch (h) {
        console.error("[guardxnsole] kanal geri yukleme hatasi:", h.message);
        return null;
    }
};

Kanal.sil = async function (kanal) {
    try {
        await kanal.delete("[guardxnsole] yetkisiz kanal olusturma");
        console.log("[guardxnsole] yetkisiz kanal silindi: " + kanal.name);
    } catch (h) {
        console.error("[guardxnsole] kanal silme hatasi:", h.message);
    }
};

Kanal.geriAl = async function (eskiKanal, yeniKanal) {
    try {
        var g = {};
        if (eskiKanal.name !== yeniKanal.name) g.name = eskiKanal.name;
        if (eskiKanal.topic !== yeniKanal.topic) g.topic = eskiKanal.topic;
        if (eskiKanal.nsfw !== yeniKanal.nsfw) g.nsfw = eskiKanal.nsfw;
        if (eskiKanal.rateLimitPerUser !== yeniKanal.rateLimitPerUser) g.rateLimitPerUser = eskiKanal.rateLimitPerUser;
        if (eskiKanal.parentId !== yeniKanal.parentId) g.parent = eskiKanal.parentId;

        if (Object.keys(g).length > 0) {
            g.reason = "[guardxnsole] yetkisiz kanal degisikligi geri alindi";
            await yeniKanal.edit(g);
            console.log("[guardxnsole] kanal geri alindi: " + eskiKanal.name);
        }
    } catch (h) {
        console.error("[guardxnsole] kanal geri alma hatasi:", h.message);
    }
};

module.exports = Kanal;