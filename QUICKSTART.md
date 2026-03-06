# 🚀 Quick Start Guide - Groupify

## Menjalankan Aplikasi (Cara Termudah)

### Opsi 1: Langsung Buka File (Tanpa Install)
1. Buka file `index.html` di browser Chrome/Edge/Firefox
2. Aplikasi langsung bisa digunakan!
3. **Catatan**: Beberapa fitur mungkin terbatas tanpa server

### Opsi 2: Dengan Development Server (Recommended)

#### Prerequisites
- Node.js 18+ (download dari https://nodejs.org)

#### Langkah Instalasi
```bash
# 1. Buka terminal/command prompt di folder ini
# 2. Install dependencies (hanya sekali)
npm install

# 3. Jalankan development server
npm run dev

# 4. Buka browser di http://localhost:3000
```

#### Commands
```bash
# Development mode (dengan auto-reload)
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

## 📖 Cara Menggunakan

### Langkah Dasar
1. **Input Nama** - Ketik atau paste nama-nama (satu per baris)
2. **Set Jumlah Kelompok** - Gunakan tombol + atau -
3. **Pilih Mode** - Balanced (rekomendasi) atau Random
4. **Kocok!** - Klik tombol "Kocok Sekarang!" atau tekan `Ctrl+Enter`
5. **Lihat Hasil** - Hasil muncul dengan animasi

### Fitur Lanjutan

#### 🎨 Ganti Tema
1. Klik icon 🌙/☀️ di header
2. Pilih warna favorit di Settings

#### 📊 Export Hasil
- **CSV**: Klik "Ekspor CSV" untuk download ke Excel
- **PDF**: Klik "Ekspor PDF" atau `Ctrl+P` untuk print

#### 📜 Lihat History
- Klik icon 📜 di header
- Klik item history untuk melihat hasil sebelumnya

#### ⚙️ Settings
- Klik icon ⚙️ di header
- Atur:
  - Theme Color (5 pilihan)
  - Animation Speed (Slow/Normal/Fast)
  - Default Jumlah Kelompok

### Keyboard Shortcuts
| Tombol | Fungsi |
|--------|--------|
| `Ctrl + Enter` | Kocok nama |
| `Escape` | Tutup modal/panel |

## 🐛 Troubleshooting

### "Aplikasi tidak muncul"
- Pastikan menggunakan browser modern (Chrome/Edge/Firefox)
- Clear cache browser (`Ctrl+Shift+Delete`)
- Coba buka file langsung tanpa server

### "Suara tidak keluar"
- Klik mana saja di halaman dulu (browser autoplay policy)
- Cek toggle "Sound Effects" di settings
- Pastikan volume device tidak mute

### "Data tidak tersimpan"
- Cek apakah localStorage enabled di browser
- Disable incognito/private mode (localStorage terbatas)

### "Animasi tidak smooth"
- Kurangi animation speed di settings
- Tutup tab lain yang berat
- Update browser ke versi terbaru

## 📞 Butuh Bantuan?

- 📖 Baca [README.md](README.md) untuk dokumentasi lengkap
- 📄 Lihat [CHANGELOG.md](CHANGELOG.md) untuk update terbaru
- 🐛 Report bug di Issues

---

**Happy Shuffling! 🎲**
