# Let's Buddy — Proje Çalışma Dosyası

Bu dosya, Let's Buddy uygulamasını sıfırdan Claude Code CLI kullanarak geliştirecek iki kişilik ekip (backend + frontend) için hazırlanmış adım adım çalışma planıdır. İkiniz de bu dosyayı okuyup kendi tarafınızdaki fazları Claude Code'a birer birer anlatarak ilerleyebilirsiniz. Dosyayı repo'nun köküne koyup ("PROJECT_PLAN.md") Claude Code'a "şu anda Faz 1'deyiz, 2. adımı uygula" gibi referans vererek çalışabilirsiniz.

---

## 1. Proje Özeti

**Ne:** Tinder benzeri kaydırma (swipe) arayüzüne sahip ama eşleşmelerin romantik olmadığı bir mobil uygulama. Kullanıcılar 4 farklı yönde kaydırarak 4 farklı "buddy" kategorisinde eşleşme arıyor:

- Yukarı → Kahve buddy
- Sağ → Ders buddy
- Sol → Spor buddy
- Aşağı → Cadde buddy (motor/araba tutkunları)

Eşleşme (iki tarafın da birbirini beğenmesi) sonrası sohbet (chat) açılıyor.

**Hedef pazar:** Başlangıçta Türkiye, üniversite öğrencileri odaklı (üniversite e-postası ile doğrulama, kampüs bazlı pilot lansman).

**Ekip:** Sen (backend), arkadaşın (frontend). İkinizin de önceden kodlama deneyimi yok; ikiniz de Claude Code CLI üzerinden geliştireceksiniz.

---

## 2. Teknoloji Yığını (Özet)

| Katman | Seçim | Neden |
|---|---|---|
| Frontend | React Native + Expo | Tek kod tabanıyla iOS + Android, hazır swipe kütüphaneleri, Expo ile kolay yayınlama |
| Backend | Node.js + NestJS + TypeScript | Frontend ile aynı dil (TypeScript), yapılandırılmış proje mimarisi |
| Veritabanı | PostgreSQL (+ PostGIS) | Konum bazlı eşleştirme sorguları için güçlü |
| Hızlı veri / kuyruk | Redis | Swipe kuyruğu, online durum takibi |
| Gerçek zamanlı | Socket.io | Eşleşme sonrası sohbet |
| Kimlik doğrulama | Firebase Auth + üniversite e-postası OTP | Hızlı başlangıç, sonra özelleştirilebilir |
| Push bildirim | Firebase Cloud Messaging | iOS + Android ortak standart |
| Ödeme (ileride) | Apple/Google native IAP (RevenueCat ile yönetim) | Dijital özellikler için platform zorunluluğu |

Bu tablo bir öneri seti — ikiniz de yeni başlıyorsanız, Claude Code ile çalışırken bu seçimleri değiştirmek de mümkün, önemli olan ikinizin de aynı temel dilde (TypeScript/JavaScript) ilerlemesi.

---

## 3. Referans Açık Kaynak Repolar

Bunlar sıfırdan kod yazmanıza gerek kalmadan yapıyı anlamanız ve Claude Code'a "buna benzer bir yapı kur" diyebilmeniz için referans repolar. Doğrudan kopyalamak yerine Claude Code'a inceletip projenize uyarlatmanızı öneririm.

