# Kalkulator Interior

Kalkulator sederhana untuk memperkirakan kebutuhan material satu ruangan:

- **Keramik lantai**: jumlah keping dan jumlah dus, termasuk cadangan potongan.
- **Cat dinding**: jumlah liter, setelah dikurangi luas pintu dan jendela.

## Cara pakai

Buka berkas `index.html` di browser (klik dua kali). Tidak perlu memasang apa pun.
Isi ukuran ruangan, lalu hasilnya langsung muncul.

## Rumus

| Hitungan | Rumus |
| --- | --- |
| Luas lantai | panjang × lebar |
| Jumlah keping | (luas lantai ÷ luas satu keping) × (1 + cadangan), dibulatkan ke atas |
| Jumlah dus | jumlah keping ÷ isi per dus, dibulatkan ke atas |
| Luas dinding | 2 × (panjang + lebar) × tinggi − luas pintu dan jendela |
| Liter cat | luas dinding × jumlah lapis ÷ daya sebar, dibulatkan ke atas 0,1 liter |

Rumusnya ada di `kalkulator.js`.

Hasil berupa perkiraan. Cocokkan dengan kondisi lapangan dan data teknis produk.
