import React from "react";

import {
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import AddProduct from "../pages/AddProduct";
import EditProduct from "../pages/EditProduct";
import Orders from "../pages/Orders";
import Coupons from "../pages/Coupons";
import Analytics from "../pages/Analytics";
import Reviews from "../pages/Reviews";
import Profile from "../pages/Profile";
import VendorLogin from "../pages/VendorLogin";
import VendorRegister from "../pages/VendorRegister";

import VendorProtectedRoute from "./VendorProtectedRoute";

export default function VendorRoutes() {

  return (

    <Routes>

      {/* LOGIN */}
      <Route
        path="login"
        element={<VendorLogin />}
      />

      {/* REGISTER */}
      <Route
        path="register"
        element={<VendorRegister />}
      />

      {/* DASHBOARD */}
      <Route
        path="dashboard"
        element={
          <VendorProtectedRoute>
            <Dashboard />
          </VendorProtectedRoute>
        }
      />

      {/* PRODUCTS */}
      <Route
        path="products"
        element={
          <VendorProtectedRoute>
            <Products />
          </VendorProtectedRoute>
        }
      />

      {/* ADD PRODUCT */}
      <Route
        path="products/create"
        element={
          <VendorProtectedRoute>
            <AddProduct />
          </VendorProtectedRoute>
        }
      />

      {/* EDIT PRODUCT */}
      <Route
        path="products/edit/:id"
        element={
          <VendorProtectedRoute>
            <EditProduct />
          </VendorProtectedRoute>
        }
      />

      {/* ORDERS */}
      <Route
        path="orders"
        element={
          <VendorProtectedRoute>
            <Orders />
          </VendorProtectedRoute>
        }
      />

      {/* COUPONS */}
      <Route
        path="coupons"
        element={
          <VendorProtectedRoute>
            <Coupons />
          </VendorProtectedRoute>
        }
      />

      {/* ANALYTICS */}
      <Route
        path="analytics"
        element={
          <VendorProtectedRoute>
            <Analytics />
          </VendorProtectedRoute>
        }
      />

      {/* REVIEWS */}
      <Route
        path="reviews"
        element={
          <VendorProtectedRoute>
            <Reviews />
          </VendorProtectedRoute>
        }
      />

      {/* PROFILE */}
      <Route
        path="profile"
        element={
          <VendorProtectedRoute>
            <Profile />
          </VendorProtectedRoute>
        }
      />

    </Routes>
  );
}