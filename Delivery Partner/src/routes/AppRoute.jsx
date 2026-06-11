import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Components
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

// Import Pages
import Dashboard from '../pages/Dashboard';
import Orders from '../pages/Orders';
import Earnings from '../pages/Earnings';
import Profile from '../pages/Profile';
import DeliveryLogin from '../pages/DeliveryLogin';
import DeliveryRegister from '../pages/DeliveryRegister';
import DeliveryMap
from "../pages/DeliveryMap";
// A Layout Wrapper component for pages that need the Navbar and Sidebar
const ProtectedLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8 bg-inherit">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function AppRoute() {
  // Simulating authentication state (Change to true to test dashboard pages)
  const isAuthenticated = true; 

  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<DeliveryLogin /> } />
        <Route path="/register" element={<DeliveryRegister /> } />

        {/* Dashboard Routes with Shell Layout */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <ProtectedLayout><Dashboard /></ProtectedLayout> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/orders" 
          element={
            isAuthenticated ? <ProtectedLayout><Orders /></ProtectedLayout> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/earnings" 
          element={
            isAuthenticated ? <ProtectedLayout><Earnings /></ProtectedLayout> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/profile" 
          element={
            isAuthenticated ? <ProtectedLayout><Profile /></ProtectedLayout> : <Navigate to="/login" />
          } 
        />

        {/* Catch-all Redirect for unknown URLs */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        <Route
          path="/delivery-map/:orderId"
          element={isAuthenticated ? <ProtectedLayout><DeliveryMap /></ProtectedLayout> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}