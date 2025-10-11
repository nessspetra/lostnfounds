import { useSelector, useDispatch } from "react-redux";
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

  const profile = useSelector((state) => state.profile);
  const lostFound = useSelector((state) => state.lostFound);
  const isLostFound = useSelector((state) => state.isLostFound);

  useEffect(() => {
    if (lostFoundId) {
      dispatch(asyncSetLostFound(lostFoundId));
    }
  }, [lostFoundId, dispatch]);

  useEffect(() => {
    if (isLostFound) {
      dispatch(setIsLostFoundActionCreator(false));
      if (!lostFound) {
        navigate("/lost-founds");
      }
    }
  }, [isLostFound, lostFound, navigate, dispatch]);

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
  
  // Penentu apakah item ini milik pengguna yang sedang login
  const isItemAuthor = lostFound.user_id === profile.id;

  return (
    <>
      <div className="main-content">
        <div className="container-fluid mt-3">
          <div className="d-flex align-items-center mb-3">
            <div className="flex-fill">
              <h2 className="mb-0" style={{ color: '#97d2e8' }}>
                {lostFound.title}
                {lostFound.status === "found" ? (
                  <span className="badge bg-primary ms-2" style={{ backgroundColor: '#4bc0c0', color: '#2b2f5c' }}>Ditemukan</span>
                ) : (
                  <span className="badge bg-warning ms-2" style={{ backgroundColor: '#ff6384', color: '#2b2f5c' }}>Hilang</span>
                )}
              </h2>
            </div>
            
            {/* HANYA TAMPILKAN TOMBOL AKSI JIKA PENGGUNA ADALAH AUTHOR ITEM */}
            {isItemAuthor && (
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowChangeModal(true)}
                  style={{ backgroundColor: '#7c88ff', color: '#2b2f5c' }}
                >
                  <i className="bi bi-pencil-square"></i> Ubah Detail
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowChangeCoverModal(true)}
                  style={{ backgroundColor: '#97d2e8', color: '#2b2f5c' }}
                >
                  <i className="bi bi-image"></i> Ubah Cover
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={handleDeleteLostFound}
                  style={{ backgroundColor: '#ff6384', color: '#2b2f5c' }}
                >
                  <i className="bi bi-trash"></i> Hapus
                </button>
              </div>
            )}
          </div>
          <hr style={{ borderColor: '#3a416a' }} />

          <div className="card shadow-sm" style={{ backgroundColor: '#2b2f5c', color: '#e0e0ff', border: '1px solid #3a416a' }}>
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
                      style={{ maxHeight: "400px", objectFit: "cover", border: '1px solid #7c88ff' }}
                    />
                  ) : (
                    <div className="text-center p-5 rounded border" style={{ backgroundColor: '#3a416a', borderColor: '#4a4f78' }}>
                      <i className="bi bi-image-fill fs-1" style={{ color: '#97d2e8' }}></i>
                      <p className="mt-2 text-muted" style={{ color: '#e0e0ff' }}>Tidak ada cover</p>
                    </div>
                  )}
                </div>

                {/* Kolom Kanan: Detail Item */}
                <div className="col-md-7">
                  <h5 className="card-title">Deskripsi Item</h5>
                  <p className="card-text" style={{ color: '#c0c0c0' }}>
                    {lostFound.description}
                  </p>
                  <hr style={{ borderColor: '#3a416a' }} />
                  
                  <ul className="list-group list-group-flush" style={{ backgroundColor: 'transparent' }}>
                    <li className="list-group-item" style={{ backgroundColor: 'transparent', borderTop: '1px solid #3a416a', color: '#e0e0ff' }}>
                      <strong>Status Barang:</strong>{" "}
                      {lostFound.status === "found" ? (
                        <span style={{ color: '#4bc0c0' }}>Ditemukan</span>
                      ) : (
                        <span style={{ color: '#ff6384' }}>Hilang</span>
                      )}
                    </li>
                    <li className="list-group-item" style={{ backgroundColor: 'transparent', borderTop: '1px solid #3a416a', borderBottom: 'none', color: '#e0e0ff' }}>
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
        lostFoundId={lostFound.id}
      />

      {/* Modal Ubah Cover */}
      <ChangeCoverModal
        show={showChangeCoverModal}
        onClose={() => setShowChangeCoverModal(false)}
        lostFound={lostFound}
      />
    </>
  );
}

export default DetailPage;