import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useInput from "../../../hooks/useInput";
import {
  asyncSetIsAuthRegister,
  setIsAuthRegisterActionCreator,
} from "../states/action";

function RegisterPage() {
  // Inisialisasi Redux hook
  const dispatch = useDispatch();

  // Mengambil state dari Redux store
  const isAuthRegister = useSelector((state) => state.isAuthRegister);

  // State lokal
  const [loading, setLoading] = useState(false);

  // Hook untuk menangani perubahan input form
  const [name, onChangeName] = useInput("");
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");

  /**
   * useEffect: akan dijalankan setiap kali state `isAuthRegister` berubah.
   * Jika registrasi berhasil (`isAuthRegister === true`), maka loading dihentikan
   * dan status register di-reset agar tidak terjadi pemicu berulang.
   */
  useEffect(() => {
    if (isAuthRegister === true) {
      setLoading(false);
      dispatch(setIsAuthRegisterActionCreator(false));
    }
  }, [isAuthRegister, dispatch]);

  /**
   * Handler submit form registrasi
   * --------------------------------
   * - Mencegah reload halaman (preventDefault)
   * - Mengaktifkan indikator loading
   * - Memicu aksi async untuk registrasi ke server
   */
  async function onSubmitHandler(event) {
    event.preventDefault();
    setLoading(true);
    dispatch(asyncSetIsAuthRegister(name, email, password));
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #e8f0ff, #f5f7ff)",
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
        {/* ================================
            BAGIAN KIRI (Informasi / Branding)
           ================================ */}
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
            Create an Account
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
            Join our Lost & Found community and help others find what they’ve
            lost.
          </p>
        </div>

        {/* ================================
            BAGIAN KANAN (Form Registrasi)
           ================================ */}
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
              Register
            </h3>
            <p className="text-muted" style={{ fontSize: "0.95rem" }}>
              Please fill in your details below
            </p>
          </div>

          {/* Form Registrasi */}
          <form onSubmit={onSubmitHandler}>
            {/* Input: Full Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary">
                Full Name
              </label>
              <input
                type="text"
                onChange={onChangeName}
                className="form-control"
                style={{
                  borderRadius: "10px",
                  padding: "12px",
                  border: "1px solid #ccd3f0",
                  background: "#f9faff",
                }}
                placeholder="Your full name"
                required
              />
            </div>

            {/* Input: Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary">
                Email Address
              </label>
              <input
                type="email"
                onChange={onChangeEmail}
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

            {/* Input: Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">
                Password
              </label>
              <input
                type="password"
                onChange={onChangePassword}
                className="form-control"
                style={{
                  borderRadius: "10px",
                  padding: "12px",
                  border: "1px solid #ccd3f0",
                  background: "#f9faff",
                }}
                placeholder="Create a password"
                required
              />
            </div>

            {/* Terms and Privacy */}
            <div className="text-end mb-4">
              <small className="text-muted">
                By registering, you agree to our{" "}
                <a
                  href="#"
                  style={{
                    color: "#4a5fc1",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Terms & Privacy Policy
                </a>
                .
              </small>
            </div>

            {/* Tombol Submit */}
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
                  Registering...
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
                  Register
                </button>
              )}
            </div>
          </form>

          {/* Link ke halaman login */}
          <div className="text-center mt-4">
            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
              Already have an account?{" "}
              <a
                href="#"
                style={{
                  color: "#4a5fc1",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Sign In here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
