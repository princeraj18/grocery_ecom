import React, {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import api from "../api/api";

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

          const response =
            await api.get(
              "/vendors/profile",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          if (response.data) {

            setIsAuthenticated(true);
          }

        } catch (error) {

          console.log(error);

          localStorage.removeItem(
            "vendorToken"
          );

          localStorage.removeItem(
            "vendor"
          );

          setIsAuthenticated(false);
        }

        setLoading(false);
      };

    verifyVendor();

  }, []);

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

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