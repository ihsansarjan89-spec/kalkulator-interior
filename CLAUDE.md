# Kalkulator Interior

Aplikasi web statis untuk memperkirakan material satu ruangan persegi panjang: keramik lantai (keping & dus) dan cat dinding (liter). Pemilik: Sinar Tata Arsitektur (STA). Bahasa kode, komentar, pesan error, dan UI: Bahasa Indonesia.

## Struktur
- `index.html`: tampilan + skrip UI. Memuat `kalkulator.js` lewat `<script>`, tanpa build.
- `kalkulator.js`: semua rumus (`hitungKeramik`, `hitungCat`). Diekspor via `module.exports` untuk tes, dan tetap jalan di browser.
- `kalkulator.test.js`: tes `node:test`.
- `README.md`: cara pakai dan tabel rumus.

## Menjalankan & tes
- Aplikasi: buka `index.html` di browser. Tidak ada dependensi, npm, atau build step.
- Tes: `node --test` (Node.js 18+). Wajib lulus sebelum commit.

## Aturan kode
- JavaScript murni (vanilla). Jangan menambah framework, bundler, atau paket npm tanpa izin Pimpinan.
- Rumus hanya di `kalkulator.js`. UI tidak boleh menghitung sendiri.
- Setiap perubahan atau penambahan rumus wajib disertai tes dengan angka yang dihitung tangan, dan tabel rumus di `README.md` diperbarui.
- Validasi input lewat `pastikanPositif` / `pastikanTidakNegatif`; lempar `RangeError` dengan pesan Bahasa Indonesia.
- Pembulatan ke atas memakai `bulatkanKeAtas` (menghindari galat pecahan biner). Jangan pakai `Math.ceil` langsung pada hasil perkalian pecahan.

## Satuan
- Ukuran ruangan dan dinding: meter (m). Luas: m².
- Ukuran keramik: sentimeter (cm). Konversi ke meter di dalam rumus.
- Cat: liter, dibulatkan ke atas 0,1 L. Daya sebar: m²/L per lapis (bawaan 10).
- Cadangan keramik dalam persen (bawaan 10%).

## Catatan
- Hasil adalah perkiraan; label di UI harus tetap menyebutkan agar dicocokkan dengan kondisi lapangan dan data teknis produk.
- Repo ini tidak memakai Python. Pustaka teknik di `~/.venv-aec` dari environment cloud tidak relevan di sini.
