import { ActionType } from "./action";

/* ========================================================================
   1️⃣ LIST SEMUA LOST & FOUND (STATE: Array)
   ======================================================================== */
/**
 * Reducer: lostFoundsReducer
 * Menyimpan daftar semua data Lost & Found dari API.
 */
export function lostFoundsReducer(state = [], action) {
  switch (action.type) {
    case ActionType.SET_LOST_FOUNDS:
      return action.payload;
    default:
      return state;
  }
}

/* ========================================================================
   2️⃣ DETAIL LOST & FOUND (STATE: Object/null)
   ======================================================================== */
/**
 * Reducer: lostFoundReducer
 * Menyimpan data detail satu item Lost & Found berdasarkan ID.
 */
export function lostFoundReducer(state = null, action) {
  switch (action.type) {
    case ActionType.SET_LOST_FOUND:
      return action.payload;
    default:
      return state;
  }
}

/* ========================================================================
   3️⃣ STATUS STATE UMUM (STATE: Boolean)
   ======================================================================== */
/**
 * Reducer: isLostFoundReducer
 * Menandai apakah detail Lost & Found sedang aktif/telah di-load.
 */
export function isLostFoundReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND:
      return action.payload;
    default:
      return state;
  }
}

/* ========================================================================
   4️⃣ TAMBAH LOST & FOUND (POST)
   ======================================================================== */
/**
 * Reducer: isLostFoundAddReducer
 * Menandai proses membuka form/aksi penambahan data.
 */
export function isLostFoundAddReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_ADD:
      return action.payload;
    default:
      return state;
  }
}

/**
 * Reducer: isLostFoundAddedReducer
 * Menandai apakah data berhasil ditambahkan.
 */
export function isLostFoundAddedReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_ADDED:
      return action.payload;
    default:
      return state;
  }
}

/* ========================================================================
   5️⃣ UBAH LOST & FOUND (PUT)
   ======================================================================== */
/**
 * Reducer: isLostFoundChangeReducer
 * Menandai apakah proses update sedang berlangsung.
 */
export function isLostFoundChangeReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_CHANGE:
      return action.payload;
    default:
      return state;
  }
}

/**
 * Reducer: isLostFoundChangedReducer
 * Menandai apakah data berhasil diubah.
 */
export function isLostFoundChangedReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_CHANGED:
      return action.payload;
    default:
      return state;
  }
}

/* ========================================================================
   6️⃣ UBAH COVER (POST /lost-founds/:id/cover)
   ======================================================================== */
/**
 * Reducer: isLostFoundChangeCoverReducer
 * Menandai apakah proses perubahan cover sedang berlangsung.
 */
export function isLostFoundChangeCoverReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_CHANGE_COVER:
      return action.payload;
    default:
      return state;
  }
}

/**
 * Reducer: isLostFoundChangedCoverReducer
 * Menandai apakah cover berhasil diubah.
 */
export function isLostFoundChangedCoverReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_CHANGED_COVER:
      return action.payload;
    default:
      return state;
  }
}

/* ========================================================================
   7️⃣ HAPUS LOST & FOUND (DELETE)
   ======================================================================== */
/**
 * Reducer: isLostFoundDeleteReducer
 * Menandai apakah proses penghapusan sedang berlangsung.
 */
export function isLostFoundDeleteReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_DELETE:
      return action.payload;
    default:
      return state;
  }
}

/**
 * Reducer: isLostFoundDeletedReducer
 * Menandai apakah data berhasil dihapus.
 */
export function isLostFoundDeletedReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_DELETED:
      return action.payload;
    default:
      return state;
  }
}

/* ========================================================================
   8️⃣ STATISTIK (GET /stats)
   ======================================================================== */
/**
 * Reducer: statsDailyReducer
 * Menyimpan statistik harian Lost & Found.
 */
export function statsDailyReducer(state = {}, action) {
  switch (action.type) {
    case ActionType.SET_STATS_DAILY:
      return action.payload;
    default:
      return state;
  }
}

/**
 * Reducer: statsMonthlyReducer
 * Menyimpan statistik bulanan Lost & Found.
 */
export function statsMonthlyReducer(state = {}, action) {
  switch (action.type) {
    case ActionType.SET_STATS_MONTHLY:
      return action.payload;
    default:
      return state;
  }
}
