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

/* 🎨 Warna Tema */
const COLOR = {
  BACKGROUND: "#f5f7fb",
  HEADER: "#dbe2ef",
  PRIMARY: "#3f72af",
  LOST: "#ff6f61",
  FOUND: "#66bb6a",
  TEXT: "#2f2f2f",
  TITLE: "#1e56a0",
  CARD: "#ffffff",
};

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* === STATE DARI REDUX === */
  const profile = useSelector((state) => state.profile);
  const lostFounds = useSelector((state) => state.lostFounds);
  const isLostFoundDeleted = useSelector((state) => state.isLostFoundDeleted);

  /* === STATE LOKAL === */
  const [filterStatus, setFilterStatus] = useState("");
  const [isMine, setIsMine] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedLostFoundId, setSelectedLostFoundId] = useState(null);
  const [time, setTime] = useState(new Date()); // Untuk jam & tanggal real-time

  /* === HANDLER WAKTU REAL-TIME === */
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  /* === FUNGSI PENGAMBILAN DATA LOST & FOUND === */
  const fetchLostFounds = () => {
    const params = {
      limit: 1000,
      ...(filterStatus && { status: filterStatus }),
      ...(isMine && { is_me: 1 }),
    };
    dispatch(asyncSetLostFounds(params));
  };

  useEffect(fetchLostFounds, [filterStatus, isMine, dispatch]);

  /* === RELOAD DATA SAAT ITEM DIHAPUS === */
  useEffect(() => {
    if (isLostFoundDeleted) {
      dispatch(setIsLostFoundDeleteActionCreator(false));
      fetchLostFounds();
    }
  }, [isLostFoundDeleted, dispatch]);

  if (!profile) return null;

  /* === FUNGSI HAPUS ITEM === */
  const handleDeleteLostFound = (lostFoundId) => {
    showConfirmDialog(
      "Hapus Lost & Found",
      "Apakah Anda yakin ingin menghapus item ini?"
    ).then((result) => {
      if (result.isConfirmed) {
        dispatch(asyncSetIsLostFoundDelete(lostFoundId));
      }
    });
  };

  /* === STATISTIK DASAR === */
  const totalItems = lostFounds.length;
  const lostItems = lostFounds.filter((i) => i.status === "lost").length;
  const foundItems = lostFounds.filter((i) => i.status === "found").length;

  /* === RENDER STATISTIK MINGGUAN === */
  const renderWeeklyStats = () => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6);

    const recentItems = lostFounds.filter((item) => {
      const itemDate = new Date(item.created_at);
      return itemDate >= sevenDaysAgo && itemDate <= now;
    });

    if (recentItems.length === 0)
      return <p className="text-muted text-center mb-0">Tidak ada data minggu ini.</p>;

    const dailyStats = {};
    recentItems.forEach((item) => {
      const label = new Date(item.created_at).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
      });
      if (!dailyStats[label]) dailyStats[label] = { lost: 0, found: 0 };
      dailyStats[label][item.status]++;
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
  };

  /* === RENDER STATISTIK BULANAN === */
  const renderMonthlyStats = () => {
    if (lostFounds.length === 0)
      return <p className="text-muted text-center mb-0">Tidak ada data bulanan.</p>;

    const monthlyStats = {};
    lostFounds.forEach((item) => {
      const label = new Date(item.created_at).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      });
      if (!monthlyStats[label]) monthlyStats[label] = { lost: 0, found: 0 };
      monthlyStats[label][item.status]++;
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
  };

  /* === RENDER ITEM CARD === */
  const renderLostFoundCards = () => {
    if (lostFounds.length === 0)
      return (
        <div className="col-12 text-center py-5 text-muted">
          <i className="bi bi-info-circle me-2"></i>Belum ada data Lost & Found.
        </div>
      );

    return lostFounds.map((lf) => (
      <div key={lf.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div
          className="card h-100 shadow-sm"
          style={{
            backgroundColor: COLOR.CARD,
            border: `1px solid ${COLOR.HEADER}`,
            cursor: "pointer",
          }}
          onClick={() => navigate(`/lost-founds/${lf.id}`)}
        >
          {/* COVER */}
          <div style={{ height: "180px", overflow: "hidden" }}>
            <img
              src={lf.cover || "/default-cover.png"}
              className="card-img-top"
              alt={lf.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* INFORMASI ITEM */}
          <div className="card-body">
            <h5 className="card-title text-truncate" style={{ color: COLOR.PRIMARY }}>
              {lf.title}
            </h5>
            <p className="card-text small text-muted mb-2">
              <i className="bi bi-calendar me-1"></i> {formatDate(lf.created_at)}
            </p>
            <span
              className="badge"
              style={{
                backgroundColor: lf.status === "found" ? COLOR.FOUND : COLOR.LOST,
                color: "#fff",
              }}
            >
              {lf.status === "found" ? "Ditemukan" : "Hilang"}
            </span>

            {/* AKSI */}
            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/lost-founds/${lf.id}`);
                }}
                style={{ backgroundColor: COLOR.PRIMARY, color: "#fff", fontWeight: "500" }}
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
                  style={{ backgroundColor: COLOR.LOST, color: "#fff", fontWeight: "500" }}
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  /* === UI RENDER === */
  return (
    <div className="main-content" style={{ backgroundColor: COLOR.BACKGROUND, minHeight: "100vh" }}>
      <div className="container-fluid mt-3">

        {/* HEADER & FILTER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ color: COLOR.TITLE }}>Dashboard Lost & Found</h2>

          <div className="d-flex gap-3">
            {/* FILTER STATUS */}
            <div className="input-group" style={{ maxWidth: "300px" }}>
              <span className="input-group-text" style={{ backgroundColor: COLOR.HEADER }}>
                Filter Status
              </span>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Semua</option>
                <option value="lost">Hilang</option>
                <option value="found">Ditemukan</option>
              </select>
            </div>

            {/* TOMBOL TAMBAH */}
            <button
              type="button"
              className="btn"
              onClick={() => setShowAddModal(true)}
              style={{ backgroundColor: COLOR.PRIMARY, color: "#fff", fontWeight: "500" }}
            >
              <i className="bi bi-plus"></i> Tambah Item
            </button>
          </div>
        </div>

        <hr style={{ borderColor: COLOR.HEADER }} />

        {/* KARTU STATISTIK */}
        <div className="row mb-4">
          {[
            { title: "Total Item", value: totalItems, color: "text-secondary" },
            { title: "Item Hilang", value: lostItems, color: "text-danger" },
            { title: "Item Ditemukan", value: foundItems, color: "text-success" },
          ].map((stat, i) => (
            <div key={i} className="col-md-4 mb-3">
              <div className="card shadow-sm" style={{ backgroundColor: COLOR.CARD }}>
                <div className="card-body">
                  <h5 className={`card-title ${stat.color}`}>{stat.title}</h5>
                  <h2 className="card-text">{stat.value}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 📊 STATISTIK MINGGUAN & BULANAN */}
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-center mb-3" style={{ color: COLOR.PRIMARY }}>
                  Statistik Mingguan (7 Hari Terakhir)
                </h5>
                {renderWeeklyStats()}
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-center mb-3" style={{ color: COLOR.PRIMARY }}>
                  Statistik Bulanan
                </h5>
                {renderMonthlyStats()}
              </div>
            </div>
          </div>
        </div>

        {/* DAFTAR ITEM */}
        <div className="mt-4">
          <h4 style={{ color: COLOR.TITLE }}>Daftar Item Lost & Found</h4>

          {/* SWITCH FILTER */}
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="showMineSwitch"
              checked={isMine}
              onChange={() => setIsMine(!isMine)}
            />
            <label className="form-check-label" htmlFor="showMineSwitch">
              {isMine ? "Hanya Tampilkan Data Saya" : "Tampilkan Semua Data"}
            </label>
          </div>

          <div className="row">{renderLostFoundCards()}</div>
        </div>
      </div>

      {/* === MODAL === */}
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
