import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncSetIsLostFoundChangeCover,
  asyncSetLostFound,
  setIsLostFoundChangeCoverActionCreator,
  setIsLostFoundChangedCoverActionCreator,
} from "../states/action";

function ChangeCoverModal({ show, onClose, lostFound }) {
  const dispatch = useDispatch();

  const isLostFoundChangeCover = useSelector(
    (state) => state.isLostFoundChangeCover
  );
  const isLostFoundChangedCover = useSelector(
    (state) => state.isLostFoundChangedCover
  );

  const [loading, setLoading] = useState(false);
  const [fileCover, setFileCover] = useState(null);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
  }, [show]);

  useEffect(() => {
    if (isLostFoundChangeCover) {
      dispatch(setIsLostFoundChangeCoverActionCreator(false));
      if (isLostFoundChangedCover) {
        dispatch(setIsLostFoundChangedCoverActionCreator(false));
        setLoading(false);
        dispatch(asyncSetLostFound(lostFound.id));
        onClose();
      } else {
        setLoading(false);
      }
    }
  }, [isLostFoundChangeCover, isLostFoundChangedCover, lostFound?.id, dispatch, onClose]);

  function handleSave() {
    if (!fileCover) {
      showErrorDialog("Pilih file cover terlebih dahulu!");
      return;
    }

    if (!fileCover.type.startsWith("image/")) {
      showErrorDialog("Hanya file gambar yang diperbolehkan!");
      setFileCover(null);
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (fileCover.size > MAX_FILE_SIZE) {
      showErrorDialog("Ukuran file terlalu besar. Maksimal 5MB");
      setFileCover(null);
      return;
    }

    setLoading(true);
    dispatch(asyncSetIsLostFoundChangeCover(lostFound.id, fileCover));
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
                  <h1 className="modal-title fs-5">Ubah Cover Lost & Found</h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    {/* PERBAIKAN: Tambahkan htmlFor */}
                    <label htmlFor="lfCoverInput" className="form-label">Pilih Cover</label>
                    <input
                      type="file"
                      id="lfCoverInput" // PERBAIKAN: Tambahkan id
                      name="cover" // PERBAIKAN: Tambahkan name
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFileCover(file);
                        }
                      }}
                      className="form-control"
                    />
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

export default ChangeCoverModal;