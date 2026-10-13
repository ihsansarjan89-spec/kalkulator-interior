const test = require("node:test");
const assert = require("node:assert/strict");
const {
  hitungKeramik,
  hitungCat,
  hitungBeton,
  hitungBata,
  hitungBesi,
  hitungTangga,
  hitungKdbKlb,
} = require("./kalkulator.js");

const keramik60 = { panjangKeramikCm: 60, lebarKeramikCm: 60, isiPerDus: 4 };

test("keramik: ruangan 4 x 3 m dengan keramik 60 x 60 dan cadangan 10%", () => {
  const hasil = hitungKeramik({
    panjangRuang: 4,
    lebarRuang: 3,
    ...keramik60,
    cadanganPersen: 10,
  });
  assert.deepEqual(hasil, { luasLantai: 12, jumlahKeping: 37, jumlahDus: 10 });
});

test("keramik: cadangan bawaan 10% bila tidak diisi", () => {
  const hasil = hitungKeramik({ panjangRuang: 4, lebarRuang: 3, ...keramik60 });
  assert.equal(hasil.jumlahKeping, 37);
});

test("keramik: ukuran yang pas tidak menambah satu keping", () => {
  const hasil = hitungKeramik({
    panjangRuang: 3.6,
    lebarRuang: 3.6,
    ...keramik60,
    cadanganPersen: 0,
  });
  assert.equal(hasil.jumlahKeping, 36);
  assert.equal(hasil.jumlahDus, 9);
});

test("keramik: mendukung keramik persegi panjang", () => {
  const hasil = hitungKeramik({
    panjangRuang: 3,
    lebarRuang: 3,
    panjangKeramikCm: 30,
    lebarKeramikCm: 60,
    isiPerDus: 8,
    cadanganPersen: 0,
  });
  assert.equal(hasil.jumlahKeping, 50);
  assert.equal(hasil.jumlahDus, 7);
});

test("cat: dinding 4 x 3 x 3 m dikurangi bukaan 3,5 m2", () => {
  const hasil = hitungCat({
    panjangRuang: 4,
    lebarRuang: 3,
    tinggiDinding: 3,
    luasBukaan: 3.5,
    jumlahLapis: 2,
    dayaSebar: 10,
  });
  assert.deepEqual(hasil, { luasDinding: 38.5, liter: 7.7 });
});

test("cat: nilai bawaan tanpa bukaan, 2 lapis, daya sebar 10", () => {
  const hasil = hitungCat({ panjangRuang: 4, lebarRuang: 3, tinggiDinding: 3 });
  assert.deepEqual(hasil, { luasDinding: 42, liter: 8.4 });
});

test("cat: liter dibulatkan ke atas per 0,1 liter", () => {
  const hasil = hitungCat({
    panjangRuang: 4,
    lebarRuang: 3,
    tinggiDinding: 3,
    jumlahLapis: 1,
    dayaSebar: 11,
  });
  assert.equal(hasil.liter, 3.9);
});

test("menolak ukuran nol, negatif, atau bukan angka", () => {
  assert.throws(
    () => hitungKeramik({ panjangRuang: 0, lebarRuang: 3, ...keramik60 }),
    RangeError
  );
  assert.throws(
    () => hitungKeramik({ panjangRuang: 4, lebarRuang: 3, ...keramik60, cadanganPersen: -5 }),
    RangeError
  );
  assert.throws(
    () => hitungCat({ panjangRuang: 4, lebarRuang: NaN, tinggiDinding: 3 }),
    RangeError
  );
});

test("cat: menolak bukaan yang melebihi luas dinding", () => {
  assert.throws(
    () => hitungCat({ panjangRuang: 4, lebarRuang: 3, tinggiDinding: 3, luasBukaan: 50 }),
    /melebihi luas dinding/
  );
});

test("beton: 1 m3 campuran 1:2:3 tanpa cadangan", () => {
  const hasil = hitungBeton({ panjang: 1, lebar: 1, tebal: 1, cadanganPersen: 0 });
  assert.deepEqual(hasil, { volume: 1, semenSak: 8, pasirM3: 0.52, kerikilM3: 0.77 });
});

test("beton: pelat 4 x 3 m tebal 12 cm dengan cadangan bawaan 5%", () => {
  const hasil = hitungBeton({ panjang: 4, lebar: 3, tebal: 0.12 });
  assert.deepEqual(hasil, { volume: 1.44, semenSak: 12, pasirM3: 0.78, kerikilM3: 1.17 });
});

test("beton: jumlah elemen mengalikan volume", () => {
  const hasil = hitungBeton({ panjang: 0.3, lebar: 0.3, tebal: 3.5, jumlah: 4 });
  assert.equal(hasil.volume, 1.26);
});

test("beton: campuran dan berat sak bisa diganti", () => {
  const hasil = hitungBeton({
    panjang: 1,
    lebar: 1,
    tebal: 1,
    campuran: { semen: 1, pasir: 3, kerikil: 5 },
    beratSak: 40,
    cadanganPersen: 0,
  });
  assert.deepEqual(hasil, { volume: 1, semenSak: 7, pasirM3: 0.52, kerikilM3: 0.86 });
});

test("bata: bata ringan 60 x 20 cm tanpa siar dan tanpa cadangan", () => {
  const hasil = hitungBata({
    panjangDinding: 3,
    tinggiDinding: 2,
    panjangBataCm: 60,
    tinggiBataCm: 20,
    tebalSiarCm: 0,
    cadanganPersen: 0,
  });
  assert.deepEqual(hasil, { luasDinding: 6, bataPerM2: 8.3, jumlahBata: 50 });
});

