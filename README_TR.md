# GuardXnsole V2 - Profesyonel Stealth & Hibrit Koruma Sistemi

**GuardXnsole**, kurumsal düzeyde Discord sunucu koruması için tasarlanmış yüksek performanslı, "hayalet" (stealth) modunda çalışan bir güvenlik botudur. **Yapay Zeka**, **Çoklu Dil Desteği** ve **Hibrit Komut Sistemi** ile modern saldırı tekniklerine karşı kesin çözüm sunar.

---

## V2 Sürümüyle Gelen Yenilikler

### Hibrit Komut Sistemi
Kendi çalışma stilinizi seçin:
- **Slash Komutları (`/`)**: Modern, sunucuyla entegre ve güvenli.
- **Geleneksel Prefix Komutları (`.`)**: Hızlı, klasik ve tanıdık. Kurulum menüsünden açılıp kapatılabilir.

### 🌎 Tam Yerelleştirme (i18n)
4 ana dilde tam destek ve dinamik kanal isimlendirme:
- 🇹🇷 Türkçe, 🇬🇧 English, 🇪🇸 Español, 🇸🇦 العربية.
- **Dinamik Kanallar**: Bot, log kanallarını (`guard-log`, `سجل-الحماية`) seçtiğiniz dile göre otomatik oluşturur.

### Kademeli Susturma Döngüsü
İhlalleri tekrarlayan kullanıcılar için caydırıcı süreler:
- **1. İhlal**: 10 Saniye
- **2. İhlal**: 10 Dakika
- **3. İhlal**: 1 Saat
- **4. İhlal+**: 1 Gün
- *Tüm spam mesajları sistem tarafından anında temizlenir.*


---

## Gelişmiş Koruma Modülleri

| Modül | Eylem | Kurtarma (Rollback) |
| :--- | :--- | :--- |
| **Kanal Koruması** | Yetkisiz Oluşturma/Silme/Güncelleme | **Tam Geri Yükleme** (İzinler/Pozisyon/Tür) |
| **Rol Koruması** | Yetkisiz Oluşturma/Silme/Güncelleme | **Tam Geri Yükleme** (Renkler/İzinler/Sıra) |
| **Tehlikeli İzin** | Administrator/Yönetici yetkisi tespiti | **Anında Yetki Devre Dışı Bırakma** |
| **Ban/Kick Koruması**| Toplu yasaklama/atma tespiti | **Yasağı Kaldırma & Sahibine Bildirim** |
| **Bot & Webhook** | Yetkisiz bot veya webhook girişi | **Anında Atma/Kanal Silme** |
| **Emoji & Sticker** | Toplu silme tespiti | **URL Üzerinden Anında Geri Yükleme** |
| **AI NSFW Tarama** | InceptionV3 sinir ağı ile gerçek zamanlı analiz | **Sessiz Silme & Yetkili Uyarısı** |
| **Raid Koruması** | Hızlı katılım (mass join) tespiti | **Karantina & Otomatik Kilitleme** |

---

## Komut Listesi

| Slash | Prefix | Açıklama |
| :--- | :--- | :--- |
| `/kurulum` | `.kurulum` | Akıllı çok dilli kurulum sihirbazı |
| `/yardim` | `.yardim` | Sunucu diline göre dinamik yardım menüsü |
| `/durum` | `.durum` | Gerçek zamanlı koruma ve sistem durumu |
| `/unban` | `.unban [id]` | ID üzerinden yasak kaldırma |
| `/forceban`| `.forceban [id]`| ID üzerinden kalıcı yasaklama (Hibrit) |
| `/kilit` | `.kilit` | Kanalı anında mesaj gönderimine kapatır |

---

## Hızlı Kurulum

1.  **Ortam Değişkenleri**:
    - `.env` dosyasını oluşturun: `BOT_TOKENI`, `ISTEMCI_ID`, `SAHIP_ID`.
2.  **Kurulum**:
    ```bash
    npm install
    npm run baslat
    ```
3.  **Yapılandırma**:
    Sunucunuzda `/kurulum` komutunu kullanarak dil ve prefix tercihinizi yapın.

---

## Güvenlik Politikası

Bu bot **Sessiz-Hata (Fail-Silent)** prensibiyle tasarlanmıştır. Eğer botun hiyerarşisi bir yöneticiye ceza vermeye yetmezse, sistem anında Sunucu Sahibine ve Geliştiriciye **Acil Durum Uyarısı** gönderir.

**Geliştirici:** [guardxnsole]  instagram.com/ediz.dll discord: cxnsole
**Sürüm:** 2.0.0 (Production Stealth)
