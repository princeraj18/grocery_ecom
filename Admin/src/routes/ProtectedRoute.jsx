import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  const token =
    localStorage.getItem("adminToken");

  let admin = null;

  try {

    const storedAdmin =
      localStorage.getItem("admin");

    if (
      storedAdmin &&
      storedAdmin !== "undefined"
    ) {
      admin = JSON.parse(storedAdmin);
    }

  } catch (error) {

    console.log(
      "Admin Parse Error:",
      error
    );

    admin = null;
  }

  // NOT LOGGED IN
  if (!token || !admin) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}