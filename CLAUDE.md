# Kalkulator Interior, Sipil, dan Arsitektur

Aplikasi web statis untuk perkiraan cepat pekerjaan rumah tinggal. Pemilik: Sinar Tata Arsitektur (STA). Bahasa kode, komentar, pesan error, dan UI: Bahasa Indonesia.

Cakupan (tujuh kalkulator, tiga kelompok di halaman):
- **Interior**: keramik lantai (`hitungKeramik`), cat dinding (`hitungCat`).
- **Sipil**: beton (`hitungBeton`), dinding bata (`hitungBata`), besi tulangan (`hitungBesi`).
- **Arsitektur**: tangga lurus (`hitungTangga`), KDB/KLB (`hitungKdbKlb`).

## Struktur
- `index.html`: tampilan + skrip UI, dibagi Interior / Sipil / Arsitektur dengan tautan cepat. Memuat `kalkulator.js` lewat `<script>`, tanpa build.
- `kalkulator.js`: semua rumus dan konstanta. Diekspor via `module.exports` untuk tes, dan tetap jalan di browser.
- `kalkulator.test.js`: tes `node:test`.
- `README.md`: cara pakai, tabel rumus, dan bagian Batasan.

## Menjalankan & tes
- Aplikasi: buka `index.html` di browser. Tidak ada dependensi, npm, atau build step.
- Tes: `node --test` (Node.js 18+). Wajib lulus sebelum commit.

## Aturan kode
- JavaScript murni (vanilla). Jangan menambah framework, bundler, atau paket npm tanpa izin Pimpinan.
- Rumus hanya di `kalkulator.js`. UI hanya membaca input, memanggil fungsi `hitung...`, dan menampilkan hasil.
- Konstanta bernama di bagian atas `kalkulator.js` (`FAKTOR_VOLUME_KERING` 1,54; `BERAT_ISI_SEMEN` 1.440 kg/m³; `BERAT_JENIS_BAJA` 7.850 kg/m³; rumus langkah 60–65 cm). Jangan menulis angka ajaib di dalam rumus; jangan mengubah konstanta tanpa izin Pimpinan dan tanpa menyebut sumbernya.
- Setiap perubahan atau penambahan rumus wajib disertai tes dengan angka yang dihitung tangan, tabel rumus di `README.md` diperbarui, dan Batasan ditambah bila ada asumsi baru.
- Validasi input lewat `pastikanPositif` / `pastikanTidakNegatif`, plus cek logis khusus (mis. bukaan > dinding, potongan > batang, lantai dasar > lahan); lempar `RangeError` dengan pesan Bahasa Indonesia.
- Pembulatan lewat helper (`bulatkanKeAtas`, `bulatkanKeBawah`, `bulatkan`) yang kebal galat pecahan biner. Jangan pakai `Math.ceil/floor/round` langsung pada hasil perkalian atau pembagian pecahan.
- Jumlah yang dibeli (sak, keping, dus, bata, batang, liter) dibulatkan ke atas; nilai tampilan memakai `bulatkan`.
- Pemeriksaan batas (memenuhi / tidak memenuhi, mis. KDB, KLB, rumus langkah) memakai nilai **sebelum** dibulatkan, supaya nilai yang sedikit melewati batas tidak lolos karena pembulatan.

## Satuan
- Ruangan, dinding, beton, panjang besi: meter (m). Luas: m². Volume: m³.
- Keramik, bata, siar, tangga: sentimeter (cm). Diameter besi: milimeter (mm). Konversi ke meter di dalam rumus.
- Cat: liter, dibulatkan ke atas 0,1 L. Daya sebar: m²/L per lapis (bawaan 10).
- Semen: sak (bawaan 50 kg). Pasir & kerikil: m³, dibulatkan ke atas 0,01. Berat besi: kg. Batang besi bawaan 12 m.
- Sudut tangga: derajat. KDB: persen. KLB: tanpa satuan (rasio).
- Cadangan dalam persen: keramik 10%, beton 5%, bata 5% (bawaan).

## Batasan (jangan dilanggar tanpa izin Pimpinan)
- Ini alat perkiraan pembelian bahan dan pemeriksaan ukuran, **bukan** alat desain struktur. Jangan menambah hitungan kekuatan, mutu beton, atau mix design.
- Beton dari perbandingan volume (faktor 1,54); besi hanya berat dan jumlah batang, potongan lebih panjang dari batang ditolak (sambungan lewatan dihitung sendiri); tangga lurus tanpa bordes; batas KDB/KLB diisi pengguna sesuai peraturan zona setempat.
- Label di UI harus tetap menyebutkan bahwa hasil berupa perkiraan dan perlu dicocokkan dengan kondisi lapangan, data teknis produk, dan peraturan yang berlaku.
- Repo ini tidak memakai Python. Pustaka teknik di `~/.venv-aec` dari environment cloud tidak relevan di sini.
