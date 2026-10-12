# MATH READY SD

**Belajar Sekarang. Kuasai Konsepnya. Siap TKA.**

MATH READY SD adalah prototipe platform pembelajaran matematika untuk siswa SD/MI kelas 4–6. Platform ini dirancang untuk mendukung pembelajaran bertahap, latihan bergaya TKA, dan membantu guru memahami topik yang perlu diperkuat.

> Platform ini bukan platform resmi TKA. Soal dan latihan yang ditampilkan bersifat demonstrasi dan bergaya TKA.

## Status proyek

Repository ini saat ini berisi **prototipe frontend statis** berbasis HTML, CSS, dan JavaScript. Data dashboard dan soal contoh masih berupa data demo di browser; belum ada backend, autentikasi, atau penyimpanan data permanen. Karena itu, jangan gunakan data siswa sungguhan pada prototipe ini.

Ruang lingkup awal, matriks akses, model data, aturan penilaian, dan alur status sedang dirancang dalam [Rancangan MVP](./DOKUMEN-MVP.md). Ketentuan yang ditandai sebagai usulan di dokumen tersebut belum merupakan keputusan produk final.

## Fitur yang tergambar di prototipe

- **Siswa:** dashboard belajar, penguasaan per domain, diagnostic contoh, rekomendasi belajar, dan buku kesalahan.
- **Guru:** ringkasan kelas, peta penguasaan, daftar siswa, dan pembuatan tugas.
- **Pengelolaan soal:** input/impor CSV serta alur konten draf, review, pilot, dan terbit.
- **Orang tua dan admin:** contoh ringkasan perkembangan serta panel administrasi.
- Tampilan responsif, mode gelap, navigasi antarhalaman, dan preferensi tampilan di browser.

Interaksi yang tampak aktif di prototipe tidak selalu menyimpan data atau menjalankan proses backend. Beberapa tombol dan angka hanya untuk demonstrasi alur dan tampilan.

## Menjalankan prototipe

Prototipe tidak memerlukan instalasi dependency.

1. Clone atau unduh repository ini.
2. Buka `index.html` langsung di browser, atau jalankan server web statis dari root repository.

Contoh menjalankan server lokal jika Python tersedia:

```bash
python -m http.server 8000
```

Kemudian buka [http://localhost:8000](http://localhost:8000).

## Struktur repository

```text
.
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── DOKUMEN-MVP.md
├── README.md
└── index.html
```

## Arah pengembangan

Langkah pengembangan berikutnya adalah menyepakati aturan produk yang masih terbuka di [Rancangan MVP](./DOKUMEN-MVP.md), khususnya:

- aturan skor parsial untuk tipe soal PGK dan kebijakan percobaan ulang;
- pihak yang berwenang meninjau serta menerbitkan soal;
- cakupan sekolah pada rilis awal;
- metode login siswa dan data identitas yang benar-benar diperlukan;
- apakah diagnostic masuk ke MVP produksi.

Setelah keputusan tersebut disepakati, backend dan penyimpanan data dapat dibangun berdasarkan alur serta aturan yang konsisten. Teknologi backend belum ditetapkan sebagai keputusan repository.

## Privasi dan data

Gunakan data contoh saja saat mencoba prototipe. Jangan memasukkan nama lengkap, NISN, alamat, nomor telepon, atau informasi pribadi siswa ke dalam file atau demonstrasi publik. Sebelum menguji dengan data nyata, diperlukan backend dengan kontrol akses, perlindungan data, dan kebijakan retensi yang sesuai.
