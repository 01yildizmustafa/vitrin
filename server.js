# Vitrin — Influencer Katalog

Node.js + Express + node:sqlite ile yazılmış 2 sayfalı uygulama:
- **/** — Liste sayfası (kategori filtresi + takipçi/etkileşim/alfabetik sıralama)
- **/ekle.html** — Yeni kayıt formu

## Lokal çalıştırma
```
npm install
npm start
```
http://localhost:3000

## Yayınlama (Render.com - ücretsiz)
1. github.com'da yeni boş repo aç, bu klasörü push et.
2. render.com'a GitHub ile giriş yap → New → Web Service → repoyu seç.
3. Ayarlar:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free
4. Create → ~2 dk sonra `xxx.onrender.com` linkin hazır.

NOT: Free planda disk kalıcı değildir; sunucu uykuya geçince eklenen
yeni kayıtlar sıfırlanabilir. Kalıcı veri için Render'da ücretsiz
PostgreSQL ya da kalıcı disk eklenebilir.
