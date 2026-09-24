# 📖 Flipbook Interaktif: Buku Panduan Edukasi Balita Gizi (PMT Pangan Lokal)

Flipbook HTML5 interaktif berbasis web untuk booklet edukasi **"Panduan Praktis Pangan Lokal untuk Balita Gizi Kurang"** (Puskesmas Wonokromo & Aldenaire Academy).

Aplikasi ini didesain dengan standar UI/UX modern ala *Heyzine Flipbooks*, dilengkapi animasi lembar buku realistis (*page-turn physics*), navigasi halaman lengkap, efek audio lembaran kertas, dan integrasi formulir evaluasi **Google Form**.

---

## ✨ Fitur Unggulan

1. **Animasi Balik Halaman Realistis (3D Flipbook Effect)**
   - Menggunakan physics engine *StPageFlip* dengan bayangan dinamis (*soft spine shadows*) dan efek lekukan kertas.
   - Mendukung gesture sentuhan (*swipe*), tarikan sudut halaman (*corner drag*), klik panah, maupun tombol keyboard (`ArrowLeft` / `ArrowRight`).

2. **Dua Mode Tampilan Responsif (Adaptive Spread)**
   - **Desktop / Layar Lebar**: Mode *2-Page Spread* (halaman ganda bersebelahan layaknya buku fisik yang terbuka).
   - **Mobile / Layar Vertikal**: Mode *Single-Page* yang otomatis disesuaikan agar gambar tetap tajam dan mudah dibaca di smartphone.

3. **Integrasi Google Form (Sesuai Permintaan)**
   Link Google Form ditempatkan secara strategis dan elegan di beberapa titik:
   - **Header Top Bar**: Tombol pill beranimasi pulsa *"Isi Kuesioner (G-Form)"*.
   - **Daftar Isi (Right Drawer)**: Card banner highlight berwarna ungu violet di bagian atas menu samping.
   - **Halaman Penutup (Closing Page)**: Halaman ke-7 interaktif khusus ucapan terima kasih dengan CTA card mencolok *"Buka Google Form Sekarang"*.

4. **Navigasi & Pemilihan Halaman**
   - **Drawer Kanan (Daftar Isi / TOC)**: Membuka daftar bab lengkap dari Cover hingga Penutup.
   - **Drawer Bawah (Grid Thumbnail)**: Preview visual semua lembar halaman dengan nomor halaman.
   - **Scrubber Bar Bawah**: Slider geser langsung antar halaman lengkap dengan counter halaman.

5. **Fitur Pendukung Tambahan**
   - **Efek Suara Lembaran Kertas**: Suara kertas realistis yang disintesis langsung dengan *Web Audio API* (bebas ketergantungan file audio eksternal dan bisa di-mute).
   - **Mode Zoom HD**: Melihat detail teks dan ilustrasi dengan pembesaran hingga 350% dan fitur geser (*pan*).
   - **Ganti Tema Ambience**: Mode Terang (*Clean Editorial*), Mode Gelap (*Midnight Dark*), dan Mode Kertas Hangat (*Warm Sepia*).
   - **Putar Otomatis (Auto-Play)** & **Mode Layar Penuh (Fullscreen)**.
   - **Unduh PDF Asli**: Tombol unduh file `coba booklet.pdf`.

---

## 🔗 Cara Mengganti Link Google Form

Kamu dapat mengatur link Google Form dengan 3 cara mudah:

### Cara 1: Ubah di file `app.js` (Rekomendasi Utama)
Buka file [app.js](file:///app.js) pada baris ke-18:
```javascript
let GOOGLE_FORM_URL = queryGForm || localStorage.getItem('pmt_gform_url') || 'https://forms.gle/LINK_FORM_KAMU_DISINI';
```
Ganti `'https://forms.gle/LINK_FORM_KAMU_DISINI'` dengan URL Google Form yang telah kamu buat.

### Cara 2: Lewat URL Browser (Tanpa Edit Kode)
Cukup buka tautan web dengan menambahkan parameter `?form=`:
```
http://localhost:3000/?form=https://forms.gle/contohLinkAnda
```
Link tersebut akan otomatis tersimpan di penyimpanan browser (*localStorage*).

---

## 🚀 Menjalankan Aplikasi Secara Lokal

Cukup jalankan web server sederhana (misalnya Python atau live-server):
```bash
python -m http.server 3000
```
Lalu buka peramban di [http://localhost:3000](http://localhost:3000).
Aplikasi ini murni menggunakan HTML, CSS vanilla, dan JS tanpa build step rumit, sehingga siap di-upload ke GitHub Pages, Vercel, Netlify, atau web hosting manapun!
