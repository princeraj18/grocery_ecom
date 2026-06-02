import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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

import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../layout/AdminLayout";
import AdminForgotPassword from "../pages/AdminForgotPassword";
import AdminResetPassword from "../pages/AdminResetPassword";
import AddCategory from "../pages/AddCategory";
import AdminVariant from "../pages/AdminVariant";
import Support from "../pages/Support";

export default function AppRoutes() {

  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* REGISTER */}
      <Route
        path="/register"
        element={<Register />}
      />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
<Route path="/admin/reset-password/:token" element={<AdminResetPassword />} />

      {/* ROOT */}
      <Route
        path="/"
        element={
          <Navigate
            to="/admin"
            replace
          />
        }
      />

      {/* ADMIN ROUTES */}
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
      <Route
  path="/admin/users/:id"
  element={
    <ProtectedRoute>

  <UserDetails />
    </ProtectedRoute>


  }
/>

      <Route
        path="/admin/categories/create"
        element={
          <ProtectedRoute>
          <AddCategory/>
          </ProtectedRoute>
        }
      />
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
        path="/admin/vendors"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Vendors />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

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

    </Routes>
  );
}