import apiHelper from "../../../helpers/apiHelper"; // Utility untuk request API

const authApi = (() => {
  // ============================================================
  // Konfigurasi dasar URL API
  // ============================================================

  /** 
   * Base URL utama aplikasi (berasal dari environment variable)
   * Contoh: "https://api.delcom.app"
   */
  const VITE_BASE_URL = import.meta.env.VITE_DELCOM_BASEURL;

  /** 
   * URL khusus untuk endpoint autentikasi
   * Contoh: "https://api.delcom.app/auth"
   */
  const BASE_URL = `${VITE_BASE_URL}/auth`;

  /**
   * Membentuk URL lengkap dengan path tambahan.
   * @param {string} path - path endpoint (misal: "/login" atau "/register")
   * @returns {string} URL lengkap endpoint.
   */
  function _url(path) {
    return BASE_URL + path;
  }

  // ============================================================
  // Fungsi: postRegister
  // ============================================================
  /**
   * Mengirim permintaan registrasi pengguna baru ke server.
   * 
   * @async
   * @function postRegister
   * @param {string} name - Nama lengkap pengguna.
   * @param {string} email - Alamat email pengguna.
   * @param {string} password - Kata sandi pengguna.
   * @throws {Error} Jika `success` bernilai false.
   * @returns {Promise<string>} Pesan dari server jika registrasi berhasil.
   * 
   * Contoh penggunaan:
   * ```js
   * await authApi.postRegister("John Doe", "john@example.com", "123456");
   * ```
   */
  async function postRegister(name, email, password) {
    const response = await apiHelper.fetchData(_url("/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const { success, message } = await response.json();

    if (!success) {
      throw new Error(message);
    }

    return message;
  }

  // ============================================================
  // Fungsi: postLogin
  // ============================================================
  /**
   * Melakukan autentikasi pengguna dengan email dan password.
   * 
   * @async
   * @function postLogin
   * @param {string} email - Alamat email pengguna.
   * @param {string} password - Kata sandi pengguna.
   * @throws {Error} Jika `success` bernilai false.
   * @returns {Promise<Object>} Data pengguna yang dikembalikan server.
   * 
   * Contoh penggunaan:
   * ```js
   * const userData = await authApi.postLogin("john@example.com", "123456");
   * ```
   */
  async function postLogin(email, password) {
    const response = await apiHelper.fetchData(_url("/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const { success, message, data } = await response.json();

    if (!success) {
      throw new Error(message);
    }

    return data;
  }

  // ============================================================
  // Ekspor fungsi publik
  // ============================================================
  return {
    postRegister,
    postLogin,
  };
})();

export default authApi;
