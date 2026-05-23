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

import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../layout/AdminLayout";

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
        path="/admin/products"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Product />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products/create"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <CreateProduct />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products/edit/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <EditProduct />
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