- [instamobile/tinder-react-native](https://github.com/instamobile/tinder-react-native) — React Native ile Tinder tarzı swipe kart arayüzü örneği. 4 yönlü swipe'a uyarlamak için iyi bir başlangıç referansı.
- [swaplet/react-native-swipe-cards-deck](https://github.com/swaplet/react-native-swipe-cards-deck) — Daha hafif, sadece swipe kart deste mantığına odaklanan bir kütüphane.
- [NarHakobyan/awesome-nest-boilerplate](https://github.com/NarHakobyan/awesome-nest-boilerplate) — NestJS + TypeScript + PostgreSQL + TypeORM ile hazır, kimlik doğrulama dahil bir backend iskeleti. Backend'e başlarken Claude Code'a bu yapıyı referans göstermek işi hızlandırır.
- [asifvora/React-native-chat-app](https://github.com/asifvora/React-native-chat-app) — React Native + Socket.io ile basit bir sohbet uygulaması örneği.

---

## 4. Repo ve Klasör Yapısı

Tek bir monorepo öneriyorum:

```
lets-buddy/
├── backend/          # NestJS projesi (sen)
├── mobile/           # Expo/React Native projesi (arkadaşın)
├── docs/             # KVKK metni, ürün planı, bu dosya
└── PROJECT_PLAN.md
```

GitHub'da `letsbuddy-app` gibi bir organizasyon açıp repoyu onun altında private kurabilirsiniz; `main` branch'i korumaya alıp her değişikliği PR ile birbirinize review ettirmeniz küçük ekip için de faydalı bir alışkanlık.

---

## 5. Çalışma Planı — Fazlar

### Faz 0: Kurulum (ortak, ~1 gün)

1. Node.js (LTS sürüm), Git kurulumu
2. GitHub hesapları ve `letsbuddy-app` organizasyonu / `lets-buddy` repo'sunun oluşturulması
3. VS Code (veya tercih ettiğiniz editör) kurulumu
4. Telefonlarınıza Expo Go uygulamasının kurulması (geliştirme sırasında anlık önizleme için)
5. İkinizin de makinesinde Claude Code CLI'nin kurulu ve repo'ya bağlı olduğunun doğrulanması (`claude --version`)

### Faz 1: Backend Temelleri (Sen — yaklaşık 1-2 hafta)

1. `backend/` klasöründe Claude Code'a NestJS + TypeScript + PostgreSQL bağlantılı bir proje iskeleti oluşturtun
2. Veritabanı şemasını tasarlayın: `User`, `Profile`, `Category` (kahve/ders/spor/cadde), `Swipe`, `Match`, `Message` tabloları
3. Üniversite e-postası ile OTP doğrulama akışını kurun (kayıt → e-posta kodu → doğrulama)
4. Profil oluşturma/güncelleme endpoint'lerini yazın (fotoğraf, ilgi alanları, hangi kategorilerde buddy arandığı)
5. Swipe endpoint'ini yazın: bir kullanıcının başka bir profili belirli bir yönde/kategoride kaydırması, iki taraf da birbirini beğenirse otomatik `Match` oluşturulması
6. Eşleşme sonrası sohbet için Socket.io kurulumu ve mesaj geçmişi endpoint'i
7. NestJS'in otomatik ürettiği Swagger dokümantasyonunu aktif edin — bu, frontend ile ortak "API sözleşmesi" olarak kullanılacak

### Faz 2: Frontend Temelleri (Arkadaşın — Faz 1 ile paralel, 1-2 hafta)

1. `mobile/` klasöründe Expo projesini oluşturun
2. Onboarding/kayıt ekranları: üniversite e-postası girişi, OTP doğrulama ekranı
3. Profil oluşturma ekranı: fotoğraf yükleme, ilgi alanları, hangi kategorilerde buddy arandığının seçimi
4. 4 yönlü swipe kart arayüzü (referans repolardaki kütüphanelerden uyarlanarak)
5. Eşleşmeler listesi ekranı
6. Sohbet ekranı (Socket.io client bağlantısı)
7. Backend henüz hazır değilken sahte (mock) veriyle UI geliştirmeye devam edilebilir — **ama API sözleşmesini (endpoint isimleri, request/response şekli) Faz 1 sırasında ikiniz birlikte netleştirmeniz kritik**, bu adımı atlamayın; aksi halde Faz 3'te uyumsuzluk çıkar

### Faz 3: Entegrasyon (İkiniz birlikte — yaklaşık 1 hafta)

1. Swagger/OpenAPI dokümanını gerçek backend ile frontend'i eşleştirmek için kullanın
2. `.env` dosyalarıyla frontend'in backend adresine bağlanmasını sağlayın
3. Uçtan uca test: kayıt → profil oluşturma → swipe → match → mesajlaşma
4. Hata senaryolarını test edin: yanlış OTP, eşleşme olmadan mesajlaşma denemesi, boş profil vb.

### Faz 4: Güvenlik, KVKK ve Yasal (Sen ağırlıklı, Faz 1-3 ile paralel yürütülebilir)

1. KVKK aydınlatma metni ve açık rıza akışı (kayıt sırasında onay kutusu)
2. Gizlilik politikası ve kullanım şartları taslağı
3. Kullanıcı engelleme/şikayet mekanizması — bu hem güvenlik hem de App Store/Play Store'un zorunlu kıldığı bir özellik
4. Hesap/veri silme talebi akışı

### Faz 5: Ödeme / Monetizasyon (Faz 3 sonrası, MVP'den sonra ele alınabilir)

1. Apple/Google native IAP kurulumu — RevenueCat gibi bir servis iki platformu tek API üzerinden yönetmeyi kolaylaştırır
2. Premium özelliklerin tanımlanması (ör. günlük swipe limitinin artırılması, öne çıkan profil)

### Faz 6: Reklam / Pazarlama Hazırlığı (Herhangi bir zamanda paralel yürütülebilir)

1. Basit bir landing page (uygulama yayınlanmadan önce ilgi/e-posta toplamak için)
2. Kampüs gruplarına yönelik sosyal medya kreatifleri
3. Bu fazın kreatif detaylarını ayrı bir oturumda birlikte konuşup netleştirebiliriz

### Faz 7: Test ve Yayın

1. TestFlight (iOS) / Play Store kapalı test (Android)
2. Tek bir kampüste pilot lansman — soğuk başlangıç problemini (yeterli kullanıcı yoğunluğu olmadan swipe deneyiminin boş hissettirmesi) çözmek için
3. Geri bildirim toplama ve iterasyon

---

## 6. Claude Code Kullanım Notları

- Her adımı küçük parçalar halinde Claude Code'a anlatın (ör. "şimdi User ve Profile modellerini oluştur"), tüm projeyi tek seferde istemeyin — küçük adımlar hem daha doğru sonuç verir hem de neyin yapıldığını takip etmenizi kolaylaştırır
- Backend ve frontend ayrı klasörlerde olduğu için Claude Code'u her ikisinde de ayrı ayrı çalıştırabilirsiniz (`cd backend && claude`, `cd mobile && claude`)
- Bu dosyayı ("bu planın Faz 1, adım 3'ünü uygula" gibi) referans göstererek Claude Code'un bağlamı daha iyi anlamasını sağlayabilirsiniz

---

## 7. Açık Kalan Kararlar

Bunları ilerleyen sohbetlerde birlikte netleştirebiliriz:

- Ödeme detayları (RevenueCat mi, kendi entegrasyonunuz mu)
- Reklam/pazarlama kreatif konseptleri
- Pilot lansman için hangi üniversite/kampüs seçilecek
