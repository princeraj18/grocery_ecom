import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AppRoutes from "./routes/AppRoutes";

import { useLocation } from "react-router-dom";

function App() {

  const location = useLocation();

  // CHECK IF CURRENT ROUTE IS VENDOR
  const isVendorRoute =
    location.pathname.startsWith("/vendor");

  return (
    <>

      {/* HIDE USER NAVBAR ON VENDOR ROUTES */}
      {!isVendorRoute && <Navbar />}

      <AppRoutes />

      {/* OPTIONAL:
         HIDE FOOTER ALSO ON VENDOR ROUTES
      */}
      {!isVendorRoute && <Footer />}

    </>
  );
}

export default App;