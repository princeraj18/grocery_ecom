import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ========================================
// ADMIN PAGES
// ========================================

import Dashboard from "../pages/Dashboard";
import User from "../pages/User";
import Product from "../pages/Product";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CreateProduct from "../pages/CreateProduct";
import Order from "../pages/Order";
import EditProduct from "../pages/EditProduct";
import UserDetails from "../pages/UserDetails";
import Vendors from "../pages/Vendors";
import VendorDetails from "../pages/VendorDetails";
import DeliveryPartnerDetails from "../pages/DeliveryPartnerDetails";
import AddCategory from "../pages/AddCategory";
import AdminVariant from "../pages/AdminVariant";
import Support from "../pages/Support";

// ========================================
// DELIVERY PAGES
// ========================================

import DeliveryDashboard from "../pages/DeliveryDashboard";
import DeliveryEarnings from "../pages/DeliveryEarnings";

// ========================================
// AUTH PAGES
// ========================================

import AdminForgotPassword from "../pages/AdminForgotPassword";
import AdminResetPassword from "../pages/AdminResetPassword";

// ========================================
// LAYOUT + PROTECTED
// ========================================

import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layout/AdminLayout";
import DeliveryPartner from "../pages/DeliveryPartner";
import WithdrawalRequest from "../pages/WithdrawalRequest";

export default function AppRoutes() {

  return (

    <Routes>

      {/* ========================================
          LOGIN
      ======================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* ========================================
          REGISTER
      ======================================== */}

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ========================================
          FORGOT PASSWORD
      ======================================== */}

      <Route
        path="/admin/forgot-password"
        element={<AdminForgotPassword />}
      />

      {/* ========================================
          RESET PASSWORD
      ======================================== */}

      <Route
        path="/admin/reset-password/:token"
        element={<AdminResetPassword />}
      />

      {/* ========================================
          ROOT REDIRECT
      ======================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/admin"
            replace
          />
        }
      />

      {/* ========================================
          ADMIN DASHBOARD
      ======================================== */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ========================================
          USERS
      ======================================== */}

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <User />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ========================================
          USER DETAILS
      ======================================== */}

      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <UserDetails />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
        <Route
          path="/admin/delivery-partners/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <DeliveryPartnerDetails />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

      {/* ========================================
          VENDORS
      ======================================== */}

      <Route
        path="/admin/vendors"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Vendors />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ========================================
          VENDOR DETAILS
      ======================================== */}

      <Route
        path="/admin/vendors/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <VendorDetails />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ========================================
          ORDERS
      ======================================== */}

      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Order />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ========================================
          ADD CATEGORY
      ======================================== */}

      <Route
        path="/admin/categories/create"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AddCategory />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ========================================
          ADD VARIANT
      ======================================== */}

      <Route
        path="/admin/variants/create"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminVariant />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ========================================
          SUPPORT
      ======================================== */}

      <Route
        path="/admin/support"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Support />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
<Route
  path="/admin/delivery-partners"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <DeliveryPartner />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

      <Route
        path="/admin/withdrawal-requests"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <WithdrawalRequest />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      {/* ========================================
          DELIVERY DASHBOARD
      ======================================== */}

      <Route
        path="/delivery/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <DeliveryDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ========================================
          DELIVERY EARNINGS
      ======================================== */}

      <Route
        path="/delivery/earnings"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <DeliveryEarnings />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}