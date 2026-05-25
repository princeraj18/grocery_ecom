import {
  Routes,
  Route,
  useLocation,
  useParams,
  Navigate,
} from "react-router-dom";

import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Orders from "../pages/Orders";
import AboutUs from "../pages/About";
import ContactUs from "../pages/Contact";
import PaymentSuccess from "../pages/PaymentSuccess";
import CategoryProducts from "../pages/CategoryProducts";

import ProtectedRoute from "../components/ProtectedRoutes";
import Navbar from "../components/Navbar";

// IMPORT VENDOR ROUTES
import VendorRoutes from "../vendor/routes/VendorRoutes";

const AppRoutes = () => {

  const location = useLocation();

  // HIDE NAVBAR
  const hideNavbarRoutes = [
    "/login",
    "/register",
    "/payment-success",
    "/payment-cancel",
  ];

  // HIDE NAVBAR ON ALL VENDOR ROUTES
  const isVendorRoute =
    location.pathname.startsWith("/vendor");

  const hideNavbar =
    hideNavbarRoutes.includes(
      location.pathname
    ) || isVendorRoute;

  return (
    <>
      {/* {!hideNavbar && <Navbar />} */}

      <Routes>

        {/* USER ROUTES */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/category/:category"
          element={
            <ProtectedRoute>
              <CategoryProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutUs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <ContactUs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />

        <Route
          path="/payment-cancel"
          element={
            <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
              Payment Cancelled
            </div>
          }
        />

        {/* Legacy/edit shortcut -> redirect to vendor edit */}
        <Route path="/edit/:id" element={<EditRedirect />} />

        {/* ====================== */}
        {/* VENDOR ROUTES */}
        {/* ====================== */}

        <Route
          path="/vendor/*"
          element={<VendorRoutes />}
        />

      </Routes>
    </>
  );
};

export default AppRoutes;

// Redirect component for legacy or shorthand edit URLs
function EditRedirect() {
  const { id } = useParams();
  return <Navigate to={`/vendor/products/edit/${id}`} replace />;
}