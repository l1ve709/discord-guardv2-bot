/**
 * @file rol.js
 * @description Botun temel koruma mantığı (Raid, Spam, NSFW, Yasaklama koruması vb.) bu dizindedir.
 * @author guardxnsole
 */

var Rol = {};

Rol.geriYukle = async function (silinmisRol) {
    try {
        var yeni = await silinmisRol.guild.roles.create({
            name: silinmisRol.name,
            color: silinmisRol.color,
            hoist: silinmisRol.hoist,
            position: silinmisRol.rawPosition,
            permissions: silinmisRol.permissions,
            mentionable: silinmisRol.mentionable,
            reason: "[guardxnsole] silinen rol geri yuklendi"
        });
        console.log("[guardxnsole] rol geri yuklendi: " + silinmisRol.name);
        return yeni;
    } catch (h) {
        console.error("[guardxnsole] rol geri yukleme hatasi:", h.message);
        return null;
    }
};

Rol.sil = async function (rol) {
    try {
        await rol.delete("[guardxnsole] yetkisiz rol olusturma");
        console.log("[guardxnsole] yetkisiz rol silindi: " + rol.name);
    } catch (h) {
        console.error("[guardxnsole] rol silme hatasi:", h.message);
    }
};

Rol.geriAl = async function (eskiRol, yeniRol) {
    try {
        var g = {};
        if (eskiRol.name !== yeniRol.name) g.name = eskiRol.name;
        if (eskiRol.color !== yeniRol.color) g.color = eskiRol.color;
        if (eskiRol.hoist !== yeniRol.hoist) g.hoist = eskiRol.hoist;
        if (eskiRol.mentionable !== yeniRol.mentionable) g.mentionable = eskiRol.mentionable;
        if (!eskiRol.permissions.equals(yeniRol.permissions)) g.permissions = eskiRol.permissions;

        if (Object.keys(g).length > 0) {
            g.reason = "[guardxnsole] yetkisiz rol degisikligi geri alindi";
            await yeniRol.edit(g);
            console.log("[guardxnsole] rol geri alindi: " + eskiRol.name);
        }
    } catch (h) {
        console.error("[guardxnsole] rol geri alma hatasi:", h.message);
    }
};

module.exports = Rol;