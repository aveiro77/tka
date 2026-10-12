# Rancangan MVP — MATH READY SD

**Status:** Draf untuk ditinjau  
**Tujuan:** Menjadi acuan awal implementasi backend. Ketentuan bertanda **Usulan** belum merupakan keputusan produk final.

## 1. Ruang lingkup MVP

### Tujuan

Membantu guru mengelola kelas dan latihan matematika kelas 4–6, membantu siswa mengerjakan diagnostic dan tugas, serta memberi guru ringkasan hasil yang dapat ditindaklanjuti. Platform ini bukan platform resmi TKA; soal hanya bergaya TKA.

### Termasuk

1. Login dan akses berbasis peran: admin, guru, siswa.
2. Pembuatan kelas dan tahun ajaran, penautan guru, serta pengelolaan siswa.
3. Impor siswa melalui CSV dengan pratinjau, validasi per baris, dan laporan hasil impor.
4. Bank soal dengan metadata, pembahasan, penyimpanan draf, review, pilot, dan penerbitan.
5. Pembuatan tugas dari soal terbit, penetapan kelas/penerima, jumlah soal, dan tenggat.
6. Pengerjaan tugas oleh siswa, penyimpanan jawaban/percobaan, penilaian, serta riwayat hasil.
7. Diagnostic awal dan ringkasan hasil per siswa/topik untuk guru.
8. Log perubahan penting, khususnya pada akses data siswa, impor, status soal, tugas, dan hasil.

### Di luar MVP

- Dashboard orang tua dan pengaitan akun orang tua–siswa.
- Rekomendasi adaptif otomatis, gamifikasi (XP/streak), dan pembelajaran berbantuan AI.
- Aplikasi mobile native, integrasi LMS, pembayaran, dan multi-tenant tingkat lanjut.
- Klaim atau prediksi kelulusan/nilai resmi TKA.

**Catatan:** Orang tua ditampilkan di prototipe, tetapi alur akun dan relasinya belum ditentukan. Karena itu, portal orang tua ditunda; akses guru/siswa tetap menjadi fokus MVP.

## 2. Matriks akses

`CRUD` berarti membuat, melihat, mengubah, dan menghapus sesuai batas data. Penghapusan data akademik sebaiknya berupa arsip/soft delete agar riwayat tidak rusak.

| Kemampuan | Admin | Guru | Siswa | Orang tua |
|---|---|---|---|---|
| Pengguna, sekolah, dan konfigurasi | Kelola sesuai cakupan admin | — | — | — |
| Kelas dan keanggotaan siswa | Kelola sesuai cakupan admin | Kelola kelas yang ditugaskan | Lihat kelas sendiri secara terbatas | — |
| Impor dan data identitas siswa | Kelola; akses identitas dibatasi | Impor/kelola siswa di kelasnya | Lihat data profil minimum sendiri | — |
| Soal dan metadata | CRUD; dapat meninjau | Buat draf dan tinjau sesuai kewenangan | — | — |
| Penerbitan soal | **Usulan:** Admin atau reviewer yang ditunjuk | **Usulan:** guru reviewer dapat menyetujui | — | — |
| Tugas | Lihat/kelola untuk dukungan operasional | Buat dan kelola tugas kelasnya | Lihat dan kerjakan tugas yang ditujukan kepadanya | — |
| Jawaban dan hasil | Akses terbatas untuk dukungan | Lihat hasil siswa di kelasnya | Kirim jawaban dan lihat hasil sendiri | — |
| Laporan kelas | Lihat agregat sesuai cakupan | Lihat kelas yang ditugaskan | — | — |
| Perkembangan anak | — | — | — | Di luar MVP |

Semua pemeriksaan izin dilakukan di server pada setiap permintaan. Akses admin tidak berarti akses tanpa batas: cakupan sekolah dan tindakan sensitif perlu dicatat. Jangan gunakan NISN sebagai kata sandi; kumpulkan hanya identitas yang benar-benar diperlukan dan batasi akses/ekspornya.

## 3. Model data inti

| Entitas | Data inti dan relasi |
|---|---|
| `User` | Identitas login, nama, status; satu pengguna memiliki satu atau lebih peran. Kredensial tidak disimpan sebagai teks biasa. |
| `School` | Nama dan status sekolah. **Usulan:** masukkan sejak awal sebagai batas kepemilikan data, meskipun pilot pertama hanya satu sekolah. |
| `Classroom` | Sekolah, nama kelas/rombel, tingkat, tahun ajaran, status. |
| `ClassMembership` | Relasi siswa dengan kelas; menyimpan tanggal mulai/akhir agar riwayat kelas dan tahun ajaran terjaga. |
| `TeacherAssignment` | Relasi guru dengan kelas beserta masa penugasan. |
| `Question` | Domain, topik, kelas/grade, label kurikulum, tipe soal, stimulus, teks, opsi/pernyataan, kunci, pembahasan, tingkat kognitif, kesulitan, status, versi, pembuat dan reviewer. |
| `Assignment` | Guru pembuat, kelas/penerima, materi atau cakupan soal, jumlah soal, tanggal buka/tenggat, status. |
| `AssignmentQuestion` | Soal dan versi soal yang dipakai tugas; membekukan isi soal untuk menjaga konsistensi penilaian historis. |
| `Attempt` | Siswa, tugas atau diagnostic, waktu mulai/kirim, status, skor mentah, dan versi aturan penilaian. |
| `Answer` | Percobaan, soal/versi, jawaban siswa, benar/salah atau skor item, waktu jawab. |
| `AuditEvent` | Aktor, tindakan, objek, waktu, dan metadata minimum untuk perubahan penting; hindari menyalin data sensitif ke log. |

