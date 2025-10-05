import { useSelector, useDispatch } from "react-redux";
import "../resources/custom.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ChangeModal from "../modals/ChangeModal"; 
import {
  asyncSetIsLostFoundDelete,
  asyncSetLostFound,
  asyncSetLostFounds,
  setIsLostFoundActionCreator,
  setIsLostFoundDeleteActionCreator,
} from "../states/action";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import ChangeCoverModal from "../modals/ChangeCoverModal"; 

function DetailPage() {
  const { lostFoundId } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showChangeCoverModal, setShowChangeCoverModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false); 

  // Ambil data dari reducer (Diubah)
  const profile = useSelector((state) => state.profile);
  const lostFound = useSelector((state) => state.lostFound);
  const isLostFound = useSelector((state) => state.isLostFound);

  // 1. Ambil data lostFound sesuai id
  useEffect(() => {
    if (lostFoundId) {
      dispatch(asyncSetLostFound(lostFoundId));
    }
  }, [lostFoundId, dispatch]);

  // Periksa apakah pengambilan data lostFound sudah selesai
  useEffect(() => {
    if (isLostFound) {
      dispatch(setIsLostFoundActionCreator(false));
      if (!lostFound) {
        navigate("/lost-founds"); // Diubah
      }
    }
  }, [isLostFound, lostFound, navigate, dispatch]);

  // Fungsi delete
  function handleDeleteLostFound() {
    showConfirmDialog(
      "Hapus Lost & Found",
      "Apakah Anda yakin ingin menghapus item ini?",
      () => {
        dispatch(asyncSetIsLostFoundDelete(lostFound.id));
        dispatch(setIsLostFoundDeleteActionCreator(true));
        navigate("/lost-founds");
      }
    );
  }

  if (!profile || !lostFound) return;

  return (
    <>
      <div className="main-content">
        <div className="container-fluid mt-3">
          <div className="d-flex align-items-center mb-3">
            <div className="flex-fill">
              <h2 className="mb-0">
                {lostFound.title}
                {/* Status Barang: Hilang/Ditemukan */}
                {lostFound.status === "found" ? (
                  <span className="badge bg-primary ms-2">Ditemukan</span>
                ) : (
                  <span className="badge bg-warning ms-2">Hilang</span>
                )}
                {/* Status Penyelesaian: Selesai/Belum Selesai */}
                {lostFound.is_completed ? (
                  <span className="badge bg-success ms-2">Selesai/Diklaim</span>
                ) : (
                  <span className="badge bg-danger ms-2">Belum Selesai</span>
                )}
              </h2>
            </div>
            {lostFound.user_id === profile.id && (
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowChangeModal(true)}
                >
                  <i className="bi bi-pencil-square"></i> Ubah Detail
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => setShowChangeCoverModal(true)}
                >
                  <i className="bi bi-image"></i> Ubah Cover
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteLostFound}
                >
                  <i className="bi bi-trash"></i> Hapus
                </button>
              </div>
            )}
          </div>
          <hr />

          <div className="card shadow-sm">
            <div className="card-body">
              <div className="row">
                {/* Kolom Kiri: Cover Image */}
                <div className="col-md-5 mb-3 mb-md-0">
                  <h5 className="card-title">Cover Item</h5>
                  {lostFound.cover ? (
                    <img
                      className="img-fluid rounded shadow-sm"
                      src={lostFound.cover}
                      alt="Cover Lost & Found"
                      style={{ maxHeight: "400px", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="text-center p-5 bg-light rounded border">
                      <i className="bi bi-image-fill fs-1 text-muted"></i>
                      <p className="mt-2 text-muted">Tidak ada cover</p>
                    </div>
                  )}
                </div>

                {/* Kolom Kanan: Detail Item */}
                <div className="col-md-7">
                  <h5 className="card-title">Deskripsi Item</h5>
                  <p className="card-text text-muted">
                    {lostFound.description}
                  </p>
                  <hr />
                  
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Status Barang:</strong>{" "}
                      {lostFound.status === "found" ? (
                        <span className="text-primary">Ditemukan</span>
                      ) : (
                        <span className="text-warning">Hilang</span>
                      )}
                    </li>
                    <li className="list-group-item">
                      <strong>Status Penyelesaian:</strong>{" "}
                      {lostFound.is_completed ? (
                        <span className="text-success">Sudah Diklaim</span>
                      ) : (
                        <span className="text-danger">Belum Diklaim</span>
                      )}
                    </li>
                    <li className="list-group-item">
                      <strong>Dibuat Oleh:</strong> {lostFound.user.name}
                    </li>
                    <li className="list-group-item">
                      <strong>Tanggal Dibuat:</strong> {formatDate(lostFound.created_at)}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Ubah Detail */}
      <ChangeModal
        show={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        lostFoundId={lostFound.id} // Diubah
      />

      {/* Modal Ubah Cover */}
      <ChangeCoverModal
        show={showChangeCoverModal}
        onClose={() => setShowChangeCoverModal(false)}
        lostFound={lostFound} // Diubah
      />
    </>
  );
}

export default DetailPage;