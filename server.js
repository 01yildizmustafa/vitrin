const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

const CATEGORIES = ['makyaj', 'spor', 'anne cocuk', 'gezi', 'giyim', 'araba', 'kitap', 'teknoloji', 'oyun', 'evcil hayvan'];

// Sabit ornek veriler (elle hazirlanmis)
const SEED = [
  { username: 'gece_ruju',        category: 'makyaj',       followers: 248000,   engagement: 62.4, email: 'gece_ruju@mail.com' },
  { username: 'ela_glow',         category: 'makyaj',       followers: 1830000, engagement: 48.1, email: 'ela_glow@mail.com' },
  { username: 'kontra_atak',      category: 'spor',         followers: 95000,    engagement: 88.7, email: 'kontra_atak@mail.com' },
  { username: 'sabah_kosusu',     category: 'spor',         followers: 4200000, engagement: 53.9, email: 'sabah_kosusu@mail.com' },
  { username: 'minik_eller',      category: 'anne cocuk',   followers: 670000,   engagement: 71.2, email: 'minik_eller@mail.com' },
  { username: 'anne_olunca',      category: 'anne cocuk',   followers: 12500,    engagement: 91.5, email: 'anne_olunca@mail.com' },
  { username: 'pasaport_dolu',    category: 'gezi',         followers: 9100000, engagement: 44.3, email: 'pasaport_dolu@mail.com' },
  { username: 'haritasiz',        category: 'gezi',         followers: 333000,   engagement: 67.8, email: 'haritasiz@mail.com' },
  { username: 'stil_defteri',     category: 'giyim',        followers: 1540000, engagement: 57.6, email: 'stil_defteri@mail.com' },
  { username: 'vintage_dolap',    category: 'giyim',        followers: 88000,    engagement: 82.0, email: 'vintage_dolap@mail.com' },
  { username: 'devir_teslim',     category: 'araba',        followers: 2750000, engagement: 49.7, email: 'devir_teslim@mail.com' },
  { username: 'klasik_motor',     category: 'araba',        followers: 156000,   engagement: 74.9, email: 'klasik_motor@mail.com' },
  { username: 'sayfa_arasi',      category: 'kitap',        followers: 410000,   engagement: 69.3, email: 'sayfa_arasi@mail.com' },
  { username: 'gece_okuru',       category: 'kitap',        followers: 27000,    engagement: 95.1, email: 'gece_okuru@mail.com' },
  { username: 'kod_ve_kahve',     category: 'teknoloji',    followers: 6600000, engagement: 46.8, email: 'kod_ve_kahve@mail.com' },
  { username: 'gadget_gunu',      category: 'teknoloji',    followers: 720000,   engagement: 63.5, email: 'gadget_gunu@mail.com' },
  { username: 'son_boss',         category: 'oyun',         followers: 8400000, engagement: 51.2, email: 'son_boss@mail.com' },
  { username: 'level_up_can',     category: 'oyun',         followers: 1230000, engagement: 73.8, email: 'level_up_can@mail.com' },
  { username: 'pati_sesi',        category: 'evcil hayvan', followers: 540000,   engagement: 79.4, email: 'pati_sesi@mail.com' },
  { username: 'tuylu_dost',       category: 'evcil hayvan', followers: 64000,    engagement: 90.6, email: 'tuylu_dost@mail.com' },
  { username: 'far_ve_ruj',       category: 'makyaj',       followers: 3100000, engagement: 55.0, email: 'far_ve_ruj@mail.com' },
  { username: 'valiz_hazir',      category: 'gezi',         followers: 1900000, engagement: 60.1, email: 'valiz_hazir@mail.com' },
  { username: 'sahaya_in',        category: 'spor',         followers: 760000,   engagement: 66.7, email: 'sahaya_in@mail.com' },
  { username: 'roman_kahramani',  category: 'kitap',        followers: 175000,   engagement: 84.2, email: 'roman_kahramani@mail.com' }
];

// Veri yukle / ilk seferde seed dosyasi olustur
function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    const seeded = SEED.map((r, i) => ({ id: i + 1, ...r }));
    fs.writeFileSync(DATA_FILE, JSON.stringify(seeded, null, 2));
    return seeded;
  }
}
function saveData(rows) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(rows, null, 2));
}

let influencers = loadData();
let nextId = influencers.reduce((m, r) => Math.max(m, r.id), 0) + 1;

app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/categories', (_req, res) => res.json(CATEGORIES));

// Liste + filtre + siralama
app.get('/api/influencers', (req, res) => {
  const { categories, sort } = req.query;
  let rows = [...influencers];

  if (categories) {
    const list = categories.split(',').filter(Boolean);
    if (list.length) rows = rows.filter(r => list.includes(r.category));
  }

  const sorters = {
    followers_desc:  (a, b) => b.followers - a.followers,
    followers_asc:   (a, b) => a.followers - b.followers,
    engagement_desc: (a, b) => b.engagement - a.engagement,
    engagement_asc:  (a, b) => a.engagement - b.engagement,
    alpha_desc:      (a, b) => b.username.localeCompare(a.username, 'tr'),
    alpha_asc:       (a, b) => a.username.localeCompare(b.username, 'tr'),
  };
  rows.sort(sorters[sort] || sorters.followers_desc);
  res.json(rows);
});

// Kayit ekle
app.post('/api/influencers', (req, res) => {
  const { username, category, followers, engagement, email } = req.body;
  if (!username || !category || followers == null || engagement == null || !email) {
    return res.status(400).json({ error: 'Tüm alanlar zorunlu.' });
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Geçersiz kategori.' });
  }
  const row = {
    id: nextId++,
    username: String(username).trim(),
    category,
    followers: parseInt(followers, 10),
    engagement: parseFloat(engagement),
    email: String(email).trim()
  };
  influencers.push(row);
  saveData(influencers);
  res.json({ id: row.id });
});

app.listen(PORT, () => console.log(`Vitrin DB çalışıyor: http://localhost:${PORT}`));
