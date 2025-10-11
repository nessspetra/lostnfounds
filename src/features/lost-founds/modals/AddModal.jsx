import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import useInput from "../../../hooks/useInput";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncSetLostFounds,
  setIsLostFoundAddActionCreator,
  setIsLostFoundAddedActionCreator,
  // Kita tidak perlu asyncSetIsLostFoundAdd karena kita memanggil API langsung
} from "../states/action"; 
import lostFoundApi from "../api/lostfoundApi"; // Diperlukan untuk POST bertahap

function AddModal({ show, onClose }) {
  const dispatch = useDispatch();

  const isLostAdd = useSelector((state) => state.isLostAdd);
  const isLostAdded = useSelector((state) => state.isLostAdded);

  const [loading, setLoading] = useState(false);
  
  // State Input Teks
  const [title, changeTitle] = useInput("");
  const [description, changeDescription] = useInput("");
  
  // State Input Gambar
  const [fileCover, setFileCover] = useState(null); 
  const fileInputRef = useRef(null);

  // Cek apakah tambah data selesai
  useEffect(() => {
    if (isLostAdd) {
      setLoading(false);
      dispatch(setIsLostFoundAddActionCreator(false));
      if (isLostAdded) {
        dispatch(setIsLostFoundAddedActionCreator(false));
        // Perbarui daftar dan tutup modal. Filter is_me: 1 dipastikan terkirim.
        dispatch(asyncSetLostFounds({ is_me: 1, limit: 1000 }));
        onClose(); 
      }
    }
  }, [isLostAdd, isLostAdded, dispatch, onClose]);

  useEffect(() => {
    // Memastikan modal memiliki z-index tinggi di atas backdrop
    document.body.style.overflow = show ? "hidden" : "auto";
  }, [show]);

  async function handleSave() {
    if (!title) {
      showErrorDialog("Judul tidak boleh kosong");
      return;
    }
    if (!description) {
      showErrorDialog("Deskripsi tidak boleh kosong");
      return;
    }

    setLoading(true);
    const status = "lost";

    try {
        // --- 1. POST Data Teks (API Call Langsung) ---
        const response = await lostFoundApi.postLostFound(title, description, status);
        const lostFoundId = response.lost_found_id;
        
        // --- 2. POST Data Gambar (JIKA ADA) ---
        if (fileCover) {
            await lostFoundApi.postLostFoundCover(lostFoundId, fileCover);
            showSuccessDialog("Data dan gambar berhasil ditambahkan!");
        } else {
             showSuccessDialog("Data dasar berhasil ditambahkan.");
        }

        // --- 3. Update Redux State (Cleanup) ---
        dispatch(setIsLostFoundAddedActionCreator(true)); 

    } catch (error) {
        showErrorDialog(error.message || "Gagal menyimpan data.");
        dispatch(setIsLostFoundAddedActionCreator(false)); 
    }
    dispatch(setIsLostFoundAddActionCreator(true)); 
  }

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="modal-backdrop fade show"
            onClick={onClose}
            style={{ zIndex: 1050 }} // Z-index untuk memastikan backdrop muncul
          />

          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{ zIndex: 1060, display: 'block' }} // Z-index untuk modal
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-light">
                  <h1 className="modal-title fs-5">Tambah Barang Hilang</h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    {/* PERBAIKAN: Judul */}
                    <label htmlFor="addLfTitle" className="form-label">Judul</label> 
                    <input
                      type="text"
                      id="addLfTitle" // ID UNIK
                      name="title" // NAME UNTUK AUTOFILL
                      onChange={changeTitle}
                      className="form-control"
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-3">
                    {/* PERBAIKAN: Deskripsi */}
                    <label htmlFor="addLfDescription" className="form-label">Deskripsi</label>
                    <textarea
                      id="addLfDescription" // ID UNIK
                      name="description" // NAME UNTUK AUTOFILL
                      onChange={changeDescription}
                      className="form-control"
                      rows="3"
                      disabled={loading}
                    ></textarea>
                  </div>
                  
                  {/* INPUT GAMBAR BARU */}
                  <div className="mb-3">
                    {/* PERBAIKAN: Foto Barang */}
                    <label htmlFor="addLfCover" className="form-label">Foto Barang (Opsional)</label>
                    <input
                      type="file"
                      id="addLfCover" // ID UNIK
                      name="cover" // NAME UNTUK AUTOFILL
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => setFileCover(e.target.files[0])}
                      className="form-control"
                      disabled={loading}
                    />
                    {fileCover && <small className="text-muted">File terpilih: {fileCover.name}</small>}
                  </div>
                  
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                    disabled={loading}
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

export default AddModal;