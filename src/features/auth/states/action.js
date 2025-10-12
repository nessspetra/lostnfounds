import apiHelper from "../../../helpers/apiHelper";
import {
  showErrorDialog,
  showSuccessDialog,
} from "../../../helpers/toolsHelper";
import authApi from "../api/authApi";

/* ============================================================
   ACTION TYPES
   ------------------------------------------------------------
   Menyimpan daftar konstanta yang digunakan untuk menentukan
   jenis perubahan state di Redux Store.
   ============================================================ */
export const ActionType = {
  SET_IS_AUTH_LOGIN: "SET_IS_AUTH_LOGIN",
  SET_IS_AUTH_REGISTER: "SET_IS_AUTH_REGISTER",
};

/* ============================================================
   ACTION CREATORS (SYNC)
   ------------------------------------------------------------
   Fungsi yang mengembalikan objek action secara sinkron.
   ============================================================ */

/**
 * Action creator untuk mengubah status login.
 * @param {boolean} isAuthLogin - Status autentikasi login.
 * @returns {object} Action object.
 */
export function setIsAuthLoginActionCreator(isAuthLogin) {
  return {
    type: ActionType.SET_IS_AUTH_LOGIN,
    payload: isAuthLogin,
  };
}

/**
 * Action creator untuk mengubah status register.
 * @param {boolean} isAuthRegister - Status autentikasi registrasi.
 * @returns {object} Action object.
 */
export function setIsAuthRegisterActionCreator(isAuthRegister) {
  return {
    type: ActionType.SET_IS_AUTH_REGISTER,
    payload: isAuthRegister,
  };
}

/* ============================================================
   ASYNC ACTION CREATORS (THUNK)
   ------------------------------------------------------------
   Fungsi yang menjalankan operasi asynchronous seperti pemanggilan API.
   ============================================================ */

/**
 * Proses login pengguna secara asynchronous.
 * --------------------------------------------
 * - Mengirim permintaan login ke server menggunakan `authApi.postLogin()`.
 * - Jika berhasil, menyimpan token ke localStorage melalui `apiHelper.putAccessToken()`.
 * - Jika gagal, menampilkan dialog error.
 * - Setelah proses (berhasil/gagal), tetap memperbarui state `isAuthLogin`.
 *
 * @param {string} username - Username atau email pengguna.
 * @param {string} password - Password pengguna.
 * @returns {Function} Redux thunk function.
 */
export function asyncSetIsAuthLogin(username, password) {
  return async (dispatch) => {
    try {
      // Panggil API untuk login
      const data = await authApi.postLogin(username, password);

      // Simpan access token agar sesi pengguna tetap terjaga
      apiHelper.putAccessToken(data.token);
    } catch (error) {
      // Tampilkan pesan error jika login gagal
      showErrorDialog(error.message);
    }

    // Update status autentikasi ke Redux Store
    dispatch(setIsAuthLoginActionCreator(true));
  };
}

/**
 * Proses registrasi pengguna secara asynchronous.
 * -----------------------------------------------
 * - Mengirim data registrasi ke server melalui `authApi.postRegister()`.
 * - Jika berhasil, menampilkan dialog sukses.
 * - Jika gagal, menampilkan dialog error.
 * - Setelah selesai, memperbarui state `isAuthRegister`.
 *
 * @param {string} name - Nama lengkap pengguna.
 * @param {string} username - Alamat email pengguna.
 * @param {string} password - Password pengguna.
 * @returns {Function} Redux thunk function.
 */
export function asyncSetIsAuthRegister(name, username, password) {
  return async (dispatch) => {
    try {
      // Panggil API untuk registrasi
      const message = await authApi.postRegister(name, username, password);

      // Tampilkan dialog sukses jika registrasi berhasil
      showSuccessDialog(message);
    } catch (error) {
      // Tampilkan pesan error jika gagal
      showErrorDialog(error.message);
    }

    // Update status registrasi ke Redux Store
    dispatch(setIsAuthRegisterActionCreator(true));
  };
}