**Relasi utama:** sekolah memiliki kelas; kelas memiliki guru dan siswa melalui tabel relasi; guru membuat tugas; tugas mengambil versi soal; siswa memiliki percobaan dan jawaban. Penghapusan/keluar kelas tidak boleh menghilangkan hasil historis.

## 4. Aturan penilaian

### Usulan awal untuk MVP

- **PG:** 1 poin bila pilihan sama dengan kunci; selain itu 0.
- **PGK-MCMA:** jawaban benar bila himpunan pilihan siswa persis sama dengan kunci; selain itu 0. Tidak ada pengurangan nilai untuk pilihan tambahan.
- **PGK-Kategori:** 1 poin bila keempat kategori benar; selain itu 0.
- Persentase percobaan = poin diperoleh ÷ poin maksimum × 100, dibulatkan ke bilangan bulat terdekat. Simpan juga poin mentah dan maksimum agar hasil dapat dihitung ulang.
- Diagnostic menghasilkan peta awal berdasarkan jawaban benar per domain/topik; tingkat keyakinan boleh disimpan sebagai sinyal terpisah, tetapi **tidak mengubah skor** pada MVP.
- Hasil diagnostic, penguasaan, dan kesiapan adalah indikator internal pembelajaran, bukan nilai resmi atau prediksi kelulusan TKA.
- Percobaan yang sudah dikirim tidak dapat diedit siswa. Percobaan ulang hanya tersedia jika aturan tugas mengizinkan; setiap percobaan disimpan terpisah.

### Belum diputuskan

1. Apakah MCMA dan kategori perlu skor parsial atau seluruhnya benar/salah?
2. Apakah tugas mengizinkan percobaan ulang; bila ya, skor mana yang dipakai untuk laporan?
3. Ambang penguasaan per topik/domain dan jumlah soal minimum sebelum menampilkan persentase.
4. Apakah diagnostic memakai batas waktu, dapat dilanjutkan, atau dapat diulang?

Sebelum keputusan tersebut disepakati, dashboard sebaiknya menampilkan skor mentah/persentase beserta jumlah soal, bukan label “menguasai” atau “siap” yang memberi kesan standar baku.

## 5. Alur status

### Soal

`Draf → Review → Pilot → Terbit`

- Pembuat menyimpan soal sebagai draf; soal wajib lolos validasi field dan kunci.
- Pengajuan review mencatat pengaju dan waktu.
- Reviewer memberi persetujuan atau mengembalikan soal dengan catatan; pembuat memperbaiki dan mengajukan ulang.
- Pilot menguji soal pada kelompok terbatas. Syarat lulus pilot perlu ditentukan; perubahan kunci/isi substantif mengembalikan soal ke review.
- Hanya soal terbit yang dapat dipakai untuk tugas baru.
- Perubahan soal terbit membuat versi baru. Tugas dan percobaan lama tetap merujuk versi yang sebelumnya dipakai.
- Soal terbit dapat ditarik/nonaktifkan agar tidak dipakai lagi, tanpa menghapus riwayat.

**Usulan kewenangan:** guru dapat membuat/mengajukan dan melakukan review sesuai penugasan; hanya reviewer yang ditunjuk (admin atau guru senior) dapat menerbitkan. Hindari tombol yang menaikkan banyak soal melewati review satu per satu seperti mode demo di prototipe.

### Tugas dan pengerjaan

`Draf → Terjadwal (opsional) → Aktif → Ditutup → Diarsipkan`

- Tugas draf dapat diedit. Saat diaktifkan, penerima dan versi soal ditetapkan.
- Aktif saat rentang waktu pengerjaan dimulai dan belum ditutup; tugas bertenggat lewat otomatis ditutup (**usulan**, zona waktu sekolah).
- Penutupan mencegah pengiriman baru; jawaban yang sudah dikirim dan hasil tetap tersedia bagi guru/siswa terkait.
- Percobaan siswa: `Belum mulai → Dikerjakan → Dikirim → Dinilai`. Untuk soal objektif, penilaian otomatis terjadi saat dikirim; status `Dinilai` menyatakan skor tersimpan.
- Penyesuaian manual oleh guru, jika kelak diperlukan, harus menyimpan nilai awal, nilai baru, alasan, aktor, dan waktu.

## 6. Keputusan yang perlu disepakati sebelum implementasi

1. Skor parsial atau semua-benar-atau-nol untuk tipe PGK.
2. Aturan percobaan ulang dan cara agregasi hasil.
3. Siapa yang berwenang meninjau dan menerbitkan soal, termasuk kriteria pilot.
4. Apakah MVP pilot hanya untuk satu sekolah atau harus mendukung beberapa sekolah sejak rilis pertama.
5. Metode login siswa dan kebutuhan penyimpanan NISN/identitas lain.
6. Apakah diagnostic termasuk alur produksi MVP atau ditunda setelah tugas reguler.

**Rujukan prototipe:** [index.html](./index.html) dan [js/app.js](./js/app.js). Data, angka dashboard, diagnostic, dan kontrol alur dalam prototipe merupakan contoh/demo; dokumen ini tidak menganggapnya sebagai aturan produk final.
