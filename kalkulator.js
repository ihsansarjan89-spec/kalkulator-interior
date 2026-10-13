// Rumus perkiraan untuk pekerjaan interior, sipil, dan arsitektur:
// keramik, cat, beton, dinding bata, besi tulangan, tangga, serta KDB/KLB.

// Volume bahan lepas (semen, pasir, kerikil) untuk 1 m3 beton padat.
const FAKTOR_VOLUME_KERING = 1.54;
const BERAT_ISI_SEMEN = 1440; // kg/m3
const BERAT_JENIS_BAJA = 7850; // kg/m3

// Rentang nyaman rumus langkah 2 x tanjakan + injakan, dalam cm.
const LANGKAH_MIN_CM = 60;
const LANGKAH_MAKS_CM = 65;

function pastikanPositif(nilai, nama) {
  if (!Number.isFinite(nilai) || nilai <= 0) {
    throw new RangeError(`${nama} harus lebih besar dari 0`);
  }
}

function pastikanTidakNegatif(nilai, nama) {
  if (!Number.isFinite(nilai) || nilai < 0) {
    throw new RangeError(`${nama} tidak boleh negatif`);
  }
}

// Membulatkan ke atas tanpa terpengaruh galat pecahan biner,
// misalnya 36.00000000000001 tetap menjadi 36, bukan 37.
function bulatkanKeAtas(nilai, desimal = 0) {
  const faktor = 10 ** desimal;
  return Math.ceil(Number((nilai * faktor).toFixed(6))) / faktor;
}

function bulatkanKeBawah(nilai) {
  return Math.floor(Number(nilai.toFixed(6)));
}

function bulatkan(nilai, desimal = 0) {
  const faktor = 10 ** desimal;
  return Math.round(Number((nilai * faktor).toFixed(6))) / faktor;
}

function hitungKeramik({
  panjangRuang,
  lebarRuang,
  panjangKeramikCm,
  lebarKeramikCm,
  isiPerDus,
  cadanganPersen = 10,
}) {
  pastikanPositif(panjangRuang, "Panjang ruangan");
  pastikanPositif(lebarRuang, "Lebar ruangan");
  pastikanPositif(panjangKeramikCm, "Panjang keramik");
  pastikanPositif(lebarKeramikCm, "Lebar keramik");
  pastikanPositif(isiPerDus, "Isi per dus");
  pastikanTidakNegatif(cadanganPersen, "Cadangan");

  const luasLantai = panjangRuang * lebarRuang;
  const luasKeping = (panjangKeramikCm / 100) * (lebarKeramikCm / 100);
  const jumlahKeping = bulatkanKeAtas(
    (luasLantai / luasKeping) * (1 + cadanganPersen / 100)
  );
  const jumlahDus = Math.ceil(jumlahKeping / isiPerDus);

  return { luasLantai, jumlahKeping, jumlahDus };
}

function hitungCat({
  panjangRuang,
  lebarRuang,
  tinggiDinding,
  luasBukaan = 0,
  jumlahLapis = 2,
  dayaSebar = 10,
}) {
  pastikanPositif(panjangRuang, "Panjang ruangan");
  pastikanPositif(lebarRuang, "Lebar ruangan");
  pastikanPositif(tinggiDinding, "Tinggi dinding");
  pastikanTidakNegatif(luasBukaan, "Luas bukaan");
  pastikanPositif(jumlahLapis, "Jumlah lapis");
  pastikanPositif(dayaSebar, "Daya sebar");

  const luasDinding =
    2 * (panjangRuang + lebarRuang) * tinggiDinding - luasBukaan;
  if (luasDinding <= 0) {
    throw new RangeError("Luas bukaan tidak boleh melebihi luas dinding");
  }
  const liter = bulatkanKeAtas((luasDinding * jumlahLapis) / dayaSebar, 1);

  return { luasDinding, liter };
}

// Elemen beton berbentuk balok (pelat, balok, kolom, pondasi tapak).
// Kebutuhan bahan dihitung dari perbandingan volume, bukan dari mix design.
function hitungBeton({
  panjang,
  lebar,
  tebal,
  jumlah = 1,
  campuran = { semen: 1, pasir: 2, kerikil: 3 },
  beratSak = 50,
  cadanganPersen = 5,
}) {
  pastikanPositif(panjang, "Panjang");
  pastikanPositif(lebar, "Lebar");
  pastikanPositif(tebal, "Tebal");
  pastikanPositif(jumlah, "Jumlah elemen");
  pastikanPositif(campuran.semen, "Bagian semen");
  pastikanPositif(campuran.pasir, "Bagian pasir");
  pastikanPositif(campuran.kerikil, "Bagian kerikil");
  pastikanPositif(beratSak, "Berat sak");
  pastikanTidakNegatif(cadanganPersen, "Cadangan");

  const volume = panjang * lebar * tebal * jumlah;
  const volumeKering =
    volume * (1 + cadanganPersen / 100) * FAKTOR_VOLUME_KERING;
  const totalBagian = campuran.semen + campuran.pasir + campuran.kerikil;
  const semenKg =
    ((volumeKering * campuran.semen) / totalBagian) * BERAT_ISI_SEMEN;

  return {
    volume: bulatkan(volume, 3),
    semenSak: bulatkanKeAtas(semenKg / beratSak),
    pasirM3: bulatkanKeAtas((volumeKering * campuran.pasir) / totalBagian, 2),
    kerikilM3: bulatkanKeAtas(
      (volumeKering * campuran.kerikil) / totalBagian,
      2
    ),
  };
}

