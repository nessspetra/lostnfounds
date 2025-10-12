
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import apiHelper from "../../../helpers/apiHelper";
import { asyncSetProfile, setIsProfile } from "../../users/states/action";
import { useEffect } from "react";

function AuthLayout() {
  // ============================================================
  // Hook & State Management
  // ============================================================

  const location = useLocation(); // Mendapatkan path URL saat ini
  const dispatch = useDispatch(); // Mengirim aksi ke Redux store
  const navigate = useNavigate(); // Navigasi antar halaman

  // Mengambil data profil dan status profil dari state Redux
  const profile = useSelector((state) => state.profile);
  const isProfile = useSelector((state) => state.isProfile);

  // ============================================================
  // 1. Cek apakah pengguna sudah login saat komponen pertama kali dimuat
  // ============================================================
  useEffect(() => {
    const authToken = apiHelper.getAccessToken();
    if (authToken) {
      // Jika ada token, ambil data profil pengguna dari server
      dispatch(asyncSetProfile());
    }
    // Hanya dijalankan sekali saat komponen dimount
  }, [dispatch]);

  // ============================================================
  // 2. Jika pengguna sudah login, arahkan ke halaman utama
  // ============================================================
  useEffect(() => {
    if (isProfile) {
      // Reset flag untuk mencegah redirect berulang
      dispatch(setIsProfile(false));

      // Jika profil sudah ada di state, arahkan ke halaman utama
      if (profile) {
        navigate("/");
      }
    }
  }, [isProfile, profile, dispatch, navigate]);

  // ============================================================
  // 3. Render UI Layout Autentikasi
  // ============================================================
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-6 col-sm-8">
          <div className="card mt-5">
            {/* Header Card */}
            <div className="card-header text-center pb-0">
              {/* Logo Aplikasi */}
              <img
                src="/logo.png"
                alt="Logo"
                style={{ width: "64px", height: "64px" }}
              />

              {/* Tab Navigasi: Masuk / Daftar */}
              <ul className="nav nav-tabs mt-2">
                {/* Tab Masuk */}
                <li className="nav-item">
                  <NavLink
                    to="/auth/login"
                    className={`nav-link ${
                      location.pathname === "/auth/login" ? "active" : ""
                    }`}
                    aria-current="page"
                  >
                    Masuk
                  </NavLink>
                </li>

                {/* Tab Daftar */}
                <li className="nav-item">
                  <NavLink
                    to="/auth/register"
                    className={`nav-link ${
                      location.pathname === "/auth/register" ? "active" : ""
                    }`}
                  >
                    Daftar
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Konten Dinamis (Outlet menampilkan Login/Register Page) */}
            <div className="card-body">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
