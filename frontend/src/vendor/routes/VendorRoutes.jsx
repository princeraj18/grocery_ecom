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
<Route
          path="/vendor/dashboard"
          element={
            <VendorProtectedRoute>
              <Dashboard />
            </VendorProtectedRoute>
          }
        />

        <Route
          path="/vendor/products"
          element={
            <VendorProtectedRoute>
              <Products />
            </VendorProtectedRoute>
          }
        />

        <Route
          path="/vendor/products/create"
          element={
            <VendorProtectedRoute>
              <AddProduct />
            </VendorProtectedRoute>
          }
        />

        <Route
          path="/vendor/products/edit/:id"
          element={
            <VendorProtectedRoute>
              <EditProduct />
            </VendorProtectedRoute>
          }
        />

        <Route
          path="/vendor/orders"
          element={
            <VendorProtectedRoute>
              <Orders />
            </VendorProtectedRoute>
          }
        />

        <Route
          path="/vendor/coupons"
          element={
            <VendorProtectedRoute>
              <Coupons />
            </VendorProtectedRoute>
          }
        />

        <Route
          path="/vendor/analytics"
          element={
            <VendorProtectedRoute>
              <Analytics />
            </VendorProtectedRoute>
          }
        />

        <Route
          path="/vendor/reviews"
          element={
            <VendorProtectedRoute>
              <Reviews />
            </VendorProtectedRoute>
          }
        />

        <Route
          path="/vendor/profile"
          element={
            <VendorProtectedRoute>
              <Profile />
            </VendorProtectedRoute>
          }
        />
<Route
  path="/vendor/login"
  element={<VendorLogin />}
/>

<Route
  path="/vendor/register"
  element={<VendorRegister />}
/>
    </Routes>
  );
}