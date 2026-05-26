import Navbar from "./components/Navbar";
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
  ];

  // CHECK IF CURRENT ROUTE IS VENDOR
  const isVendorRoute =
    location.pathname.startsWith("/vendor");

  // CHECK IF NAVBAR SHOULD HIDE
  const hideLayout =
    hiddenRoutes.includes(location.pathname) ||
    isVendorRoute;

  return (
    <>

      {/* NAVBAR */}
      {!hideLayout && <Navbar />}

      {/* ROUTES */}
      <AppRoutes />

      {/* FOOTER */}
      {!hideLayout && <Footer />}

    </>
  );
}

export default App;