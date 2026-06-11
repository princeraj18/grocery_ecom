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
import Coupons from "../pages/Coupons";
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
import WishList from "../pages/WishList";
// IMPORT VENDOR ROUTES
import VendorRoutes from "../vendor/routes/VendorRoutes";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Notification from "../pages/Notification";
import UserSupport from "../pages/UserSupport";

const AppRoutes = () => {

  const location = useLocation();

  // HIDE NAVBAR
  const hideNavbarRoutes = [
    "/login",
    "/register",
    "/payment-success",
    "/payment-cancel",
    "/forgot-password",
    "/reset-password",
  ];

  // HIDE NAVBAR ON ALL VENDOR ROUTES
  const isVendorRoute =
    location.pathname.startsWith("/vendor");
const user = JSON.parse(
  localStorage.getItem("user")
);
  const hideNavbar =
    hideNavbarRoutes.includes(
      location.pathname
    ) || isVendorRoute;

 return (
  <div className="min-h-screen bg-inherit text-inherit">
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />

      <Route path="/products" element={<Products />} />

      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />
      <Route
        path="/notification"
        element={<Notification />}
      />

      <Route
        path="/category/:category"
        element={<CategoryProducts />}
      />

      <Route path="/about" element={<AboutUs />} />

      <Route path="/contact" element={<ContactUs />} />

      <Route path="/coupons" element={<Coupons />} />

      {/* AUTH ROUTES */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      {/* PROTECTED ROUTES */}
     <Route
  path="/wishlist"
  element={<WishList />}
/>

<Route
  path="/cart"
  element={<Cart />}
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
        path="/usersupport"
        element={
          <ProtectedRoute>
            <UserSupport />
          </ProtectedRoute>
        }
      />

      {/* PAYMENT */}
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

      {/* REDIRECT */}
      <Route
        path="/edit/:id"
        element={<EditRedirect />}
      />

      {/* VENDOR */}
      <Route
        path="/vendor/*"
        element={<VendorRoutes />}
      />

    </Routes>
  </div>
);
};

export default AppRoutes;

// Redirect component for legacy or shorthand edit URLs
function EditRedirect() {
  const { id } = useParams();
  return <Navigate to={`/vendor/products/edit/${id}`} replace />;
}
