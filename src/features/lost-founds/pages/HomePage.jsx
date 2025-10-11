import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AddModal from "../modals/AddModal";
import ChangeModal from "../modals/ChangeModal";
import {
  asyncSetIsLostFoundDelete,
  asyncSetLostFounds,
  setIsLostFoundDeleteActionCreator,
} from "../states/action";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.profile);
  const lostFounds = useSelector((state) => state.lostFounds);
  const isLostFoundDeleted = useSelector((state) => state.isLostFoundDeleted);

  const [filterStatus, setFilterStatus] = useState("");
  const [isMine, setIsMine] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedLostFoundId, setSelectedLostFoundId] = useState(null);

  // State untuk jam & tanggal real-time
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  const day = dayNames[time.getDay()];
  const date = time.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const clock = time.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  useEffect(() => {
    let params = {};
    if (filterStatus) {
      if (filterStatus === "lost" || filterStatus === "found") {
        params.status = filterStatus;
      }
    }
    if (isMine) params.is_me = 1;
    params.limit = 1000;
    dispatch(asyncSetLostFounds(params));
  }, [filterStatus, isMine, dispatch]);

  useEffect(() => {
    if (isLostFoundDeleted) {
      dispatch(setIsLostFoundDeleteActionCreator(false));
      let params = {};
      if (isMine) params.is_me = 1;
      params.limit = 1000;
      dispatch(asyncSetLostFounds(params));
    }
  }, [isLostFoundDeleted, isMine, dispatch]);

  if (!profile) return null;

  function handleDeleteLostFound(lostFoundId) {
    showConfirmDialog(
      "Hapus Lost & Found",
      "Apakah Anda yakin ingin menghapus item ini?"
    ).then((result) => {
      if (result.isConfirmed) {
        dispatch(asyncSetIsLostFoundDelete(lostFoundId));
      }
    });
  }

  const totalItems = lostFounds.length;
  const lostItems = lostFounds.filter((item) => item.status === "lost").length;
  const foundItems = lostFounds.filter((item) => item.status === "found").length;

  // 🎨 Tema Cerah
  const COLOR_BACKGROUND = "#f5f7fb";
  const COLOR_HEADER = "#dbe2ef";
  const COLOR_PRIMARY = "#3f72af";
  const COLOR_LOST = "#ff6f61";
  const COLOR_FOUND = "#66bb6a";
  const COLOR_TEXT = "#2f2f2f";
  const COLOR_TITLE = "#1e56a0";
  const COLOR_CARD = "#ffffff";

  const tableHeaderStyle = { backgroundColor: COLOR_HEADER };
  const cardBodyStyle = { backgroundColor: COLOR_CARD, border: `1px solid ${COLOR_HEADER}` };

  return (
    <div className="main-content" style={{ backgroundColor: COLOR_BACKGROUND, minHeight: "100vh" }}>
      <div className="container-fluid mt-3">

        {/* HEADER & FILTER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ color: COLOR_TITLE }}>Dashboard Lost & Found</h2>
          <div className="d-flex gap-3">
            <div className="input-group" style={{ maxWidth: "300px" }}>
              <span className="input-group-text" style={{ ...tableHeaderStyle, color: COLOR_TEXT }}>
                Filter Status
              </span>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ backgroundColor: "#fff", color: COLOR_TEXT, borderColor: COLOR_HEADER }}
              >
                <option value="">Semua</option>
                <option value="lost">Hilang</option>
                <option value="found">Ditemukan</option>
              </select>
            </div>
            <button
              type="button"
              className="btn"
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: COLOR_PRIMARY,
                color: "#fff",
                fontWeight: "500",
              }}
            >
              <i className="bi bi-plus"></i> Tambah Item
            </button>
          </div>
        </div>
        <hr style={{ borderColor: COLOR_HEADER }} />

        {/* CARD TOTAL ITEM */}
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm" style={{ ...cardBodyStyle }}>
              <div className="card-body">
                <h5 className="card-title text-secondary">Total Item</h5>
                <h2 className="card-text">{totalItems}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow-sm" style={{ ...cardBodyStyle }}>
              <div className="card-body">
                <h5 className="card-title text-danger">Item Hilang</h5>
                <h2 className="card-text">{lostItems}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow-sm" style={{ ...cardBodyStyle }}>
              <div className="card-body">
                <h5 className="card-title text-success">Item Ditemukan</h5>
                <h2 className="card-text">{foundItems}</h2>
              </div>
            </div>
          </div>
        </div>

{/* 📅 STATISTIK BERDASARKAN DATA ITEM */}
<div className="mt-4">
  <h4 style={{ color: COLOR_TITLE }}>Statistik Barang Hilang & Ditemukan</h4>
  <div className="row mt-3">

    {/* Statistik Mingguan */}
    <div className="col-md-6 mb-4">
      <div className="card shadow-sm" style={cardBodyStyle}>
        <div className="card-body">
          <h5 className="card-title text-center mb-3" style={{ color: COLOR_PRIMARY }}>
            Statistik Mingguan (7 Hari Terakhir)
          </h5>
          {(() => {
            const now = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 6);

            // Filter item dalam 7 hari terakhir
            const recentItems = lostFounds.filter((item) => {
              const itemDate = new Date(item.created_at);
              return itemDate >= sevenDaysAgo && itemDate <= now;
            });

            if (recentItems.length === 0) {
              return <p className="text-muted text-center mb-0">Tidak ada data minggu ini.</p>;
            }

            // Hitung per hari
            const dailyStats = {};
            recentItems.forEach((item) => {
              const d = new Date(item.created_at);
              const dayLabel = d.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
              });
              if (!dailyStats[dayLabel]) dailyStats[dayLabel] = { lost: 0, found: 0 };
              if (item.status === "lost") dailyStats[dayLabel].lost++;
              if (item.status === "found") dailyStats[dayLabel].found++;
            });

            return (
              <ul className="list-group">
                {Object.entries(dailyStats).map(([day, count]) => (
                  <li key={day} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{day}</span>
                    <span>
                      <span className="badge bg-danger me-2">Hilang: {count.lost}</span>
                      <span className="badge bg-success">Ditemukan: {count.found}</span>
                    </span>
                  </li>
                ))}
              </ul>
            );
          })()}
        </div>
      </div>
    </div>

    {/* Statistik Bulanan */}
    <div className="col-md-6 mb-4">
      <div className="card shadow-sm" style={cardBodyStyle}>
        <div className="card-body">
          <h5 className="card-title text-center mb-3" style={{ color: COLOR_PRIMARY }}>
            Statistik Bulanan
          </h5>
          {(() => {
            if (lostFounds.length === 0) {
              return <p className="text-muted text-center mb-0">Tidak ada data bulanan.</p>;
            }

            // Hitung per bulan
            const monthlyStats = {};
            lostFounds.forEach((item) => {
              const d = new Date(item.created_at);
              const monthLabel = d.toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              });
              if (!monthlyStats[monthLabel]) monthlyStats[monthLabel] = { lost: 0, found: 0 };
              if (item.status === "lost") monthlyStats[monthLabel].lost++;
              if (item.status === "found") monthlyStats[monthLabel].found++;
            });

            return (
              <ul className="list-group">
                {Object.entries(monthlyStats).map(([month, count]) => (
                  <li key={month} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{month}</span>
                    <span>
                      <span className="badge bg-danger me-2">Hilang: {count.lost}</span>
                      <span className="badge bg-success">Ditemukan: {count.found}</span>
                    </span>
                  </li>
                ))}
              </ul>
            );
          })()}
        </div>
      </div>
    </div>

  </div>
