# Website Desa Ampelan 🌿

![Banner Desa Ampelan](assets/fotange.jpeg)

Sebuah platform digital modern untuk Desa Ampelan yang menghubungkan warga dengan layanan desa secara efisien dan transparan.

## 🌟 Fitur Utama

### 📱 Portal Warga
- **Layanan Online** - Pengurusan surat dan dokumen secara digital
- **Informasi Terkini** - Berita dan pengumuman desa terupdate
- **Notifikasi Langsung** - Pemberitahuan penting untuk warga
- **Profil Digital** - Manajemen data pribadi warga

### 👨‍💼 Panel Admin
- **Dashboard Informatif** - Statistik dan metrik penting desa
- **Manajemen Berita** - Publikasi dan pengelolaan informasi
- **Sistem Notifikasi** - Pengiriman pengumuman ke warga
- **Pengelolaan Dokumen** - Arsip digital surat dan dokumen

## 🎯 Tujuan Proyek

Website Desa Ampelan bertujuan untuk:
1. Mempermudah akses layanan desa
2. Meningkatkan transparansi informasi
3. Mengoptimalkan komunikasi desa-warga
4. Modernisasi sistem administrasi
5. Mendokumentasikan kegiatan desa

## 🛠️ Teknologi

### Frontend
- **React** - Library JavaScript untuk UI yang dinamis
- **TypeScript** - Untuk pengembangan yang lebih aman
- **Tailwind CSS** - Framework CSS untuk desain modern
- **Shadcn UI** - Komponen UI yang cantik dan customizable

### Backend & Database
- **Supabase** - Backend-as-a-Service untuk:
  - Autentikasi
  - Database PostgreSQL
  - Storage
  - Realtime subscriptions

## 🚀 Cara Menjalankan Proyek

### Prerequisites
- Node.js (v18+)
- npm atau pnpm
- Git

### Langkah Instalasi

1. Clone repository
```bash
git clone https://github.com/your-username/ampelan-c.git
cd ampelan-c
```

2. Install dependencies
```bash
npm install
# atau
pnpm install
```

3. Setup environment variables
```bash
cp .env.example .env
```
Isi dengan kredensial Supabase Anda

4. Jalankan development server
```bash
npm run dev
# atau
pnpm dev
```

## 📦 Struktur Proyek

```
src/
├── components/     # Komponen UI yang reusable
├── contexts/       # React contexts (auth, theme, dll)
├── hooks/         # Custom React hooks
├── integrations/  # Integrasi dengan layanan eksternal
├── lib/           # Utilities dan helpers
├── pages/         # Halaman aplikasi
└── types/         # TypeScript type definitions
```

## 🔐 Manajemen Akses

Sistem menggunakan role-based access control:

### 👥 Role Pengguna
- **Admin Desa**
  - Akses penuh ke dashboard admin
  - Manajemen berita dan pengumuman
  - Pengelolaan data warga
  - Verifikasi dokumen

- **Warga**
  - Akses ke layanan online
  - Melihat berita dan pengumuman
  - Mengajukan permohonan surat
  - Manajemen profil pribadi

## 📱 Tampilan & Fitur

### Beranda
- Hero section dengan informasi desa
- Statistik desa (jumlah penduduk, RT/RW, dll)
- Berita dan kegiatan terbaru
- Layanan yang tersedia

### Panel Admin
- Dashboard dengan metrik penting
- Manajemen berita dan pengumuman
- Sistem notifikasi
- Pengelolaan dokumen digital

### Area Warga
- Profil digital
- Riwayat layanan
- Notifikasi
- Pengajuan dokumen

## 🤝 Kontribusi

Kami sangat terbuka untuk kontribusi! Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Buat branch baru (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m 'Menambah fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 📞 Kontak

Untuk pertanyaan dan dukungan, silakan hubungi:
- Email: admin@desa-ampelan.id
- Website: https://desa-ampelan.id
