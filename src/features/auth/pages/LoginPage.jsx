import { useDispatch, useSelector } from "react-redux";
import useInput from "../../../hooks/useInput";
import {
  asyncSetIsAuthLogin,
  setIsAuthLoginActionCreator,
} from "../states/action";
import { useEffect, useState } from "react";
import apiHelper from "../../../helpers/apiHelper";
import { asyncSetProfile, setIsProfile } from "../../users/states/action";

function LoginPage() {
  // ============================================================
  // 1. Inisialisasi Hook & State Lokal
  // ============================================================

  const dispatch = useDispatch(); // Hook untuk mengirim aksi Redux

  // Ambil state global dari Redux
  const isAuthLogin = useSelector((state) => state.isAuthLogin);
  const isProfile = useSelector((state) => state.isProfile);

  // State lokal
  const [loading, setLoading] = useState(false);

  // Custom hook untuk input email & password
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");

  // ============================================================
  // 2. useEffect #1: Cek status login saat proses autentikasi
  // ============================================================
  useEffect(() => {
    // Jika status login dari Redux aktif, cek token
    if (isAuthLogin === true) {
      const authToken = apiHelper.getAccessToken();

      // Jika ada token, ambil profil pengguna
      if (authToken) {
        dispatch(asyncSetProfile());
      } else {
        // Jika tidak ada token, hentikan loading dan reset status
        setLoading(false);
        dispatch(setIsAuthLoginActionCreator(false));
      }
    }
  }, [isAuthLogin, dispatch]);

  // ============================================================
  // 3. useEffect #2: Jika profil sudah dimuat, reset status login
  // ============================================================
  useEffect(() => {
    if (isProfile) {
      setLoading(false);
      dispatch(setIsAuthLoginActionCreator(false));
      dispatch(setIsProfile(false));
    }
  }, [isProfile, dispatch]);

  // ============================================================
  // 4. Handler untuk Form Login
  // ============================================================
  /**
   * Menangani submit form login.
   * Mengaktifkan indikator loading dan mengirim aksi Redux
   * untuk memproses autentikasi (asyncSetIsAuthLogin).
   */
  async function onSubmitHandler(event) {
    event.preventDefault();
    setLoading(true);
    dispatch(asyncSetIsAuthLogin(email, password));
  }

  // ============================================================
  // 5. Render Komponen UI
  // ============================================================
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #e3ebff, #f5f7ff)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        className="card shadow-lg overflow-hidden"
        style={{
          display: "flex",
          flexDirection: "row",
          width: "900px",
          maxWidth: "95%",
          borderRadius: "18px",
          border: "none",
        }}
      >
        {/* ============================================================
            BAGIAN KIRI - Informasi / Gambar (Desktop Only)
           ============================================================ */}
        <div
          className="d-none d-md-flex flex-column justify-content-center align-items-center text-white"
          style={{
            flex: 1,
            background: "linear-gradient(160deg, #4a5fc1 0%, #6a7ffb 100%)",
            padding: "40px",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              marginBottom: "1rem",
              letterSpacing: "1px",
            }}
          >
            Welcome Back!
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.6",
              maxWidth: "300px",
              textAlign: "center",
              opacity: 0.9,
            }}
          >
            Find or report lost items easily through our Lost & Found system.
          </p>
        </div>

        {/* ============================================================
            BAGIAN KANAN - Form Login
           ============================================================ */}
        <div
          className="p-5 d-flex flex-column justify-content-center"
          style={{
            flex: 1,
            backgroundColor: "#fff",
          }}
        >
          {/* Header Form */}
          <div className="text-center mb-4">
            <h3
              style={{
                fontWeight: "700",
                color: "#1a1e36",
                marginBottom: "0.3rem",
              }}
            >
              Sign In
            </h3>
            <p className="text-muted" style={{ fontSize: "0.95rem" }}>
              Please log in to your account
            </p>
          </div>

          {/* ============================================================
              FORM LOGIN
             ============================================================ */}
          <form onSubmit={onSubmitHandler}>
            {/* Input Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary">
                Email Address
              </label>
              <input
                type="email"
                onChange={onEmailChange}
                className="form-control"
                style={{
                  borderRadius: "10px",
                  padding: "12px",
                  border: "1px solid #ccd3f0",
                  background: "#f9faff",
                }}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Input Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">
                Password
              </label>
              <input
                type="password"
                onChange={onPasswordChange}
                className="form-control"
                style={{
                  borderRadius: "10px",
                  padding: "12px",
                  border: "1px solid #ccd3f0",
                  background: "#f9faff",
                }}
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Lupa Password */}
            <div className="text-end mb-4">
              <a
                href="#"
                className="text-decoration-none"
                style={{
                  color: "#4a5fc1",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                Forgot password?
              </a>
            </div>

            {/* Tombol Login */}
            <div>
              {loading ? (
                <button
                  className="btn w-100"
                  style={{
                    backgroundColor: "#4a5fc1",
                    borderRadius: "10px",
                    color: "#fff",
                    padding: "10px",
                  }}
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Signing in...
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn w-100"
                  style={{
                    backgroundColor: "#4a5fc1",
                    borderRadius: "10px",
                    color: "#fff",
                    padding: "10px",
                    fontWeight: "500",
                    transition: "0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#3b4da8")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#4a5fc1")
                  }
                >
                  Sign In
                </button>
              )}
            </div>
          </form>

          {/* ============================================================
              FOOTER LINK - Register
             ============================================================ */}
          <div className="text-center mt-4">
            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
              Don't have an account?{" "}
              <a
                href="#"
                style={{
                  color: "#4a5fc1",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
