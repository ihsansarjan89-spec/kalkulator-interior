const test = require("node:test");
const assert = require("node:assert/strict");
const { hitungKeramik, hitungCat } = require("./kalkulator.js");

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
