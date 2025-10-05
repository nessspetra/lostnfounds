import {
  showErrorDialog,
  showSuccessDialog,
} from "../../../helpers/toolsHelper";
import lostFoundApi from "../api/lostfoundApi";

export const ActionType = {
  SET_LOST_FOUNDS: "SET_LOST_FOUNDS",
  SET_LOST_FOUND: "SET_LOST_FOUND",
  SET_IS_LOST_FOUND: "SET_IS_LOST_FOUND",
  SET_IS_LOST_FOUND_ADD: "SET_IS_LOST_FOUND_ADD",
  SET_IS_LOST_FOUND_ADDED: "SET_IS_LOST_FOUND_ADDED",
  SET_IS_LOST_FOUND_CHANGE: "SET_IS_LOST_FOUND_CHANGE",
  SET_IS_LOST_FOUND_CHANGED: "SET_IS_LOST_FOUND_CHANGED",
  SET_IS_LOST_FOUND_CHANGE_COVER: "SET_IS_LOST_FOUND_CHANGE_COVER",
  SET_IS_LOST_FOUND_CHANGED_COVER: "SET_IS_LOST_FOUND_CHANGED_COVER",
  SET_IS_LOST_FOUND_DELETE: "SET_IS_LOST_FOUND_DELETE",
  SET_IS_LOST_FOUND_DELETED: "SET_IS_LOST_FOUND_DELETED",
  SET_STATS_DAILY: "SET_STATS_DAILY", 
  SET_STATS_MONTHLY: "SET_STATS_MONTHLY", 
};

// ===================================================
// Get All Lost & Founds (URL/lost-founds)
// ===================================================
export function setLostFoundsActionCreator(lostFounds) {
  return {
    type: ActionType.SET_LOST_FOUNDS,
    payload: lostFounds,
  };
}

export function asyncSetLostFounds(params = {}) {
  return async (dispatch) => {
    try {
      const lostFounds = await lostFoundApi.getLostFounds(params);
      dispatch(setLostFoundsActionCreator(lostFounds));
    } catch (error) {
      dispatch(setLostFoundsActionCreator([]));
    }
  };
}

// ===================================================
// Detail Lost & Found (URL/lost-founds/:id)
// ===================================================
export function setLostFoundActionCreator(lostFound) {
  return {
    type: ActionType.SET_LOST_FOUND,
    payload: lostFound,
  };
}

export function setIsLostFoundActionCreator(status) {
  return {
    type: ActionType.SET_IS_LOST_FOUND,
    payload: status,
  };
}

export function asyncSetLostFound(id) {
  return async (dispatch) => {
    try {
      const lostFound = await lostFoundApi.getLostFoundById(id);
      dispatch(setLostFoundActionCreator(lostFound));
    } catch (error) {
      dispatch(setLostFoundActionCreator(null));
    }
    dispatch(setIsLostFoundActionCreator(true));
  };
}

// ===================================================
// Add New Lost & Found (POST /lost-founds)
// ===================================================
export function setIsLostFoundAddActionCreator(isLostFoundAdd) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_ADD,
    payload: isLostFoundAdd,
  };
}

export function setIsLostFoundAddedActionCreator(isLostFoundAdded) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_ADDED,
    payload: isLostFoundAdded,
  };
}

export function asyncSetIsLostFoundAdd(title, description, status) {
  return async (dispatch) => {
    try {
      // Menambahkan parameter 'status'
      await lostFoundApi.postLostFound(title, description, status);
      dispatch(setIsLostFoundAddedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsLostFoundAddedActionCreator(false));
    }
    dispatch(setIsLostFoundAddActionCreator(true));
  };
}

// ===================================================
// Update Lost & Found (PUT /lost-founds/:id)
// ===================================================
export function setIsLostFoundChangeActionCreator(isLostFoundChange) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGE,
    payload: isLostFoundChange,
  };
}

export function setIsLostFoundChangedActionCreator(isLostFoundChanged) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGED,
    payload: isLostFoundChanged,
  };
}

export function asyncUpdateLostFound(id, title, description, status, is_completed) {
  return async (dispatch) => {
    try {
      const message = await lostFoundApi.putLostFound(
        id,
        title,
        description,
        status,
        is_completed ? 1 : 0 // Pastikan mengirim 1 atau 0
      );
      showSuccessDialog(message);
      dispatch(setIsLostFoundChangedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(setIsLostFoundChangeActionCreator(true));
  };
}

// ===================================================
// Change Cover (POST /lost-founds/:id/cover)
// ===================================================
export function setIsLostFoundChangeCoverActionCreator(isLostFoundChangeCover) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGE_COVER,
    payload: isLostFoundChangeCover,
  };
}

export function setIsLostFoundChangedCoverActionCreator(status) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGED_COVER,
    payload: status,
  };
}

export function asyncSetIsLostFoundChangeCover(id, cover) {
  return async (dispatch) => {
    try {
      const message = await lostFoundApi.postLostFoundCover(id, cover);
      showSuccessDialog(message);
      dispatch(setIsLostFoundChangedCoverActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(setIsLostFoundChangeCoverActionCreator(true));
  };
}

// ===================================================
// Delete Lost & Found (DELETE /lost-founds/:id)
// ===================================================
export function setIsLostFoundDeleteActionCreator(isLostFoundDelete) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_DELETE,
    payload: isLostFoundDelete,
  };
}

export function setIsLostFoundDeletedActionCreator(isLostFoundDeleted) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_DELETED,
    payload: isLostFoundDeleted,
  };
}

export function asyncSetIsLostFoundDelete(id) {
  return async (dispatch) => {
    try {
      const message = await lostFoundApi.deleteLostFound(id);
      showSuccessDialog(message);
      dispatch(setIsLostFoundDeletedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(setIsLostFoundDeleteActionCreator(true));
  };
}

// ===================================================
// Get Stats Daily (GET /lost-founds/stats/daily)
// ===================================================
export function setStatsDailyActionCreator(stats) {
  return {
    type: ActionType.SET_STATS_DAILY,
    payload: stats,
  };
}

export function asyncSetStatsDaily(params = {}) {
  return async (dispatch) => {
    try {
      const stats = await lostFoundApi.getStatsDaily(params);
      dispatch(setStatsDailyActionCreator(stats));
    } catch (error) {
      dispatch(setStatsDailyActionCreator({}));
    }
  };
}

// ===================================================
// Get Stats Monthly (GET /lost-founds/stats/monthly)
// ===================================================
export function setStatsMonthlyActionCreator(stats) {
  return {
    type: ActionType.SET_STATS_MONTHLY,
    payload: stats,
  };
}

export function asyncSetStatsMonthly(params = {}) {
  return async (dispatch) => {
    try {
      const stats = await lostFoundApi.getStatsMonthly(params);
      dispatch(setStatsMonthlyActionCreator(stats));
    } catch (error) {
      dispatch(setStatsMonthlyActionCreator({}));
    }
  };
}