test("bata: bata merah 20 x 5 cm dengan siar dan cadangan bawaan", () => {
  const hasil = hitungBata({
    panjangDinding: 4,
    tinggiDinding: 3,
    panjangBataCm: 20,
    tinggiBataCm: 5,
  });
  assert.deepEqual(hasil, { luasDinding: 12, bataPerM2: 71.6, jumlahBata: 902 });
});

test("bata: luas bukaan mengurangi luas dinding", () => {
  const hasil = hitungBata({
    panjangDinding: 3,
    tinggiDinding: 2,
    luasBukaan: 1.2,
    panjangBataCm: 60,
    tinggiBataCm: 20,
    tebalSiarCm: 0,
    cadanganPersen: 0,
  });
  assert.deepEqual(hasil, { luasDinding: 4.8, bataPerM2: 8.3, jumlahBata: 40 });
});

test("bata: menolak bukaan yang melebihi luas dinding", () => {
  assert.throws(
    () =>
      hitungBata({
        panjangDinding: 3,
        tinggiDinding: 2,
        luasBukaan: 6,
        panjangBataCm: 60,
        tinggiBataCm: 20,
      }),
    /melebihi luas dinding/
  );
});

test("besi: berat per meter sesuai tabel untuk D10 dan D13", () => {
  const d10 = hitungBesi({ diameterMm: 10, panjangPotong: 3, jumlahPotong: 20 });
  assert.deepEqual(d10, {
    beratPerMeter: 0.617,
    totalPanjang: 60,
    beratTotal: 36.99,
    jumlahBatang: 5,
  });
  const d13 = hitungBesi({ diameterMm: 13, panjangPotong: 3, jumlahPotong: 1 });
  assert.equal(d13.beratPerMeter, 1.042);
});

test("besi: jumlah batang mengikuti potong utuh per batang", () => {
  // Potongan 7 m: satu batang 12 m hanya muat satu potong, sisanya tidak terpakai.
  const hasil = hitungBesi({ diameterMm: 10, panjangPotong: 7, jumlahPotong: 3 });
  assert.equal(hasil.jumlahBatang, 3);
});

test("besi: potongan yang pas membagi batang tidak dibulatkan turun", () => {
  const hasil = hitungBesi({ diameterMm: 10, panjangPotong: 1.2, jumlahPotong: 25 });
  assert.equal(hasil.jumlahBatang, 3);
});

test("besi: menolak potongan yang lebih panjang dari batang", () => {
  assert.throws(
    () => hitungBesi({ diameterMm: 10, panjangPotong: 13, jumlahPotong: 2 }),
    /melebihi panjang batang/
  );
});

test("tangga: tinggi 306 cm terbagi pas menjadi 17 tanjakan 18 cm", () => {
  const hasil = hitungTangga({ tinggiLantaiCm: 306, tanjakanMaksCm: 18, lebarInjakanCm: 28 });
  assert.deepEqual(hasil, {
    jumlahTanjakan: 17,
    tinggiTanjakanCm: 18,
    jumlahInjakan: 16,
    panjangDatarM: 4.48,
    nilaiLangkahCm: 64,
    nyaman: true,
    sudutDerajat: 32.7,
  });
});

test("tangga: tanjakan dibagi rata bila tinggi tidak terbagi pas", () => {
  const hasil = hitungTangga({ tinggiLantaiCm: 320 });
  assert.deepEqual(hasil, {
    jumlahTanjakan: 18,
    tinggiTanjakanCm: 17.78,
    jumlahInjakan: 17,
    panjangDatarM: 4.76,
    nilaiLangkahCm: 63.6,
    nyaman: true,
    sudutDerajat: 32.4,
  });
});

test("tangga: menandai rumus langkah di luar 60-65 cm", () => {
  const hasil = hitungTangga({ tinggiLantaiCm: 300, tanjakanMaksCm: 20, lebarInjakanCm: 30 });
  assert.equal(hasil.nilaiLangkahCm, 70);
  assert.equal(hasil.nyaman, false);
});

test("KDB dan KLB: lahan 200 m2 yang memenuhi batas", () => {
  const hasil = hitungKdbKlb({
    luasLahan: 200,
    luasLantaiDasar: 110,
    luasTotalLantai: 200,
    kdbMaksPersen: 60,
    klbMaks: 1.2,
  });
  assert.deepEqual(hasil, { kdbPersen: 55, klb: 1, memenuhiKdb: true, memenuhiKlb: true });
});

test("KDB dan KLB: tepat di batas masih memenuhi, di atasnya tidak", () => {
  const batas = { luasLahan: 200, kdbMaksPersen: 60, klbMaks: 1.2 };
  const pas = hitungKdbKlb({ ...batas, luasLantaiDasar: 120, luasTotalLantai: 240 });
  assert.equal(pas.memenuhiKdb, true);
  assert.equal(pas.memenuhiKlb, true);
  const lebih = hitungKdbKlb({ ...batas, luasLantaiDasar: 130, luasTotalLantai: 260 });
  assert.deepEqual(lebih, { kdbPersen: 65, klb: 1.3, memenuhiKdb: false, memenuhiKlb: false });
});

test("KDB dan KLB: menolak luas yang tidak masuk akal", () => {
  const batas = { luasLahan: 200, kdbMaksPersen: 60, klbMaks: 1.2 };
  assert.throws(
    () => hitungKdbKlb({ ...batas, luasLantaiDasar: 250, luasTotalLantai: 250 }),
    /melebihi luas lahan/
  );
  assert.throws(
    () => hitungKdbKlb({ ...batas, luasLantaiDasar: 100, luasTotalLantai: 80 }),
    /lebih kecil dari luas lantai dasar/
  );
});
