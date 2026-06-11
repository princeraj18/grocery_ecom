import Navbar from "./components/Navbar";
import LayoutWrapper from "./components/LayoutWrapper";
import Footer from "./components/Footer";

import AppRoutes from "./routes/AppRoutes";

import { useLocation } from "react-router-dom";

function App() {

  const location = useLocation();

  // =========================
  // HIDE NAVBAR/FOOTER ROUTES
  // =========================
  const hiddenRoutes = [
    "/login",
    "/register",
    "/payment-success",
    "/payment-cancel",
    "/forgot-password",
    "/reset-password",
  ];

  // CHECK IF CURRENT ROUTE IS VENDOR
  const isVendorRoute =
    location.pathname.startsWith("/vendor");

  // CHECK IF NAVBAR SHOULD HIDE
  const hideLayout =
    hiddenRoutes.some(route => location.pathname === route || location.pathname.startsWith(route + "/")) ||
    isVendorRoute;

  return (
    <LayoutWrapper>

      {/* NAVBAR */}
      {!hideLayout && <Navbar />}

      {/* ROUTES */}
      <AppRoutes />

      {/* FOOTER */}
      {!hideLayout && <Footer />}

    </LayoutWrapper>
  );
}

export default App;