import { ActionType } from "./action";

/* ============================================================
   REDUCER: isAuthLoginReducer
   ------------------------------------------------------------
   Mengelola status autentikasi login pengguna.
   - State awal: false (belum login)
   - Action yang ditangani: SET_IS_AUTH_LOGIN
   ============================================================ */

/**
 * Reducer untuk status login pengguna.
 *
 * @param {boolean} state - Nilai state saat ini (default: false).
 * @param {object} action - Objek action yang dikirimkan Redux.
 * @param {string} action.type - Jenis action yang dikirim.
 * @param {boolean} action.payload - Nilai status login baru.
 * @returns {boolean} State login terbaru.
 */
export const isAuthLoginReducer = (state = false, action) => {
  switch (action.type) {
    case ActionType.SET_IS_AUTH_LOGIN:
      // Perbarui status login berdasarkan payload action
      return action.payload;

    default:
      // Jika action tidak dikenali, kembalikan state lama
      return state;
  }
};

/* ============================================================
   REDUCER: isAuthRegisterReducer
   ------------------------------------------------------------
   Mengelola status proses registrasi pengguna.
   - State awal: false (belum register)
   - Action yang ditangani: SET_IS_AUTH_REGISTER
   ============================================================ */

/**
 * Reducer untuk status registrasi pengguna.
 *
 * @param {boolean} state - Nilai state saat ini (default: false).
 * @param {object} action - Objek action yang dikirimkan Redux.
 * @param {string} action.type - Jenis action yang dikirim.
 * @param {boolean} action.payload - Nilai status register baru.
 * @returns {boolean} State register terbaru.
 */
export const isAuthRegisterReducer = (state = false, action) => {
  switch (action.type) {
    case ActionType.SET_IS_AUTH_REGISTER:
      // Perbarui status register berdasarkan payload action
      return action.payload;

    default:
      // Jika action tidak dikenali, kembalikan state lama
      return state;
  }
};
