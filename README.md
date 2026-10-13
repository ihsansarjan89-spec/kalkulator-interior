# Kalkulator Interior, Sipil, dan Arsitektur

Kalkulator sederhana untuk perkiraan cepat pada pekerjaan rumah tinggal:

**Interior**
- **Keramik lantai**: jumlah keping dan jumlah dus, termasuk cadangan potongan.
- **Cat dinding**: jumlah liter, setelah dikurangi luas pintu dan jendela.

**Sipil**
- **Beton**: volume, lalu kebutuhan semen (sak), pasir, dan kerikil dari perbandingan campuran.
- **Dinding bata**: jumlah bata per m² dan jumlah bata untuk satu bidang dinding.
- **Besi tulangan**: berat per meter, berat total, dan jumlah batang yang perlu dibeli.

**Arsitektur**
- **Tangga**: jumlah dan tinggi tanjakan (optrede), panjang datar, kemiringan, dan pemeriksaan rumus langkah.
- **KDB dan KLB**: nilai koefisien dasar dan lantai bangunan, dibandingkan dengan batas yang Anda isi.

## Cara pakai

Buka berkas `index.html` di browser (klik dua kali). Tidak perlu memasang apa pun.
Isi ukurannya, lalu hasilnya langsung muncul.

## Rumus

| Hitungan | Rumus |
| --- | --- |
| Luas lantai | panjang × lebar |
| Jumlah keping keramik | (luas lantai ÷ luas satu keping) × (1 + cadangan), dibulatkan ke atas |
| Jumlah dus keramik | jumlah keping ÷ isi per dus, dibulatkan ke atas |
| Luas dinding ruangan | 2 × (panjang + lebar) × tinggi − luas pintu dan jendela |
| Liter cat | luas dinding × jumlah lapis ÷ daya sebar, dibulatkan ke atas 0,1 liter |
| Volume beton | panjang × lebar × tebal × jumlah elemen |
| Volume bahan kering | volume beton × (1 + cadangan) × 1,54 |
| Semen | volume bahan kering × bagian semen ÷ jumlah bagian × 1.440 kg/m³, lalu dibagi berat per sak |
| Pasir, kerikil | volume bahan kering × bagian masing-masing ÷ jumlah bagian |
| Bata per m² | 1 ÷ ((panjang bata + siar) × (tinggi bata + siar)) |
| Jumlah bata | luas dinding × bata per m² × (1 + cadangan), dibulatkan ke atas |
| Berat besi per meter | π ÷ 4 × diameter² × 7.850 kg/m³ |
| Jumlah batang besi | jumlah potong ÷ banyaknya potong utuh per batang, dibulatkan ke atas |
| Jumlah tanjakan | tinggi antarlantai ÷ tanjakan maksimum, dibulatkan ke atas |
| Rumus langkah | 2 × tanjakan + injakan, nyaman bila 60–65 cm |
| KDB | luas lantai dasar ÷ luas lahan × 100% |
| KLB | luas seluruh lantai ÷ luas lahan |

Rumusnya ada di `kalkulator.js`.

## Batasan

- **Beton** dihitung dari perbandingan volume dengan faktor volume kering 1,54. Ini perkiraan pembelian bahan, bukan pengganti mix design atau mutu beton yang disyaratkan untuk struktur.
- **Besi tulangan** hanya menghitung berat dan jumlah batang. Panjang per potong harus sudah termasuk kait, tekukan, dan sambungan lewatan. Kalkulator ini tidak menghitung kekuatan struktur.
- **Tangga** dianggap lurus tanpa bordes.
- **KDB dan KLB** dibandingkan dengan batas yang Anda isi sendiri, karena batasnya berbeda tiap zona.

Hasil berupa perkiraan. Cocokkan dengan kondisi lapangan, data teknis produk, dan peraturan yang berlaku.

## Menjalankan tes

Tes memeriksa bahwa rumus di atas menghasilkan angka yang benar. Perlu [Node.js](https://nodejs.org) versi 18 atau lebih baru.

```bash
node --test
```
