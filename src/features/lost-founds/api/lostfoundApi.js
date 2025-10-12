import apiHelper from "../../../helpers/apiHelper";

const lostfoundApi = (() => {
  /* ============================================================
     KONFIGURASI DASAR
     ------------------------------------------------------------
     Base URL untuk semua request diambil dari environment variable.
     ============================================================ */
  const DELCOM_BASEURL = import.meta.env.VITE_DELCOM_BASEURL;
  const BASE_URL = `${DELCOM_BASEURL}/lost-founds`;

  /**
   * Membentuk URL lengkap untuk request tertentu.
   * @param {string} path - Path tambahan untuk endpoint.
   * @returns {string} URL lengkap endpoint Lost & Found.
   */
  function _url(path) {
    return BASE_URL + path;
  }

  /* ============================================================
     1. Tambah Data Lost & Found
     ------------------------------------------------------------
     Endpoint: POST /lost-founds
     Deskripsi: Menambahkan data baru ke sistem Lost & Found.
     ============================================================ */
  async function postLostFound(title, description, status) {
    const response = await apiHelper.fetchData(_url(""), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ title, description, status }),
    });

    const { success, message, data } = await response.json();
    if (!success) throw new Error(message);

    return data;
  }

  /* ============================================================
     2. Ubah Gambar (Cover) Lost & Found
     ------------------------------------------------------------
     Endpoint: POST /lost-founds/:id/cover
     Deskripsi: Mengunggah/ubah file cover milik data tertentu.
     ============================================================ */
  async function postLostFoundCover(id, cover) {
    const formData = new FormData();
    formData.append("cover", cover, cover.name);

    const response = await apiHelper.fetchData(_url(`/${id}/cover`), {
      method: "POST",
      body: formData,
    });

    const { success, message } = await response.json();
    if (!success) throw new Error(message);

    return message;
  }

  /* ============================================================
     3. Perbarui Data Lost & Found
     ------------------------------------------------------------
     Endpoint: PUT /lost-founds/:id
     Deskripsi: Mengedit data berdasarkan ID tertentu.
     ============================================================ */
  async function putLostFound(id, title, description, status, is_completed) {
    const response = await apiHelper.fetchData(_url(`/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        title,
        description,
        status,
        is_completed,
      }),
    });

    const { success, message } = await response.json();
    if (!success) throw new Error(message);

    return message;
  }

  /* ============================================================
     4. Ambil Semua Data Lost & Found
     ------------------------------------------------------------
     Endpoint: GET /lost-founds
     Deskripsi: Mengambil daftar seluruh data Lost & Found.
     ============================================================ */
  async function getLostFounds(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const targetUrl = queryString ? `?${queryString}` : "";

    const response = await apiHelper.fetchData(_url(targetUrl), {
      method: "GET",
    });

    const { success, message, data } = await response.json();
    if (!success) throw new Error(message);

    return data.lost_founds || [];
  }

  /* ============================================================
     5. Ambil Detail Lost & Found Berdasarkan ID
     ------------------------------------------------------------
     Endpoint: GET /lost-founds/:id
     Deskripsi: Mengambil data detail satu item berdasarkan ID.
     ============================================================ */
  async function getLostFoundById(id) {
    const response = await apiHelper.fetchData(_url(`/${id}`), {
      method: "GET",
    });

    const { success, message, data } = await response.json();
    if (!success) throw new Error(message);

    return data.lost_found;
  }

  /* ============================================================
     6. Hapus Data Lost & Found
     ------------------------------------------------------------
     Endpoint: DELETE /lost-founds/:id
     Deskripsi: Menghapus data berdasarkan ID tertentu.
     ============================================================ */
  async function deleteLostFound(id) {
    const response = await apiHelper.fetchData(_url(`/${id}`), {
      method: "DELETE",
    });

    const { success, message } = await response.json();
    if (!success) throw new Error(message);

    return message;
  }

  /* ============================================================
     7. Statistik Harian Lost & Found
     ------------------------------------------------------------
     Endpoint: GET /lost-founds/stats/daily
     Deskripsi: Mengambil data statistik laporan harian.
     ============================================================ */
  async function getStatsDaily(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiHelper.fetchData(
      _url(`/stats/daily${queryString ? `?${queryString}` : ""}`),
      { method: "GET" }
    );

    const { success, message, data } = await response.json();
    if (!success) throw new Error(message);

    return data;
  }

  /* ============================================================
     8. Statistik Bulanan Lost & Found
     ------------------------------------------------------------
     Endpoint: GET /lost-founds/stats/monthly
     Deskripsi: Mengambil data statistik laporan bulanan.
     ============================================================ */
  async function getStatsMonthly(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiHelper.fetchData(
      _url(`/stats/monthly${queryString ? `?${queryString}` : ""}`),
      { method: "GET" }
    );

    const { success, message, data } = await response.json();
    if (!success) throw new Error(message);

    return data;
  }

  /* ============================================================
     EKSPOR MODUL
     ------------------------------------------------------------
     Mengembalikan objek berisi seluruh fungsi API agar bisa
     diimpor dan digunakan di komponen lain.
     ============================================================ */
  return {
    postLostFound,
    postLostFoundCover,
    putLostFound,
    getLostFounds,
    getLostFoundById,
    deleteLostFound,
    getStatsDaily,
    getStatsMonthly,
  };
})();

export default lostfoundApi;
