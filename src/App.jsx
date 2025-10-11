import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const AuthLayout = lazy(() => import("./features/auth/layouts/AuthLayout"));
const RegisterPage = lazy(() => import("./features/auth/pages/RegisterPage"));
const HomePage = lazy(() => import("./features/lost-founds/pages/HomePage"));
const DetailPage = lazy(() => import("./features/lost-founds/pages/DetailPage"));
const LostFoundsLayout = lazy(() => import("./features/lost-founds/layouts/LostFoundsLayout"));
const ProfilePage = lazy(() => import("./features/users/pages/ProfilePage"));


function App() {
  return (
    <Suspense
      fallback={
        <div className="mt-5 text-center">
          <div className="mb-3">
            <img
              src="/logo.png"
              alt="logo"
              style={{ width: "126px", height: "126px" }}
            />
          </div>
          <div
            className="spinner-border text-primary"
            style={{ width: "48px", height: "48px" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    >
      <Routes>
        {/* Auth */}
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        
        {/* Lost & Founds (Main Layout) */}
        <Route path="/" element={<LostFoundsLayout />}>
          <Route index element={<HomePage />} />
          
          {/* CATATAN: Ubah path params dari :lostfoundsId ke :lostFoundId (lebih umum) */}
          <Route path="lost-founds/:lostFoundId" element={<DetailPage />} />
          

          <Route path="profile" element={<ProfilePage />} />

        </Route>
      </Routes>
    </Suspense> 
  );
}

export default App;