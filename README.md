# MadrasahKu - Sistem Manajemen Madrasah Digital

MadrasahKu adalah platform manajemen sekolah terintegrasi yang dirancang khusus untuk madrasah dan pondok pesantren. Platform ini mencakup manajemen akademik, data induk santri, progres tahfidz, presensi, manajemen keuangan dengan gateway pembayaran, dan sistem komunikasi wali murid.

## Fitur Utama & Modul Terbaru

- **Dashboard Real-time**: Ringkasan statistik kehadiran, keuangan, dan aktivitas akademik dengan visualisasi data yang interaktif.
- **Data Induk Santri (Master Data)**: Manajemen lengkap data santri (CRUD) dengan validasi NIS unik, pencarian cepat, dan integrasi kontak orang tua.
- **Modul Tahfidz & Diniyah**: 
  - Pemantauan progres hafalan Al-Qur'an santri.
  - Grafik batang individual untuk melihat tren setoran hafalan setiap santri selama 6 bulan terakhir.
  - Statistik dinamis untuk setoran mingguan dan prestasi terbaik.
- **Manajemen Keuangan & Payment Gateway**: 
  - Pelacakan pembayaran SPP dan biaya pendidikan.
  - Konfigurasi mandiri untuk gateway pembayaran **Midtrans** dan **Xendit** (Sandbox & Production).
- **Presensi Digital**: Pencatatan kehadiran santri dengan status kehadiran yang terintegrasi.
- **Akademik & E-Rapor**: Transparansi nilai akademik yang tersimpan secara terpusat.
- **Komunikasi Terpadu**: Sistem pengumuman dan pesan untuk koordinasi antara sekolah dan wali murid.

## Arsitektur Teknologi

- **Frontend**: React 18+ dengan TypeScript.
- **Styling**: Tailwind CSS untuk antarmuka yang modern dan responsif.
- **Animasi**: Motion (framer-motion) untuk transisi UI yang halus.
- **Visualisasi Data**: Recharts untuk grafik perkembangan hafalan dan statistik.
- **Autentikasi**: Firebase Auth (Google Login).
- **Backend & Database**: 
  - **Google Apps Script (GAS)** sebagai API serverless.
  - **Google Sheets** sebagai database utama untuk kemudahan akses data secara langsung.

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
   Salin file `.env.example` menjadi `.env` dan isi nilai yang diperlukan (Firebase Config, GAS URL, Payment Keys):
   ```bash
   cp .env.example .env
   ```

4. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

## Struktur Proyek

- `/src/pages`: Halaman modul aplikasi (Dashboard, Santri, Tahfidz, Keuangan, dll).
- `/src/components`: Komponen UI reusable (Layout, Modals, Charts).
- `/src/services`: Logika integrasi API (apiService.ts) untuk komunikasi dengan GAS.
- `/src/context`: Pengelolaan state global (AuthContext).
- `/code.gs`: Skrip backend Google Apps Script.
- `/server.ts`: Entry point backend Express untuk serving frontend di lingkungan produksi.

## Keamanan & Validasi

- **Validasi Input**: Implementasi validasi ketat untuk NIS (numerik 4-12 digit) dan format nomor telepon Indonesia.
- **Keamanan API**: Penggunaan variabel lingkungan (`Secrets`) untuk menyimpan kunci API pembayaran agar tidak terekspos di sisi klien.
- **Autentikasi**: Proteksi rute berbasis peran (Admin, Guru, Wali, Siswa).

---
© 2026 MadrasahKu Team. Dibuat untuk kemajuan pendidikan Islam digital yang modern dan transparan.
