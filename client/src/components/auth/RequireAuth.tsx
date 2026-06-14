import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/**
 * Layout route guard. Renders nested routes only when authenticated;
 * otherwise redirects to the homepage (which hosts the login/signup card),
 * remembering the intended destination for post-login redirect.
 */
export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname + location.search }} />;
  }
  return <Outlet />;
}
