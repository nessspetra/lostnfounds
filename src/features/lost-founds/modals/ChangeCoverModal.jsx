/**
 * @file ChangeCoverModal.jsx
 * @description Komponen modal untuk mengubah cover (gambar) dari entri Lost & Found.
 * Komponen ini mendukung validasi tipe dan ukuran file, serta mengupdate Redux state setelah upload berhasil.
 */

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

/**
 * Komponen modal untuk mengganti cover Lost & Found.
 * @param {boolean} show - Menentukan apakah modal ditampilkan.
 * @param {function} onClose - Fungsi untuk menutup modal.
 * @param {object} lostFound - Data Lost & Found yang sedang diedit (berisi ID dan informasi item).
 */
function ChangeCoverModal({ show, onClose, lostFound }) {
  const dispatch = useDispatch();

  // ======== REDUX STATE ========
  const isLostFoundChangeCover = useSelector(
    (state) => state.isLostFoundChangeCover
  );
  const isLostFoundChangedCover = useSelector(
    (state) => state.isLostFoundChangedCover
  );

  // ======== LOCAL STATE ========
  const [loading, setLoading] = useState(false); // Menandakan proses upload sedang berjalan
  const [fileCover, setFileCover] = useState(null); // File gambar baru yang dipilih

  // ======== EFFECT: Kontrol scroll body saat modal terbuka ========
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
  }, [show]);

  // ======== EFFECT: Pemantauan proses perubahan cover ========
  useEffect(() => {
    if (isLostFoundChangeCover) {
      dispatch(setIsLostFoundChangeCoverActionCreator(false));

      if (isLostFoundChangedCover) {
        // Jika cover berhasil diubah
        dispatch(setIsLostFoundChangedCoverActionCreator(false));
        setLoading(false);

        // Refresh data detail Lost & Found
        dispatch(asyncSetLostFound(lostFound.id));

        // Tutup modal setelah sukses
        onClose();
      } else {
        // Jika gagal atau tidak ada perubahan
        setLoading(false);
      }
    }
  }, [
    isLostFoundChangeCover,
    isLostFoundChangedCover,
    lostFound?.id,
    dispatch,
    onClose,
  ]);

  // ======== HANDLER: Validasi dan kirim perubahan ========
  function handleSave() {
    // Validasi file wajib
    if (!fileCover) {
      showErrorDialog("Pilih file cover terlebih dahulu!");
      return;
    }

    // Validasi tipe file (hanya gambar)
    if (!fileCover.type.startsWith("image/")) {
      showErrorDialog("Hanya file gambar yang diperbolehkan!");
      setFileCover(null);
      return;
    }

    // Validasi ukuran maksimal 5MB
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (fileCover.size > MAX_FILE_SIZE) {
      showErrorDialog("Ukuran file terlalu besar. Maksimal 5MB.");
      setFileCover(null);
      return;
    }

    // Proses upload
    setLoading(true);
    dispatch(asyncSetIsLostFoundChangeCover(lostFound.id, fileCover));
  }

  // Jika tidak ada data lostFound, hentikan render
  if (!lostFound) return null;

  // ======== RENDER MODAL ========
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* BACKDROP (lapisan gelap di belakang modal) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="modal-backdrop"
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
                  <h1 className="modal-title fs-5">Ubah Cover Lost & Found</h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                  ></button>
                </div>

                {/* BODY */}
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="lfCoverInput" className="form-label">
                      Pilih Cover Baru
                    </label>
                    <input
                      type="file"
                      id="lfCoverInput"
                      name="cover"
                      accept="image/*"
                      className="form-control"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFileCover(file);
                      }}
                      disabled={loading}
                    />
                    {fileCover && (
                      <small className="text-muted">
                        File dipilih: {fileCover.name}
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

export default ChangeCoverModal;
