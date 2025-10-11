import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import apiHelper from "../../../helpers/apiHelper";
import { asyncSetProfile, setIsProfile } from "../../users/states/action";
import { useEffect } from "react";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

function LostFoundLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.profile);
  const isProfile = useSelector((state) => state.isProfile);

  useEffect(() => {
    const authToken = apiHelper.getAccessToken();
    if (authToken) {
      dispatch(asyncSetProfile());
    } else {
      navigate("/auth/login");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (isProfile) {
      dispatch(setIsProfile(false));
      if (!profile) {
        apiHelper.putAccessToken("");
        navigate("/auth/login");
      }
    }
  }, [isProfile, profile, dispatch, navigate]);

  function handleLogout() {
    apiHelper.putAccessToken("");
    navigate("/auth/login");
  }

  if (!profile) return null;

  return (
    <div style={{ backgroundColor: "#f7f8fc", minHeight: "100vh", color: "#333" }}>
      {/* Navbar */}
      <NavbarComponent profile={profile} handleLogout={handleLogout} />

      {/* Sidebar + Content */}
      <div
        className="d-flex"
        style={{
          marginTop: "60px",
          minHeight: "calc(100vh - 60px)",
        }}
      >
        {/* Sidebar */}
        <SidebarComponent />

        {/* Main content */}
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
