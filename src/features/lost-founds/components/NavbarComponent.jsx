import { Link } from "react-router-dom";

function NavbarComponent({ profile, handleLogout }) {
  // Jika pengguna tidak memiliki foto profil, gunakan default image.
  const photoUrl = profile.photo || "/user.png";

  return (
    <nav
      className="navbar navbar-expand-md shadow-sm fixed-top py-2"
      style={{
        backgroundColor: "#e9f0ff",
        borderBottom: "1px solid #c5d3ff",
      }}
    >
      <div className="container-fluid px-4">
        {/* ============================================================
           Brand Section
           ------------------------------------------------------------
           Menampilkan logo dan nama aplikasi, terhubung ke halaman utama.
           ============================================================ */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2 fw-semibold text-primary"
          to="/"
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
          <span>Lost & Founds</span>
        </Link>

        {/* ============================================================
           Toggle Button (Mobile)
           ------------------------------------------------------------
           Menampilkan tombol toggle untuk collapse menu di layar kecil.
           ============================================================ */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ============================================================
           Navbar Menu (Right Side)
           ------------------------------------------------------------
           Menampilkan dropdown profil pengguna.
           ============================================================ */}
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Dropdown Profil */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center text-dark"
                href="#"
                id="profileDropdown"
                role="button"
                data-bs-toggle="dropdown"
              >
                {/* Foto Profil */}
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="rounded-circle me-2"
                  style={{
                    width: "34px",
                    height: "34px",
                    border: "2px solid #007bff",
                    objectFit: "cover",
                  }}
                />
                <span className="fw-medium">{profile.name}</span>
              </a>

              {/* ============================================================
                 Dropdown Menu
                 ------------------------------------------------------------
                 Berisi informasi profil singkat dan beberapa menu navigasi.
                 ============================================================ */}
              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                {/* Info Header */}
                <li
                  className="px-3 py-2 text-muted small"
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <div className="fw-semibold">{profile.name}</div>
                  <div style={{ fontSize: "0.85em" }}>
                    {profile.role || "User"}
                  </div>
                </li>

                {/* Menu Items */}
                <li>
                  <Link className="dropdown-item" to="/profile">
                    <i className="bi bi-person me-2"></i>Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/settings">
                    <i className="bi bi-gear me-2"></i>Settings
                  </Link>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                {/* Logout Button */}
                <li>
                  <button
                    type="button"
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavbarComponent;
