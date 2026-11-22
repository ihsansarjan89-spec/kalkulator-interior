# Kalkulator Interior, Sipil, dan Arsitektur

Aplikasi web statis (vanilla JS) untuk perkiraan cepat material dan ukuran rumah tinggal. Pemilik: Sinar Tata Arsitektur (STA). Kode, komentar, pesan error, dan UI: Bahasa Indonesia.

## Struktur & tes
- `index.html` (tampilan + skrip UI), `kalkulator.js` (semua rumus), `kalkulator.test.js`, `README.md` (tabel rumus dan Batasan).
- Buka `index.html` di browser. Tes: `node --test` (Node 18+), wajib lulus sebelum commit.

## Aturan kode
- Tanpa framework, bundler, atau paket npm tanpa izin Pimpinan.
- Rumus hanya di `kalkulator.js`; UI hanya membaca input, memanggil fungsi `hitung...`, menampilkan hasil.
- Ubah atau tambah rumus: wajib tes dengan angka hitung tangan, dan perbarui tabel rumus + Batasan di `README.md`.
- Pembulatan lewat helper di `kalkulator.js`, bukan `Math.ceil/floor/round` langsung. Pemeriksaan batas (memenuhi / tidak) memakai nilai sebelum dibulatkan.
- Ini alat perkiraan, bukan alat desain struktur. Jangan menambah hitungan kekuatan atau mix design.

Rumus, konstanta, dan batasan per kalkulator sipil/arsitektur: lihat `README.md` dan skill `kalkulator-sipil`.
