import { Navigate, Outlet } from "react-router";

import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute component.
 * Layout wrapper that guards routes requiring user authentication.
 * Checks the authentication state using the {@link useAuth} hook.
 * If authentication state is still loading, displays a spinner.
 * If authenticated, renders the child routes via {@link Outlet}.
 * If not authenticated, redirects the user to the "/login" page.
 *
 * @returns A JSX element wrapping the protected content or redirect logic.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="relative h-12 w-12">
          <div className="border-cyan-accent/20 absolute inset-0 rounded-full border-4"></div>
          <div className="border-t-cyan-accent absolute inset-0 animate-spin rounded-full border-4"></div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
