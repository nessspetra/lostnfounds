import { useSelector, useDispatch } from "react-redux";
import "../resources/custom.css";
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

  // Ambil data dari reducer (Diubah ke Lost & Found)
  const profile = useSelector((state) => state.profile);
  const lostFounds = useSelector((state) => state.lostFounds);
  const isLostFoundDeleted = useSelector((state) => state.isLostFoundDeleted);

  const [filter, changeFilter] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedLostFoundId, setSelectedLostFoundId] = useState(null);

  // Ambil data lostFounds (dengan filter)
  useEffect(() => {
    dispatch(asyncSetLostFounds(filter));
  }, [filter, dispatch]);

  // Jika lostFound berhasil dihapus, perbarui daftar lostFounds
  useEffect(() => {
    if (isLostFoundDeleted) {
      dispatch(setIsLostFoundDeleteActionCreator(false));
      dispatch(asyncSetLostFounds());
    }
  }, [isLostFoundDeleted, dispatch]);

  if (!profile) return;

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

  // Hitung statistik Lost & Found
  const totalItems = lostFounds.length;
  const lostItems = lostFounds.filter((item) => item.status === "lost").length;
  const foundItems = lostFounds.filter((item) => item.status === "found").length;

  return (
    <>
      {/* */}
      <div className="main-content">
        <div className="container-fluid mt-3">
          <h2>Dashboard Lost & Found</h2>
          <hr />

          {/* Card Statistik */}
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card bg-primary text-white shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Total Item</h5>
                  <h2 className="card-text">{totalItems}</h2>
                  <i
                    className="bi bi-box-seam opacity-50 position-absolute bottom-0 end-0 pe-3"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card bg-danger text-white shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Item Hilang</h5>
                  <h2 className="card-text">
                    {lostItems}
                  </h2>
                  <i
                    className="bi bi-x-circle opacity-50 position-absolute bottom-0 end-0 pe-3"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card bg-success text-white shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Item Ditemukan</h5>
                  <h2 className="card-text">
                    {foundItems}
                  </h2>
                  <i
                    className="bi bi-check-circle opacity-50 position-absolute bottom-0 end-0 pe-3"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Daftar Lost & Found */}
          <div className="card shadow-sm">
            <div className="card-header">
              <div className="d-flex">
                <div className="flex-fill">
                  <h4 className="pt-1">Daftar Item Lost & Found</h4>
                </div>
                <div>
                  <div className="input-group">
                    <span className="input-group-text">Filter Status</span>
                    <select
                      className="form-select"
                      value={filter}
                      onChange={(e) => changeFilter(e.target.value)}
                    >
                      <option value="">Semua</option>
                      <option value="lost">Hilang (Status Barang)</option>
                      <option value="found">Ditemukan (Status Barang)</option>
                      <option value="1">Selesai/Diklaim (Status Klaim)</option>
                      <option value="0">Belum Selesai (Status Klaim)</option>
                    </select>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setShowAddModal(true)}
                    >
                      <i className="bi bi-plus"></i> Tambah Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="text-center" style={{ width: "5%" }}>ID</th>
                      <th style={{ width: "30%" }}>Judul</th>
                      <th style={{ width: "15%" }}>Status Barang</th>
                      <th style={{ width: "15%" }}>Status Klaim</th>
                      <th style={{ width: "15%" }}>Tanggal Dibuat</th>
                      <th style={{ width: "20%" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lostFounds.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <i className="bi bi-info-circle me-2"></i>Belum ada data Lost & Found yang tersedia.
                        </td>
                      </tr>
                    )}
                    {lostFounds.map((lf) => (
                      <tr key={`lostfound-${lf.id}`}>
                        <td className="text-center">{lf.id}</td>
                        <td>{lf.title}</td>
                        {/* Status Barang: Hilang/Ditemukan */}
                        <td>
                          <span
                            className={`badge bg-${
                              lf.status === "found" ? "primary" : "warning"
                            }`}
                          >
                            {lf.status === "found" ? "Ditemukan" : "Hilang"}
                          </span>
                        </td>
                        {/* Status Klaim: Selesai/Belum Selesai */}
                        <td>
                          <span
                            className={`badge bg-${
                              lf.is_completed ? "success" : "danger"
                            }`}
                          >
                            {lf.is_completed ? "Selesai" : "Belum Selesai"}
                          </span>
                        </td>
                        <td>{formatDate(lf.created_at)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-info text-white"
                              onClick={() => navigate(`/lost-founds/${lf.id}`)}
                            >
                              <i className="bi bi-eye"></i> Detail
                            </button>
                            {/* Tombol Ubah dan Hapus hanya tampil jika item milik user */}
                            {lf.user_id === profile.id && (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-warning"
                                  onClick={() => {
                                    setSelectedLostFoundId(lf.id);
                                    setShowChangeModal(true);
                                  }}
                                >
                                  <i className="bi bi-pencil"></i> Ubah
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLostFound(lf.id)}
                                  className="btn btn-sm btn-danger"
                                >
                                  <i className="bi bi-trash"></i> Hapus
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah */}
      <AddModal show={showAddModal} onClose={() => setShowAddModal(false)} />
      {/* Modal Ubah Detail */}
      <ChangeModal
        show={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        lostFoundId={selectedLostFoundId}
      />
    </>
  );
}

export default HomePage;