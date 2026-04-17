/**
 * @file diller.js
 * @description Botun çoklu dil (localization) metinlerini içerir.
 */

module.exports = {
    tr: {
        GENEL: {
            SAHIP_YOK: "Sadece sunucu sahibi kullanabilir.",
            HATA: "Zaman aşımı veya bir hata oluştu.",
            YOK: "Yok",
            TAMAM: "Tamamlandı"
        },
        KURULUM: {
            BASLIK: "guardxnsole | Akıllı Kurulum Sistemi",
            ACIKLAMA: "Sunucunuzun güvenliğini yapılandırmak için aşağıdan bir stil seçin:",
            BUTON_COKLU: "Çoklu Log Kur",
            BUTON_TEKLI: "Tekli Log Kur",
            BUTON_NSFW: "NSFW Aç/Kapat",
            BUTON_PREFIX: "Prefix Komutları ({durum})",
            TAMAMLANDI_TEKLI: "Tekli Log Kurulumu Tamamlandı! Kanal: {kanal}",
            NSFW_ACIK: "NSFW Koruması Açıldı!",
            NSFW_KAPALI: "NSFW Koruması Kapatıldı!",
            PREFIX_ACIK: "Prefix Komutları Aktif! Prefix: {p}",
            PREFIX_KAPALI: "Prefix Komutları Devre Dışı!"
        },
        GUARD: {
            NSFW_UYARI: "{uye}, gönderdiğiniz resim müstehcen içerik barındırdığı için silindi.",
            SPAM_UYARI: "{uye}, spam yapmayı bırakmalısın! ({sure} saniye susturuldun)",
            REKLAM_UYARI: "{uye}, reklam yapmak yasaktır!"
        },
        KANALLAR: {
            GUARD_LOG: "guard-log",
            MOD_LOG: "mod-log",
            MESAJ_LOG: "mesaj-log",
            SES_LOG: "ses-log"
        },
        KOMUTLAR: {
            ALARM: { ad: "alarm", aciklama: "Alarm sistemini açar/kapatır" },
            AT: { ad: "at", aciklama: "Bir üyeyi sunucudan atar" },
            AYAR: { ad: "ayar", aciklama: "Sunucu koruma ayarlarını yönetir" },
            BAN: { ad: "ban", aciklama: "Bir üyeyi sunucudan yasaklar" },
            DURUM: { ad: "durum", aciklama: "Mevcut koruma durumunu gösterir" },
            KURULUM: { ad: "kurulum", aciklama: "Koruma ve log sistemini kurar" },
            LIMIT: { ad: "limit", aciklama: "Koruma limitlerini belirler" },
            LOCK: { ad: "lock", aciklama: "Kanalı mesaj gönderimine kapatır/açar" },
            LOGS: { ad: "logs", aciklama: "Son koruma kayıtlarını listeler" },
            SUSTUR: { ad: "sustur", aciklama: "Bir üyeyi belirli süre susturur" },
            TEMIZLE: { ad: "temizle", aciklama: "Kanaldaki mesajları toplu temizler" },
            WHITELIST: { ad: "whitelist", aciklama: "Güvenli kullanıcı listesini yönetir" },
            YARDIM: { ad: "yardim", aciklama: "Komut listesini ve yardım menüsünü gösterir" },
            UNBAN: { ad: "unban", aciklama: "Bir kullanıcının yasaklamasını kaldırır" },
            FORCEBAN: { ad: "forceban", aciklama: "Bir kullanıcıyı ID ile kalıcı yasaklar" }
        }
    },
    en: {
        GENEL: {
            SAHIP_YOK: "Only the server owner can use this.",
            HATA: "An error occurred or timeout.",
            YOK: "None",
            TAMAM: "Completed"
        },
        KURULUM: {
            BASLIK: "guardxnsole | Smart Setup System",
            ACIKLAMA: "Select a style below to configure your server's security:",
            BUTON_COKLU: "Multi Log Setup",
            BUTON_TEKLI: "Single Log",
            BUTON_NSFW: "Toggle NSFW",
            BUTON_PREFIX: "Prefix Commands ({durum})",
            TAMAMLANDI_TEKLI: "Single Log Setup Complete! Channel: {kanal}",
            NSFW_ACIK: "NSFW Protection Enabled!",
            NSFW_KAPALI: "NSFW Protection Disabled!",
            PREFIX_ACIK: "Prefix Commands Enabled! Prefix: {p}",
            PREFIX_KAPALI: "Prefix Commands Disabled!"
        },
        GUARD: {
            NSFW_UYARI: "{uye}, the image you sent was deleted because it contains explicit content.",
            SPAM_UYARI: "{uye}, you must stop spamming! (Muted for {sure} seconds)",
            REKLAM_UYARI: "{uye}, advertising is prohibited!"
        },
        KANALLAR: {
            GUARD_LOG: "protection-log",
            MOD_LOG: "mod-log",
            MESAJ_LOG: "message-log",
            SES_LOG: "voice-log"
        },
        KOMUTLAR: {
            ALARM: { ad: "alarm", aciklama: "Toggle alarm system" },
            AT: { ad: "kick", aciklama: "Kick a member from the server" },
            AYAR: { ad: "settings", aciklama: "Manage server protection settings" },
            BAN: { ad: "ban", aciklama: "Ban a member from the server" },
            DURUM: { ad: "status", aciklama: "Show current protection status" },
            KURULUM: { ad: "setup", aciklama: "Setup protection and log system" },
            LIMIT: { ad: "limit", aciklama: "Define protection thresholds" },
            LOCK: { ad: "lock", aciklama: "Lock/Unlock channel for messages" },
            LOGS: { ad: "logs", aciklama: "List recent protection logs" },
            SUSTUR: { ad: "mute", aciklama: "Timeout a member for a duration" },
            TEMIZLE: { ad: "clear", aciklama: "Bulk delete messages in channel" },
            WHITELIST: { ad: "whitelist", aciklama: "Manage trusted user list" },
            YARDIM: { ad: "help", aciklama: "Show command list and help menu" },
            UNBAN: { ad: "unban", aciklama: "Revoke a user's ban" },
            FORCEBAN: { ad: "forceban", aciklama: "Permanently ban a user via ID" }
        }
    },
    es: {
        GENEL: {
            SAHIP_YOK: "Solo el propietario del servidor puede usar esto.",
            HATA: "Ocurrió un error o se acabó el tiempo.",
            YOK: "Ninguno",
            TAMAM: "Completado"
        },
        KURULUM: {
            BASLIK: "🛡️ guardxnsole | Sistema de Configuración Inteligente",
            ACIKLAMA: "Seleccione un estilo para configurar la seguridad:",
            BUTON_COKLU: "Reg. Múltiple",
            BUTON_TEKLI: "Reg. Único",
            BUTON_NSFW: "Alternar NSFW",
            BUTON_PREFIX: "Comandos de Prefijo ({durum})",
            TAMAMLANDI_TEKLI: "✅ ¡Configuración Completada! Canal: {kanal}",
            NSFW_ACIK: "✅ ¡Protección NSFW Activada!",
            NSFW_KAPALI: "❌ ¡Protección NSFW Desactivada!",
            PREFIX_ACIK: "✅ ¡Comandos de Prefijo Activados! Prefijo: {p}",
            PREFIX_KAPALI: "❌ ¡Comandos de Prefijo Desactivados!"
        },
        GUARD: {
            NSFW_UYARI: "🔞 {uye}, la imagen fue eliminada por contenido explícito.",
            SPAM_UYARI: "⚠️ {uye}, ¡deja de hacer spam! (Silenciado por {sure} segundos)",
            REKLAM_UYARI: "🚫 {uye}, ¡está prohibido hacer publicidad!"
        },
        KANALLAR: {
            GUARD_LOG: "registro-guardia",
            MOD_LOG: "registro-mod",
            MESAJ_LOG: "registro-mensajes",
            SES_LOG: "registro-voz"
        },
        KOMUTLAR: {
            ALARM: { ad: "alarma", aciklama: "Alternar sistema de alarma" },
            AT: { ad: "expulsar", aciklama: "Expulsar a un miembro del servidor" },
            AYAR: { ad: "ajustes", aciklama: "Administrar ajustes de protección" },
            BAN: { ad: "banear", aciklama: "Banear a un miembro del servidor" },
            DURUM: { ad: "estado", aciklama: "Mostrar estado de protección" },
            KURULUM: { ad: "configuracion", aciklama: "Configurar sistema de registro" },
            LIMIT: { ad: "limite", aciklama: "Definir umbrales de protección" },
            LOCK: { ad: "bloquear", aciklama: "Bloquear/Desbloquear canal" },
            LOGS: { ad: "registros", aciklama: "Lista de registros recientes" },
            SUSTUR: { ad: "silenciar", aciklama: "Silenciar a un miembro" },
            TEMIZLE: { ad: "limpiar", aciklama: "Eliminar mensajes en masa" },
            WHITELIST: { ad: "whitelist", aciklama: "Gestionar lista de confianza" },
            YARDIM: { ad: "ayuda", aciklama: "Mostrar menú de ayuda" },
            UNBAN: { ad: "unban", aciklama: "Revocar el baneo de un usuario" },
            FORCEBAN: { ad: "forceban", aciklama: "Banear permanentemente por ID" }
        }
    },
    ar: {
        GENEL: {
            SAHIP_YOK: "يمكن لمالك الخادم فقط استخدام هذا.",
            HATA: "حدث خطأ أو انتهت المهلة.",
            YOK: "لا يوجد",
            TAMAM: "اكتمل"
        },
        KURULUM: {
            BASLIK: "🛡️ guardxnsole | نظام الإعداد الذكي",
            ACIKLAMA: "حدد نمطًا لتكوين أمان الخادم الخاص بك:",
            BUTON_COKLU: "إعداد متعدد",
            BUTON_TEKLI: "سجل فردي",
            BUTON_NSFW: "تبديل NSFW",
            BUTON_PREFIX: "أوامر البادئة ({durum})",
            TAMAMLANDI_TEKLI: "✅ اكتمل الإعداد! القناة: {kanal}",
            NSFW_ACIK: "✅ تم تفعيل حماية NSFW!",
            NSFW_KAPALI: "❌ تم تعطيل حماية NSFW!",
            PREFIX_ACIK: "✅ تم تفعيل أوامر البادئة! البادئة: {p}",
            PREFIX_KAPALI: "❌ تم تعطيل أوامر البادئة!"
        },
        GUARD: {
            NSFW_UYARI: "🔞 {uye}، تم حذف الصورة لأنها تحتوي على محتوى غير لائق.",
            SPAM_UYARI: "⚠️ {uye}، يجب عليك التوقف عن إرسال الرسائل المزعجة! (كتم لمدة {sure} ثانية)",
            REKLAM_UYARI: "🚫 {uye}، الإعلان ممنوع!"
        },
        KANALLAR: {
            GUARD_LOG: "سجل-الحماية",
            MOD_LOG: "سجل-المشرف",
            MESAJ_LOG: "سجل-الرسائل",
            SES_LOG: "سجل-الصوت"
        },
        KOMUTLAR: {
            ALARM: { ad: "تنبيه", aciklama: "تبديل نظام التنبيه" },
            AT: { ad: "طرد", aciklama: "طرد عضو من الخادم" },
            AYAR: { ad: "إعدادات", aciklama: "إدارة إعدادات الحماية" },
            BAN: { ad: "حظر", aciklama: "حظر عضو من الخادم" },
            DURUM: { ad: "حالة", aciklama: "إظهار حالة الحماية الحالية" },
            KURULUM: { ad: "إعداد", aciklama: "إعداد الحماية ونظام السجل" },
            LIMIT: { ad: "حد", aciklama: "تحديد عتبات الحماية" },
            LOCK: { ad: "قفل", aciklama: "قفل/فتح القناة للرسائل" },
            LOGS: { ad: "سجلات", aciklama: "عرض سجلات الحماية الأخيرة" },
            SUSTUR: { ad: "كتم", aciklama: "كتم عضو لفترة من الزمن" },
            TEMIZLE: { ad: "مسح", aciklama: "مسح الرسائل في القناة" },
            WHITELIST: { ad: "القائمة_البيضاء", aciklama: "إدارة قائمة المستخدمين الموثوق بهم" },
            YARDIM: { ad: "مساعدة", aciklama: "إظهار قائمة الأوامر" },
            UNBAN: { ad: "فك_الحظر", aciklama: "إلغاء حظر مستخدم" },
            FORCEBAN: { ad: "حظر_بالقوة", aciklama: "حظر مستخدم بشكل دائم عبر ID" }
        }
    }
};
