/**
 * @file sunucu.js
 * @description Botun temel koruma mantığı (Raid, Spam, NSFW, Yasaklama koruması vb.) bu dizindedir.
 * @author guardxnsole
 */

var Sunucu = {};

Sunucu.geriAl = async function (eskiSunucu, yeniSunucu) {
    try {
        var g = {};
        if (eskiSunucu.name !== yeniSunucu.name) g.name = eskiSunucu.name;
        if (eskiSunucu.iconURL() !== yeniSunucu.iconURL()) g.icon = eskiSunucu.iconURL();
        if (eskiSunucu.bannerURL() !== yeniSunucu.bannerURL()) g.banner = eskiSunucu.bannerURL();
        if (eskiSunucu.splashURL() !== yeniSunucu.splashURL()) g.splash = eskiSunucu.splashURL();
        if (eskiSunucu.verificationLevel !== yeniSunucu.verificationLevel) g.verificationLevel = eskiSunucu.verificationLevel;
        if (eskiSunucu.explicitContentFilter !== yeniSunucu.explicitContentFilter) g.explicitContentFilter = eskiSunucu.explicitContentFilter;
        if (eskiSunucu.defaultMessageNotifications !== yeniSunucu.defaultMessageNotifications) g.defaultMessageNotifications = eskiSunucu.defaultMessageNotifications;

        if (Object.keys(g).length > 0) {
            g.reason = "[guardxnsole] yetkisiz sunucu degisikligi geri alindi";
            await yeniSunucu.edit(g);
            console.log("[guardxnsole] sunucu ayarlari geri alindi");
        }
    } catch (h) {
        console.error("[guardxnsole] sunucu geri alma hatasi:", h.message);
    }
};

module.exports = Sunucu;