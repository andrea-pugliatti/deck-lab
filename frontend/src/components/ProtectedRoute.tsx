import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const isAuthenticated = true;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
