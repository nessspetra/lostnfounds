import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncSetLostFound,
  asyncSetLostFounds,
  asyncUpdateLostFound,
  setIsLostFoundChangeActionCreator,
  setIsLostFoundChangedActionCreator,
} from "../states/action";

function ChangeModal({ show, onClose, lostFoundId }) {
  const dispatch = useDispatch();

  // State dari reducer (diubah)
  const isLostFoundChange = useSelector((state) => state.isLostFoundChange);
  const isLostFoundChanged = useSelector((state) => state.isLostFoundChanged);
  const lostFound = useSelector((state) => state.lostFound);

  const [loading, setLoading] = useState(false);

  // State untuk input (disesuaikan)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("lost"); // Status: 'lost' atau 'found'
  const [isCompleted, setIsCompleted] = useState(false); // Status penyelesaian

  // 1. Ambil data lostFound sesuai lostFoundId
  useEffect(() => {
    if (lostFoundId) {
      dispatch(asyncSetLostFound(lostFoundId));
    }
  }, [lostFoundId, dispatch]);

  // 2. Ubah nilai pada input ketika data lostFound tiba
  useEffect(() => {
    if (lostFound) {
      setTitle(lostFound.title);
      setDescription(lostFound.description);
      setStatus(lostFound.status);
      setIsCompleted(lostFound.is_completed);
    }
  }, [lostFound]);

  // 3. Cek apakah proses perubahan data sudah selesai
  useEffect(() => {
    if (isLostFoundChange) {
      setLoading(false);
      dispatch(setIsLostFoundChangeActionCreator(false));
      if (isLostFoundChanged) {
        dispatch(setIsLostFoundChangedActionCreator(false));
        // perbarui data lostFounds (list)
        dispatch(asyncSetLostFounds());
        onClose();
      }
    }
  }, [isLostFoundChange, isLostFoundChanged, dispatch, onClose]);

  // Lock scroll saat modal tampil
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
  }, [show]);

  // Fungsi save
  function handleSave() {
    if (!title) {
      showErrorDialog("Judul tidak boleh kosong");
      return;
    }

    if (!description) {
      showErrorDialog("Deskripsi tidak boleh kosong");
      return;
    }

    setLoading(true);
    // Mengirim semua field yang diperlukan untuk update
    dispatch(
      asyncUpdateLostFound(
        lostFoundId,
        title,
        description,
        status,
        isCompleted
      )
    );
  }

  if (!lostFound) return;

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="modal-backdrop"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="modal"
            tabIndex="-1"
            style={{ display: "block" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-light">
                  <h1 className="modal-title fs-5">Ubah Lost & Found</h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Judul</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  {/* Input Status Lost/Found */}
                  <div className="mb-3">
                    <label className="form-label">Status Barang</label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="lost">Hilang</option>
                      <option value="found">Ditemukan</option>
                    </select>
                  </div>

                  {/* Input Status Penyelesaian */}
                  <div className="mb-3">
                    <label className="form-label">Status Penyelesaian</label>
                    <select
                      className="form-select"
                      value={isCompleted ? "true" : "false"}
                      onChange={(e) =>
                        setIsCompleted(e.target.value === "true")
                      }
                    >
                      <option value="false">Belum Selesai</option>
                      <option value="true">Selesai/Diklaim</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                  >
                    <i className="bi bi-x-circle"></i> Batal
                  </button>

                  {loading ? (
                    <button type="button" className="btn btn-primary" disabled>
                      <span className="spinner-border spinner-border-sm"></span>
                      &nbsp;Menyimpan...
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSave}
                    >
                      <i className="bi bi-save"></i> Simpan
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ChangeModal;