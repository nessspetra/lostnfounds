import apiHelper from "../../../helpers/apiHelper";

const lostfoundApi = (() => {

  const DELCOM_BASEURL = import.meta.env.VITE_DELCOM_BASEURL;
  const BASE_URL = `${DELCOM_BASEURL}/lost-founds`;

  function _url(path) {
    return BASE_URL + path;
  }

  // 1. Add New Lost & Found (POST /lost-founds)
  async function postLostFound(title, description, status) {
    const response = await apiHelper.fetchData(_url(""), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", 
      },
      body: new URLSearchParams({ 
        title,
        description,
        status,
      }),
    });

    const { success, message, data } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return data;
  }

  // 2. Change Cover Lost & Found (POST /lost-founds/:id/cover)
  async function postLostFoundCover(id, cover) { 
    const formData = new FormData();
    formData.append("cover", cover, cover.name);

    const response = await apiHelper.fetchData(_url(`/${id}/cover`), {
      method: "POST",
      body: formData,
    });

    const { success, message } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return message;
  }

  // 3. Update Lost & Found (PUT /lost-founds/:id)
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
    if (!success) {
      throw new Error(message);
    }

    return message;
  }

  // 4. Get All Lost & Founds (GET /lost-founds)
  async function getLostFounds(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const targetUrl = queryString ? `?${queryString}` : "";

    const response = await apiHelper.fetchData(_url(targetUrl), {
      method: "GET",
    });

    const { success, message, data } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return data.lost_founds || [];
  }

  // 5. Detail Lost & Found (GET /lost-founds/:id)
  async function getLostFoundById(id) {
    const response = await apiHelper.fetchData(_url(`/${id}`), {
      method: "GET",
    });

    const { success, message, data } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return data.lost_found;
  }

  // 6. Delete Lost & Found (DELETE /lost-founds/:id)
  async function deleteLostFound(id) {
    const response = await apiHelper.fetchData(_url(`/${id}`), {
      method: "DELETE",
    });

    const { success, message } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return message;
  }
  
  // 7. Get Stats Daily (GET /lost-founds/stats/daily) - BARU
  async function getStatsDaily(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiHelper.fetchData(
      _url(`/stats/daily${queryString ? `?${queryString}` : ""}`),
      {
        method: "GET",
      }
    );

    const { success, message, data } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return data;
  }

  // 8. Get Stats Monthly (GET /lost-founds/stats/monthly) - BARU
  async function getStatsMonthly(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiHelper.fetchData(
      _url(`/stats/monthly${queryString ? `?${queryString}` : ""}`),
      {
        method: "GET",
      }
    );

    const { success, message, data } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return data;
  }

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