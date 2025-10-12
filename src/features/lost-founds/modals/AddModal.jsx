
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import useInput from "../../../hooks/useInput";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncSetLostFounds,
  setIsLostFoundAddActionCreator,
  setIsLostFoundAddedActionCreator,
} from "../states/action";
import lostFoundApi from "../api/lostfoundApi";

/**
 * Komponen Modal Tambah Barang Hilang.
 * @param {boolean} show - Menentukan apakah modal ditampilkan.
 * @param {function} onClose - Fungsi untuk menutup modal.
 */
function AddModal({ show, onClose }) {
  const dispatch = useDispatch();

  // ======== REDUX STATE ========
  const isLostAdd = useSelector((state) => state.isLostAdd);
  const isLostAdded = useSelector((state) => state.isLostAdded);

  // ======== LOCAL STATE ========
  const [loading, setLoading] = useState(false);

  // Input teks
  const [title, changeTitle] = useInput("");
  const [description, changeDescription] = useInput("");

  // Input file
  const [fileCover, setFileCover] = useState(null);
  const fileInputRef = useRef(null);

  // ======== EFFECT: Monitoring Redux State ========
  useEffect(() => {
    if (isLostAdd) {
      // Matikan loading setelah proses selesai
      setLoading(false);
      dispatch(setIsLostFoundAddActionCreator(false));

      // Jika data berhasil ditambahkan
      if (isLostAdded) {
        dispatch(setIsLostFoundAddedActionCreator(false));

        // Refresh daftar barang milik user
        dispatch(asyncSetLostFounds({ is_me: 1, limit: 1000 }));

        // Tutup modal
        onClose();
      }
    }
  }, [isLostAdd, isLostAdded, dispatch, onClose]);

  // ======== EFFECT: Kontrol scroll body saat modal terbuka ========
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
  }, [show]);

  // ======== HANDLER: Simpan data ========
  async function handleSave() {
    // Validasi input wajib
    if (!title) {
      showErrorDialog("Judul tidak boleh kosong.");
      return;
    }
    if (!description) {
      showErrorDialog("Deskripsi tidak boleh kosong.");
      return;
    }

    setLoading(true);
    const status = "lost"; // Default status

    try {
      // 1️⃣ Kirim data teks ke API
      const response = await lostFoundApi.postLostFound(title, description, status);
      const lostFoundId = response.lost_found_id;

      // 2️⃣ Jika ada file gambar, upload terpisah
      if (fileCover) {
        await lostFoundApi.postLostFoundCover(lostFoundId, fileCover);
        showSuccessDialog("Data dan gambar berhasil ditambahkan!");
      } else {
        showSuccessDialog("Data berhasil ditambahkan tanpa gambar.");
      }

      // 3️⃣ Update state Redux
      dispatch(setIsLostFoundAddedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message || "Gagal menyimpan data.");
      dispatch(setIsLostFoundAddedActionCreator(false));
    }

    // 4️⃣ Sinyal bahwa proses add selesai
    dispatch(setIsLostFoundAddActionCreator(true));
  }

  // ======== RENDER MODAL ========
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* BACKDROP TRANSPARAN */}
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
            role="dialog"
            style={{ zIndex: 1060, display: "block" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                {/* HEADER */}
                <div className="modal-header bg-light">
                  <h1 className="modal-title fs-5">Tambah Barang Hilang</h1>
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
                    <label htmlFor="addLfTitle" className="form-label">
                      Judul
                    </label>
                    <input
                      type="text"
                      id="addLfTitle"
                      name="title"
                      onChange={changeTitle}
                      className="form-control"
                      disabled={loading}
                    />
                  </div>

                  {/* Input Deskripsi */}
                  <div className="mb-3">
                    <label htmlFor="addLfDescription" className="form-label">
                      Deskripsi
                    </label>
                    <textarea
                      id="addLfDescription"
                      name="description"
                      onChange={changeDescription}
                      className="form-control"
                      rows="3"
                      disabled={loading}
                    ></textarea>
                  </div>

                  {/* Input Gambar (opsional) */}
                  <div className="mb-3">
                    <label htmlFor="addLfCover" className="form-label">
                      Foto Barang (Opsional)
                    </label>
                    <input
                      type="file"
                      id="addLfCover"
                      name="cover"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => setFileCover(e.target.files[0])}
                      className="form-control"
                      disabled={loading}
                    />
                    {fileCover && (
                      <small className="text-muted">
                        File terpilih: {fileCover.name}
                      </small>
                    )}
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

export default AddModal;
