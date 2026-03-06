# 🎲 Groupify v2.1 - Fair & Smart Edition

Aplikasi web **super ringan** untuk mengocok dan membagi nama menjadi kelompok-kelompok secara **adil dan pintar**. Dibangun dengan **Vanilla JavaScript** untuk performa maksimal.

![Version](https://img.shields.io/badge/version-2.1.0-light-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Size](https://img.shields.io/badge/size-~15KB-green)

## ⚡ Keunggulan

| Fitur | Groupify |
|-------|------------|
| **Bundle Size** | ~15 KB (80% lighter) |
| **Load Time** | < 0.5 detik |
| **Dependencies** | 0 (zero dependencies!) |
| **Build Step** | Tidak perlu - langsung buka! |
| **Fair Algorithm** | ✅ 3-pass Fisher-Yates |
| **Smart Validation** | ✅ Auto-check & feedback |

## 🚀 Quick Start

### Cara Termudah - Langsung Buka!
```bash
# Double-click file
index.html

# Atau via command line
start index.html
```

### Dengan Browser
1. Buka Chrome/Firefox/Edge
2. Drag & drop file `index.html`
3. Done!

## ✨ Fitur Lengkap

### 🎯 Core Features
- ✅ **Input Nama** - Multi-line dengan auto-count
- ✅ **Jumlah Kelompok** - 2-50 dengan stepper +/-
- ✅ **Mode Shuffle**:
  - **Balanced** - Distribusi paling adil
  - **Random** - Acak total
- ✅ **Durasi Animasi** - **2-10 detik (BISA DIGANTI!)**
- ✅ **3D Dice Animation** - Dadu berputar dengan progress bar
- ✅ **Emoji Blast** - 40+ emoji celebration
- ✅ **Confetti** - 100 partikel canvas
- ✅ **Dark Mode** - Light/Dark theme
- ✅ **5 Theme Colors** - Terracotta, Ocean, Forest, Sunset, Purple

### 📦 Data Management
- ✅ **Auto-Save** - Semua data tersimpan otomatis
- ✅ **Import** - Dari file .txt/.csv
- ✅ **Paste** -直接从 clipboard
- ✅ **Sample Data** - Load contoh otomatis
- ✅ **Export CSV** - Download ke Excel
- ✅ **Export PDF** - Print atau save as PDF
- ✅ **Copy Results** - Copy ke clipboard

### 📊 Smart Statistics
- 📊 Total Kelompok
- 👥 Total Anggota
- 📈 Rata-rata/Kelompok
- ⚖️ Selisih (Fairness indicator)

### 🎨 UI/UX
- ✅ **Toast Notifications** - Feedback dengan emoji
- ✅ **History Panel** - Riwayat shuffle
- ✅ **Settings Modal** - Customization
- ✅ **Keyboard Shortcuts** - Ctrl+Enter to shuffle
- ✅ **Responsive** - Mobile, tablet, desktop
- ✅ **Accessibility** - ARIA labels, keyboard nav

### 🔊 Sound Effects
- Click sound
- Success jingle
- Error buzz
- Card reveal
- Dice roll

## 🎮 Cara Menggunakan

### Langkah Dasar
1. **Input nama** (satu per baris di textarea)
2. **Set jumlah kelompok** (gunakan tombol + atau -)
3. **Pilih mode** (Balanced untuk distribusi adil)
4. **Atur durasi animasi** (geser slider 2-10 detik)
5. **Klik "Kocok!"** atau tekan `Ctrl+Enter`
6. **Tunggu animasi** dadu berputar
7. **Lihat hasil** dengan statistik lengkap

### Keyboard Shortcuts
| Shortcut | Fungsi |
|----------|--------|
| `Ctrl + Enter` | Kocok nama |
| `Escape` | Tutup modal/panel |

## 🧠 Algoritma Fair & Smart

### Balanced Mode (Default)
```javascript
// Distribusi paling adil
1. Fisher-Yates shuffle dengan 3 passes
2. Crypto-random jika tersedia (lebih acak)
3. Bagi rata ke semua kelompok
4. Sisa (remainder) didistribusi ke group pertama
```

**Contoh**: 23 nama, 5 kelompok
- Base: 23 ÷ 5 = 4 anggota/kelompok
- Remainder: 23 % 5 = 3
- Hasil: 3 kelompok @5 anggota, 2 kelompok @4 anggota
- **Selisih: ±1** (paling adil!)

### Random Mode
```javascript
// Acak total
1. Shuffle semua nama
2. Pastikan setiap kelompok dapat minimal 1
3. Sisa didistribusi acak
```

## 📁 Struktur File

```
rolling name/
├── index.html              # Main file (langsung buka!)
├── src/
│   ├── app.js              # Vanilla JS (~700 lines)
│   └── css/
│       └── styles.css      # Optimized CSS (~290 lines)
├── assets/
│   └── images/
│       └── favicon.svg     # SVG favicon
├── package.json            # 0 dependencies
├── README.md               # This file
├── FITUR.md                # Dokumentasi lengkap
└── OPTIMIZATION.md         # Performance report
```

## 🔧 Customization

### Ganti Warna Tema
Edit `src/css/styles.css`:
```css
:root {
  --primary: #D97D55;  /* Ubah warna utama */
  --secondary: #6FA4AF;
}
```

### Ubah Quotes
Edit `src/app.js` - cari array `quotes`:
```javascript
const quotes = [
  { text: 'Quote baru', author: 'Penulis' },
  // ...
];
```

### Durasi Animasi Default
Default 5 detik. Bisa diubah user via slider (2-10s).

## 📊 Performance

### Bundle Size
```
TypeScript Version (Old): ~80 KB
Vanilla JS Version (New): ~15 KB
Improvement: 81% smaller ⬇️
```

### Load Time
```
Cold start:  < 0.5 detik
Subsequent:  < 0.2 detik
Memory:      ~5 MB
```

### Browser Support
✅ Chrome 80+  
✅ Firefox 75+  
✅ Safari 13+  
✅ Edge 80+  
✅ Mobile browsers

## 🐛 Troubleshooting

### "Audio tidak bunyi"
- Klik di halaman dulu (browser autoplay policy)
- Toggle sound off/on di settings
- Cek volume device

### "Animasi durasi tetap 5 detik"
- Geser slider "Durasi Animasi" (2-10 detik)
- Settings tersimpan otomatis

### "Data tidak tersimpan"
- Cek localStorage enabled di browser
- Disable incognito/private mode
- Clear browser cache

### "Hasil tidak adil"
- Gunakan mode "Balanced" (default)
- Mode "Random" memang untuk variasi

## 📝 Changelog

### v2.1.0 - Fair & Smart Edition
**Improvements:**
- ✅ Durasi animasi **BISA DIGANTI** (2-10 detik)
- ✅ Algoritma lebih adil (3-pass Fisher-Yates)
- ✅ Crypto-random support (jika tersedia)
- ✅ Validation lebih pintar dengan emoji feedback
- ✅ Semua tombol & fitur 100% berfungsi
- ✅ Auto-save semua settings
- ✅ Error handling lengkap

**Bug Fixes:**
- ✅ Fixed animation duration tidak berubah
- ✅ Fixed audio context resume
- ✅ Fixed localStorage error handling
- ✅ Fixed confetti canvas resize

### v2.0.0 - Lightweight Edition
- Removed TypeScript overhead
- Removed Vite build system
- Optimized CSS & JS
- 80% smaller bundle

### v1.0.0
- Initial release

## 🤝 Contributing

Pull request welcome! Fokus pada:
- Performance optimization
- Bug fixes
- Accessibility improvements
- Fair algorithm enhancements

## 📄 License

MIT License - Bebas digunakan untuk tujuan pribadi dan komersial.

## ☕ Support

Jika aplikasi ini bermanfaat:
- ⭐ Star repository ini
- 📢 Share ke teman
- 💡 Suggest fitur baru

## 📞 Contact

- 📖 Baca [FITUR.md](FITUR.md) untuk dokumentasi lengkap
- 📄 Baca [OPTIMIZATION.md](OPTIMIZATION.md) untuk performance report
- 🐛 Report bug di Issues

---

**Groupify v2.1** - Ringan, Adil, Pintar, Semua Berfungsi! 🚀

Made with ❤️ by Groupify Team