// Ukuran bata adalah sisi yang terlihat di muka dinding (panjang x tinggi).
function hitungBata({
  panjangDinding,
  tinggiDinding,
  luasBukaan = 0,
  panjangBataCm,
  tinggiBataCm,
  tebalSiarCm = 1.5,
  cadanganPersen = 5,
}) {
  pastikanPositif(panjangDinding, "Panjang dinding");
  pastikanPositif(tinggiDinding, "Tinggi dinding");
  pastikanTidakNegatif(luasBukaan, "Luas bukaan");
  pastikanPositif(panjangBataCm, "Panjang bata");
  pastikanPositif(tinggiBataCm, "Tinggi bata");
  pastikanTidakNegatif(tebalSiarCm, "Tebal siar");
  pastikanTidakNegatif(cadanganPersen, "Cadangan");

  const luasDinding = panjangDinding * tinggiDinding - luasBukaan;
  if (luasDinding <= 0) {
    throw new RangeError("Luas bukaan tidak boleh melebihi luas dinding");
  }
  const bataPerM2 =
    1 /
    (((panjangBataCm + tebalSiarCm) / 100) *
      ((tinggiBataCm + tebalSiarCm) / 100));
  const jumlahBata = bulatkanKeAtas(
    luasDinding * bataPerM2 * (1 + cadanganPersen / 100)
  );

  return {
    luasDinding: bulatkan(luasDinding, 2),
    bataPerM2: bulatkan(bataPerM2, 1),
    jumlahBata,
  };
}

// Jumlah batang dihitung dari berapa potong utuh yang muat dalam satu batang,
// karena sisa potongan tidak bisa disambung begitu saja.
function hitungBesi({
  diameterMm,
  panjangPotong,
  jumlahPotong,
  panjangBatang = 12,
}) {
  pastikanPositif(diameterMm, "Diameter");
  pastikanPositif(panjangPotong, "Panjang per potong");
  pastikanPositif(jumlahPotong, "Jumlah potong");
  pastikanPositif(panjangBatang, "Panjang batang");
  if (panjangPotong > panjangBatang) {
    throw new RangeError(
      "Panjang per potong melebihi panjang batang; bagi menjadi beberapa potong dan tambahkan panjang sambungan"
    );
  }

  const beratPerMeter =
    (Math.PI / 4) * (diameterMm / 1000) ** 2 * BERAT_JENIS_BAJA;
  const totalPanjang = panjangPotong * jumlahPotong;
  const potongPerBatang = bulatkanKeBawah(panjangBatang / panjangPotong);

  return {
    beratPerMeter: bulatkan(beratPerMeter, 3),
    totalPanjang: bulatkan(totalPanjang, 2),
    beratTotal: bulatkan(beratPerMeter * totalPanjang, 2),
    jumlahBatang: Math.ceil(jumlahPotong / potongPerBatang),
  };
}

// Tanjakan = optrede, injakan = antrede. Tangga lurus tanpa bordes.
function hitungTangga({
  tinggiLantaiCm,
  tanjakanMaksCm = 18,
  lebarInjakanCm = 28,
}) {
  pastikanPositif(tinggiLantaiCm, "Tinggi antarlantai");
  pastikanPositif(tanjakanMaksCm, "Tanjakan maksimum");
  pastikanPositif(lebarInjakanCm, "Lebar injakan");

  const jumlahTanjakan = bulatkanKeAtas(tinggiLantaiCm / tanjakanMaksCm);
  const tinggiTanjakan = tinggiLantaiCm / jumlahTanjakan;
  const jumlahInjakan = jumlahTanjakan - 1;
  const nilaiLangkah = bulatkan(2 * tinggiTanjakan + lebarInjakanCm, 1);
  const sudut = (Math.atan(tinggiTanjakan / lebarInjakanCm) * 180) / Math.PI;

  return {
    jumlahTanjakan,
    tinggiTanjakanCm: bulatkan(tinggiTanjakan, 2),
    jumlahInjakan,
    panjangDatarM: bulatkan((jumlahInjakan * lebarInjakanCm) / 100, 2),
    nilaiLangkahCm: nilaiLangkah,
    nyaman: nilaiLangkah >= LANGKAH_MIN_CM && nilaiLangkah <= LANGKAH_MAKS_CM,
    sudutDerajat: bulatkan(sudut, 1),
  };
}

// KDB = luas lantai dasar / luas lahan, KLB = luas seluruh lantai / luas lahan.
// Batas KDB dan KLB berbeda tiap zona; isi sesuai peraturan setempat.
function hitungKdbKlb({
  luasLahan,
  luasLantaiDasar,
  luasTotalLantai,
  kdbMaksPersen,
  klbMaks,
}) {
  pastikanPositif(luasLahan, "Luas lahan");
  pastikanPositif(luasLantaiDasar, "Luas lantai dasar");
  pastikanPositif(luasTotalLantai, "Luas seluruh lantai");
  pastikanPositif(kdbMaksPersen, "Batas KDB");
  pastikanPositif(klbMaks, "Batas KLB");
  if (luasLantaiDasar > luasLahan) {
    throw new RangeError("Luas lantai dasar tidak boleh melebihi luas lahan");
  }
  if (luasTotalLantai < luasLantaiDasar) {
    throw new RangeError(
      "Luas seluruh lantai tidak boleh lebih kecil dari luas lantai dasar"
    );
  }

  const kdbPersen = bulatkan((luasLantaiDasar / luasLahan) * 100, 1);
  const klb = bulatkan(luasTotalLantai / luasLahan, 2);

  return {
    kdbPersen,
    klb,
    memenuhiKdb: kdbPersen <= kdbMaksPersen,
    memenuhiKlb: klb <= klbMaks,
  };
}

if (typeof module !== "undefined") {
  module.exports = {
    hitungKeramik,
    hitungCat,
    hitungBeton,
    hitungBata,
    hitungBesi,
    hitungTangga,
    hitungKdbKlb,
  };
}
