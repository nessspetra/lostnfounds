import { NavLink } from "react-router-dom";

function SidebarComponent() {
  // Ambil path yang sedang aktif

  return (
    <div className="sidebar d-flex flex-column flex-shrink-0 p-3">
      <ul className="nav nav-pills flex-column mb-auto mt-3">
        <li className="nav-item">
          <NavLink
            to="/"
            className={
              location.pathname == "/" ? "nav-link active" : "nav-link"
            }
          >
            <i className="bi bi-house"></i>
            Beranda
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default SidebarComponent;
