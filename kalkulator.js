// Rumus perkiraan kebutuhan keramik lantai dan cat dinding
// untuk satu ruangan berbentuk persegi panjang.

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

if (typeof module !== "undefined") {
  module.exports = { hitungKeramik, hitungCat };
}
