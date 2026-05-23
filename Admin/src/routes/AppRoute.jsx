import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import User from "../pages/User";
import Product from "../pages/Product";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CreateProduct from "../pages/CreateProduct";
import Order from "../pages/Order";
import EditProduct from "../pages/EditProduct";

import ProtectedRoute from "./ProtectedRoute";

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

      {/* REDIRECTS */}
      <Route
        path="/"
        element={
          <Navigate
            to="/admin"
            replace
          />
        }
      />

      <Route
        path="/products"
        element={
          <Navigate
            to="/admin/products"
            replace
          />
        }
      />

      <Route
        path="/products/create"
        element={
          <Navigate
            to="/admin/products/create"
            replace
          />
        }
      />

      <Route
        path="/products/edit/:id"
        element={
          <Navigate
            to="/admin/products"
            replace
          />
        }
      />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* USERS */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <User />
          </ProtectedRoute>
        }
      />

      {/* PRODUCTS */}
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        }
      />

      {/* CREATE PRODUCT */}
      <Route
        path="/admin/products/create"
        element={
          <ProtectedRoute>
            <CreateProduct />
          </ProtectedRoute>
        }
      />

      {/* EDIT PRODUCT */}
      <Route
        path="/admin/products/edit/:id"
        element={
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        }
      />

      {/* ORDERS */}
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}