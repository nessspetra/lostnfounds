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
  const dispatch = useDispatch();

  const isAuthLogin = useSelector((state) => state.isAuthLogin);
  const isProfile = useSelector((state) => state.isProfile);

  const [loading, setLoading] = useState(false);
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");

  useEffect(() => {
    if (isAuthLogin === true) {
      const authToken = apiHelper.getAccessToken();
      if (authToken) {
        dispatch(asyncSetProfile());
      } else {
        setLoading(false);
        dispatch(setIsAuthLoginActionCreator(false));
      }
    }
  }, [isAuthLogin, dispatch]);

  useEffect(() => {
    if (isProfile) {
      setLoading(false);
      dispatch(setIsAuthLoginActionCreator(false));
      dispatch(setIsProfile(false));
    }
  }, [isProfile, dispatch]);

  async function onSubmitHandler(event) {
    event.preventDefault();
    setLoading(true);
    dispatch(asyncSetIsAuthLogin(email, password));
  }

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
        {/* BAGIAN KIRI */}
        <div
          className="d-none d-md-flex flex-column justify-content-center align-items-center text-white"
          style={{
            flex: 1,
            background:
              "linear-gradient(160deg, #4a5fc1 0%, #6a7ffb 100%)",
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

        {/* BAGIAN KANAN */}
        <div
          className="p-5 d-flex flex-column justify-content-center"
          style={{
            flex: 1,
            backgroundColor: "#fff",
          }}
        >
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

          <form onSubmit={onSubmitHandler}>
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
