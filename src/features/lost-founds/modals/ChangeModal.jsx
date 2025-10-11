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

  const isLostFoundChange = useSelector((state) => state.isLostFoundChange);
  const isLostFoundChanged = useSelector((state) => state.isLostFoundChanged);
  const lostFound = useSelector((state) => state.lostFound);

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("lost");
  const [isCompleted, setIsCompleted] = useState(false); // Status penyelesaian dipertahankan

  useEffect(() => {
    if (lostFoundId) {
      dispatch(asyncSetLostFound(lostFoundId));
    }
  }, [lostFoundId, dispatch]);

  useEffect(() => {
    if (lostFound) {
      setTitle(lostFound.title);
      setDescription(lostFound.description);
      setStatus(lostFound.status);
      setIsCompleted(lostFound.is_completed); // Memuat nilai is_completed dari data
    }
  }, [lostFound]);

useEffect(() => {
    if (isLostFoundChange) {
      setLoading(false);
      dispatch(setIsLostFoundChangeActionCreator(false));
      if (isLostFoundChanged) {
        dispatch(setIsLostFoundChangedActionCreator(false));
        dispatch(asyncSetLostFound(lostFoundId)); 
         dispatch(asyncSetLostFounds({ is_me: 1, limit: 1000 })); 
        
        onClose();
      }
    }
}, [isLostFoundChange, isLostFoundChanged, dispatch, lostFoundId, onClose]);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
  }, [show]);

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
    dispatch(
      asyncUpdateLostFound(
        lostFoundId,
        title,
        description,
        status,
        isCompleted // Mengirim status penyelesaian
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
                  {/* Judul */}
                  <div className="mb-3">
                    <label htmlFor="lfChangeTitle" className="form-label">
                      Judul
                    </label>
                    <input
                      type="text"
                      id="lfChangeTitle" // ID UNIK
                      name="lfChangeTitle" // NAME UNIK
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  {/* Status Barang Lost/Found */}
                  <div className="mb-3">
                    <label htmlFor="lfChangeStatus" className="form-label">
                      Status Barang
                    </label>
                    <select
                      id="lfChangeStatus" // ID UNIK
                      name="lfChangeStatus" // NAME UNIK
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="lost">Hilang</option>
                      <option value="found">Ditemukan</option>
                    </select>
                  </div>

                  {/* Deskripsi */}
                  <div className="mb-3">
                    <label htmlFor="lfChangeDescription" className="form-label">
                      Deskripsi
                    </label>
                    <textarea
                      id="lfChangeDescription" // ID UNIK
                      name="lfChangeDescription" // NAME UNIK
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