function NavbarComponent({ profile, handleLogout }) {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-primary fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: "36px", height: "36px" }}
          />
          Lost & Founds
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a
                className="nav-link text-white dropdown-toggle"
                href="#"
                id="profileDropdown"
                role="button"
                data-bs-toggle="dropdown"
              >
                <img
                  src="/user.png"
                  alt="Profile"
                  className="profile-img me-1"
                />
                {profile.name}
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-user me-2"></i>Profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-cog me-2"></i>Settings
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right"></i> Logout
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
