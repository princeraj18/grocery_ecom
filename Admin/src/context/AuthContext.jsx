/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext =
  createContext();

export function AuthProvider({
  children,
}) {

  const getStoredAdmin = () => {

    try {

      const admin =
        localStorage.getItem("admin");

      if (
        !admin ||
        admin === "undefined"
      ) {
        return null;
      }

      return JSON.parse(admin);

    } catch (error) {

      console.log(error);

      return null;
    }
  };

  const [user, setUser] =
    useState(getStoredAdmin());

  // LOGIN
  const login = (data) => {

    setUser(data);

    localStorage.setItem(
      "admin",
      JSON.stringify(data)
    );
  };

  // LOGOUT
  const logout = () => {

    setUser(null);

    localStorage.removeItem(
      "admin"
    );

    localStorage.removeItem(
      "adminToken"
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);