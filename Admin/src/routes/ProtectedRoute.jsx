import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token")
  const admin = JSON.parse(localStorage.getItem("admin") || "null")

  if (!token || admin?.role !== "admin") {
    return <Navigate to="/login" />
  }

  return children
}
