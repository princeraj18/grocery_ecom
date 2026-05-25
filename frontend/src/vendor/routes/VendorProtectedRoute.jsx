import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

export default function VendorProtectedRoute({
  children,
}) {

  const [loading, setLoading] =
    useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  useEffect(() => {

    const verifyVendor =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "vendorToken"
            );

          if (!token) {

            setIsAuthenticated(false);

            setLoading(false);

            return;
          }

          // VERIFY TOKEN FROM BACKEND
          await api.get(
            "/vendors/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setIsAuthenticated(true);

        } catch (error) {

          console.log(error);

          localStorage.removeItem(
            "vendorToken"
          );

          setIsAuthenticated(false);
        }

        setLoading(false);
      };

    verifyVendor();

  }, []);

  // LOADING SCREEN
  if (loading) {

    return (
      <div className="flex items-center justify-center min-h-screen text-2xl font-bold">
        Loading...
      </div>
    );
  }

  // REDIRECT TO LOGIN
  if (!isAuthenticated) {

    return (
      <Navigate
        to="/vendor/login"
        replace
      />
    );
  }

  return children;
}