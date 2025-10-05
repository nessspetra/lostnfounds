import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import useInput from "../../../hooks/useInput";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncSetIsLostFoundAdd,
  asyncSetLostFounds,
  setIsLostFoundAddActionCreator,
  setIsLostFoundAddedActionCreator,
} from "../states/action";

function AddModal({ show, onClose }) {
  const dispatch = useDispatch();


  const isLostFoundAdd = useSelector((state) => state.isLostFoundAdd);
  const isLostFoundAdded = useSelector((state) => state.isLostFoundAdded);

  const [loading, setLoading] = useState(false);

  const [title, changeTitle] = useInput("");
  const [description, changeDescription] = useInput("");

  const [status, setStatus] = useState("lost"); 

  // 1. Cek apakah isLostFoundAdd sudah selesai
  useEffect(() => {
    if (isLostFoundAdd) {
      setLoading(false);
      dispatch(setIsLostFoundAddActionCreator(false));
      if (isLostFoundAdded) {
        dispatch(setIsLostFoundAddedActionCreator(false));
        // perbarui data lost & found
        dispatch(asyncSetLostFounds());
        onClose();
      }
    }
  }, [isLostFoundAdd]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
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
    
    if (!status) {
      showErrorDialog("Status tidak boleh kosong");
      return;
    }

    setLoading(true);
    dispatch(asyncSetIsLostFoundAdd(title, description, status));
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
                  {/* Mengganti judul */}
                  <h1 className="modal-title fs-5">Tambah Lost & Found</h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Input Judul */}
                  <div className="mb-3">
                    <label className="form-label">Judul</label>
                    <input
                      type="text"
                      onChange={changeTitle}
                      className="form-control"
                    />
                  </div>
                  {/* Input Deskripsi */}
                  <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <textarea
                      onChange={changeDescription}
                      className="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                  {/* Input Status (BARU) */}
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select 
                      onChange={(e) => setStatus(e.target.value)}
                      value={status}
                      className="form-select"
                    >
                      <option value="lost">Barang Hilang</option>
                      <option value="found">Barang Ditemukan</option>
                    </select>
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

export default AddModal;