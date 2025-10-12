import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import apiHelper from "../../../helpers/apiHelper";
import { asyncSetProfile, setIsProfile } from "../../users/states/action";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

function LostFoundLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ambil data dari state Redux
  const profile = useSelector((state) => state.profile);
  const isProfile = useSelector((state) => state.isProfile);

  // ---------------------------------------------------------------------------
  // useEffect 1:
  // Mengecek apakah token autentikasi tersedia di local storage.
  // Jika ada, ambil data profil pengguna melalui asyncSetProfile().
  // Jika tidak ada, arahkan pengguna ke halaman login.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const authToken = apiHelper.getAccessToken();
    if (authToken) {
      dispatch(asyncSetProfile());
    } else {
      navigate("/auth/login");
    }
  }, [dispatch, navigate]);

  // ---------------------------------------------------------------------------
  // useEffect 2:
  // Mengecek apakah profil sudah diupdate.
  // Jika flag `isProfile` aktif namun data `profile` kosong,
  // maka berarti token tidak valid — hapus token dan arahkan ke login.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isProfile) {
      dispatch(setIsProfile(false));
      if (!profile) {
        apiHelper.putAccessToken("");
        navigate("/auth/login");
      }
    }
  }, [isProfile, profile, dispatch, navigate]);

  // ---------------------------------------------------------------------------
  // Fungsi Logout:
  // Menghapus token dari penyimpanan dan mengarahkan ke halaman login.
  // ---------------------------------------------------------------------------
  function handleLogout() {
    apiHelper.putAccessToken("");
    navigate("/auth/login");
  }

  // Jika profil belum dimuat, jangan render apa pun (hindari error akses null)
  if (!profile) return null;

  // ---------------------------------------------------------------------------
  // Tampilan Layout Utama
  // Terdiri dari Navbar (atas), Sidebar (kiri), dan Konten Utama (kanan).
  // ---------------------------------------------------------------------------
  return (
    <div
      style={{
        backgroundColor: "#f7f8fc",
        minHeight: "100vh",
        color: "#333",
      }}
    >
      {/* Navbar */}
      <NavbarComponent profile={profile} handleLogout={handleLogout} />

      {/* Sidebar + Konten utama */}
      <div
        className="d-flex"
        style={{
          marginTop: "60px",
          minHeight: "calc(100vh - 60px)",
        }}
      >
        {/* Sidebar di sisi kiri */}
        <SidebarComponent />

        {/* Area konten utama */}
        <div
          className="flex-grow-1 p-4"
          style={{
            overflowY: "auto",
            backgroundColor: "#ffffff",
            borderLeft: "1px solid #e2e6f3",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default LostFoundLayout;
