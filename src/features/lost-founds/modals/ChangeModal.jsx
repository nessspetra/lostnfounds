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

/**
 * Komponen modal untuk mengubah detail Lost & Found.
 * @param {boolean} show - Status visibilitas modal.
 * @param {function} onClose - Fungsi untuk menutup modal.
 * @param {number} lostFoundId - ID item Lost & Found yang akan diedit.
 */
function ChangeModal({ show, onClose, lostFoundId }) {
  const dispatch = useDispatch();

  // ======== STATE REDUX ========
  const isLostFoundChange = useSelector((state) => state.isLostFoundChange);
  const isLostFoundChanged = useSelector((state) => state.isLostFoundChanged);
  const lostFound = useSelector((state) => state.lostFound);

  // ======== STATE LOCAL ========
  const [loading, setLoading] = useState(false); // Status proses simpan
  const [title, setTitle] = useState(""); // Judul item
  const [description, setDescription] = useState(""); // Deskripsi item
  const [status, setStatus] = useState("lost"); // Status barang (lost/found)
  const [isCompleted, setIsCompleted] = useState(false); // Status penyelesaian

  // ======== EFFECT 1: Ambil data detail Lost & Found ========
  useEffect(() => {
    if (lostFoundId) {
      dispatch(asyncSetLostFound(lostFoundId));
    }
  }, [lostFoundId, dispatch]);

  // ======== EFFECT 2: Isi form dengan data yang sudah ada ========
  useEffect(() => {
    if (lostFound) {
      setTitle(lostFound.title || "");
      setDescription(lostFound.description || "");
      setStatus(lostFound.status || "lost");
      setIsCompleted(lostFound.is_completed || false);
    }
  }, [lostFound]);

  // ======== EFFECT 3: Deteksi perubahan Redux (setelah update berhasil/gagal) ========
  useEffect(() => {
    if (isLostFoundChange) {
      setLoading(false);
      dispatch(setIsLostFoundChangeActionCreator(false));

      if (isLostFoundChanged) {
        // Reset flag perubahan
        dispatch(setIsLostFoundChangedActionCreator(false));

        // Perbarui data item yang diubah
        dispatch(asyncSetLostFound(lostFoundId));

        // Perbarui daftar milik pengguna
        dispatch(asyncSetLostFounds({ is_me: 1, limit: 1000 }));

        // Tutup modal
        onClose();
      }
    }
  }, [
    isLostFoundChange,
    isLostFoundChanged,
    dispatch,
    lostFoundId,
    onClose,
  ]);

  // ======== EFFECT 4: Atur scroll body saat modal aktif ========
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
  }, [show]);

  // ======== HANDLER: Validasi dan simpan perubahan ========
  function handleSave() {
    if (!title) {
      showErrorDialog("Judul tidak boleh kosong.");
      return;
    }

    if (!description) {
      showErrorDialog("Deskripsi tidak boleh kosong.");
      return;
    }

    setLoading(true);
    dispatch(
      asyncUpdateLostFound(
        lostFoundId,
        title,
        description,
        status,
        isCompleted // Kirim status penyelesaian
      )
    );
  }

  // Jika data belum siap, hentikan render
  if (!lostFound) return null;

  // ======== RENDER MODAL ========
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="modal-backdrop fade show"
            onClick={onClose}
            style={{ zIndex: 1050 }}
          />

          {/* KONTEN MODAL */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="modal fade show"
            tabIndex="-1"
            style={{ display: "block", zIndex: 1060 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                
                {/* HEADER */}
                <div className="modal-header bg-light">
                  <h1 className="modal-title fs-5">Ubah Lost & Found</h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                  ></button>
                </div>

                {/* BODY */}
                <div className="modal-body">
                  
                  {/* Input Judul */}
                  <div className="mb-3">
                    <label htmlFor="lfChangeTitle" className="form-label">
                      Judul
                    </label>
                    <input
                      type="text"
                      id="lfChangeTitle"
                      name="lfChangeTitle"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  {/* Input Status (Lost/Found) */}
                  <div className="mb-3">
                    <label htmlFor="lfChangeStatus" className="form-label">
                      Status Barang
                    </label>
                    <select
                      id="lfChangeStatus"
                      name="lfChangeStatus"
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={loading}
                    >
                      <option value="lost">Hilang</option>
                      <option value="found">Ditemukan</option>
                    </select>
                  </div>

                  {/* Input Deskripsi */}
                  <div className="mb-3">
                    <label htmlFor="lfChangeDescription" className="form-label">
                      Deskripsi
                    </label>
                    <textarea
                      id="lfChangeDescription"
                      name="lfChangeDescription"
                      className="form-control"
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={loading}
                    ></textarea>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="modal-footer bg-light">
                  {/* Tombol Batal */}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                    disabled={loading}
                  >
                    <i className="bi bi-x-circle"></i> Batal
                  </button>

                  {/* Tombol Simpan */}
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
