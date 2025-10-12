import { NavLink, useLocation } from "react-router-dom";

function SidebarComponent() {
  // Hook untuk mendapatkan informasi path aktif saat ini
  const location = useLocation();

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3"
      style={{
        width: "250px",
        backgroundColor: "#f0f4ff",
        borderRight: "1px solid #d0dbff",
        color: "#1a1e36",
      }}
    >
      {/* ============================================================
         Navigasi Utama
         ------------------------------------------------------------
         Terdiri dari daftar menu dengan ikon Bootstrap Icons.
         Warna dan gaya berubah sesuai status aktif (isActive).
         ============================================================ */}
      <ul className="nav nav-pills flex-column mb-auto mt-3">
        {/* === Dashboard === */}
        <li className="nav-item mb-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active shadow-sm" : ""}`
            }
            style={({ isActive }) => ({
              color: isActive ? "#fff" : "#1a1e36",
              backgroundColor: isActive ? "#4c6fff" : "transparent",
              borderRadius: "10px",
              fontWeight: 500,
            })}
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </NavLink>
        </li>

        {/* === Profil === */}
        <li className="nav-item mb-2">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active shadow-sm" : ""}`
            }
            style={({ isActive }) => ({
              color: isActive ? "#fff" : "#1a1e36",
              backgroundColor: isActive ? "#4c6fff" : "transparent",
              borderRadius: "10px",
              fontWeight: 500,
            })}
          >
            <i className="bi bi-person me-2"></i>
            Profil Saya
          </NavLink>
        </li>
      </ul>

      {/* ============================================================
         Footer Sidebar
         ------------------------------------------------------------
         Menampilkan informasi versi aplikasi pada bagian bawah sidebar.
         ============================================================ */}
      <div
        className="mt-auto pt-3 border-top"
        style={{ borderTop: "1px solid #d0dbff" }}
      >
        <p className="text-muted small mb-0">Version 1.0.0</p>
      </div>
    </div>
  );
}

export default SidebarComponent;