</div>


        {/* DAFTAR ITEM */}
        <div className="mt-4">
          <h4 style={{ color: COLOR_TITLE }}>Daftar Item Lost & Found</h4>
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="showMineSwitch"
              checked={isMine}
              onChange={() => setIsMine(!isMine)}
            />
            <label className="form-check-label" htmlFor="showMineSwitch" style={{ color: COLOR_TEXT }}>
              {isMine ? "Hanya Tampilkan Data Saya" : "Tampilkan Semua Data"}
            </label>
          </div>

          <div className="row">
            {lostFounds.length === 0 ? (
              <div className="col-12 text-center py-5 text-muted">
                <i className="bi bi-info-circle me-2"></i>Belum ada data Lost & Found.
              </div>
            ) : (
              lostFounds.map((lf) => (
                <div key={lf.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                  <div
                    className="card h-100 shadow-sm"
                    style={{
                      backgroundColor: COLOR_CARD,
                      border: `1px solid ${COLOR_HEADER}`,
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/lost-founds/${lf.id}`)}
                  >
                    <div style={{ height: "180px", overflow: "hidden" }}>
                      <img
                        src={lf.cover || "/default-cover.png"}
                        className="card-img-top"
                        alt={lf.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title text-truncate" style={{ color: COLOR_PRIMARY }}>
                        {lf.title}
                      </h5>
                      <p className="card-text small text-muted mb-2">
                        <i className="bi bi-calendar me-1"></i> {formatDate(lf.created_at)}
                      </p>
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            lf.status === "found" ? COLOR_FOUND : COLOR_LOST,
                          color: "#fff",
                        }}
                      >
                        {lf.status === "found" ? "Ditemukan" : "Hilang"}
                      </span>

                      <div className="d-flex justify-content-between mt-3">
                        <button
                          className="btn btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/lost-founds/${lf.id}`);
                          }}
                          style={{
                            backgroundColor: COLOR_PRIMARY,
                            color: "#fff",
                            fontWeight: "500",
                          }}
                        >
                          Detail
                        </button>

                        {lf.user_id === profile.id && (
                          <button
                            className="btn btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLostFound(lf.id);
                            }}
                            style={{
                              backgroundColor: COLOR_LOST,
                              color: "#fff",
                              fontWeight: "500",
                            }}
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AddModal show={showAddModal} onClose={() => setShowAddModal(false)} />
      <ChangeModal
        show={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        lostFoundId={selectedLostFoundId}
      />
    </div>
  );
}

export default HomePage;
