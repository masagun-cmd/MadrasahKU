# MadrasahKu - Sistem Manajemen Madrasah Digital

MadrasahKu adalah platform manajemen sekolah terintegrasi yang dirancang khusus untuk madrasah dan pondok pesantren. Platform ini mencakup manajemen akademik, presensi santri berbasis QR, e-Rapor digital, manajemen keuangan, dan sistem komunikasi wali murid.

## Fitur Utama

- **Dashboard Real-time**: Ringkasan statistik kehadiran, keuangan, dan aktivitas akademik.
- **Presensi Digital (QR Code)**: Pencatatan kehadiran santri menggunakan pemindaian QR Code dengan notifikasi otomatis ke wali murid via WhatsApp.
- **E-Rapor Digital**: Transparansi nilai akademik dan kepesantrenan yang dapat diakses oleh guru, santri, dan wali murid.
- **Manajemen Keuangan**: Pelacakan pembayaran SPP dan biaya pendidikan lainnya.
- **Modul Tahfidz**: Pemantauan progres hafalan Al-Qur'an santri.
- **Komunikasi Terpadu**: Sistem pengiriman pesan dan pengumuman kepada wali murid.

## Persyaratan Sistem

- **Node.js**: Versi 18.x atau lebih baru.
- **npm**: Versi 9.x atau lebih baru.
- **Browser**: Chrome, Firefox, Safari, atau Edge versi terbaru.

## Instalasi Pengembangan

1. Clone repositori ini:
   ```bash
   git clone <repository-url>
   cd madrasahku
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Konfigurasi variabel lingkungan:
   Salin file `.env.example` menjadi `.env` dan isi nilai yang diperlukan:
   ```bash
   cp .env.example .env
   ```

4. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

## Panduan Implementasi Produksi

### 1. Persiapan Build
Sebelum melakukan deployment, buatlah build produksi untuk mengoptimalkan performa frontend:
```bash
npm run build
```
Hasil build akan berada di direktori `dist/`.

### 2. Variabel Lingkungan Produksi
Pastikan variabel lingkungan berikut telah dikonfigurasi di server produksi Anda:
- `NODE_ENV=production`
- `PORT=3000`
- `TWILIO_ACCOUNT_SID`: (Opsional) Untuk fitur WhatsApp.
- `TWILIO_AUTH_TOKEN`: (Opsional) Untuk fitur WhatsApp.
- `TWILIO_WHATSAPP_NUMBER`: (Opsional) Nomor pengirim WhatsApp.

### 3. Menjalankan di Produksi
Gunakan perintah berikut untuk menjalankan aplikasi dalam mode produksi:
```bash
npm start
```
Untuk menjaga aplikasi tetap berjalan di latar belakang, disarankan menggunakan process manager seperti **PM2**:
```bash
npm install -g pm2
pm2 start server.ts --name madrasahku --interpreter tsx
```

### 4. Deployment ke Cloud (Contoh: Google Cloud Run)
Aplikasi ini siap untuk dideploy ke kontainer seperti Google Cloud Run.
1. Pastikan `Dockerfile` tersedia (jika diperlukan).
2. Build image dan push ke Container Registry.
3. Deploy dengan mengekspos port `3000`.

## Struktur Proyek

- `/src/pages`: Halaman utama aplikasi (Dashboard, Akademik, Presensi, dll).
- `/src/components`: Komponen UI yang dapat digunakan kembali.
- `/src/context`: Pengelolaan state global (seperti AuthContext).
- `/server.ts`: Entry point backend Express untuk menangani API dan serving frontend.
- `/vite.config.ts`: Konfigurasi build Vite dan Tailwind CSS.

## Keamanan

- Gunakan HTTPS untuk semua koneksi produksi.
- Pastikan rahasia API (seperti Twilio) tidak terekspos di sisi klien (frontend).
- Selalu validasi input di sisi server untuk API presensi dan nilai.

---
© 2026 MadrasahKu Team. Dibuat untuk kemajuan pendidikan Islam digital.
