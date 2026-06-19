import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loader } from "../ui/Loader";

/**
 * Layout route guard. Renders nested routes only when authenticated; otherwise
 * redirects to the homepage (which hosts the login/signup card), remembering
 * the intended destination for post-login redirect and flagging the navigation
 * so Landing can show a "please log in" toast + auto-scroll to the AuthPanel.
 *
 * Critically: waits for `loading` to settle before deciding. Without this,
 * the first render (before useEffect hydrates the Supabase session) sees
 * `isAuthenticated: false` and immediately redirects logged-in users, who
 * then get a "please log in" toast they didn't deserve.
 */
export function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="py-40">
        <Loader label="Loading" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location.pathname + location.search,
          requiresAuth: true,
        }}
      />
    );
  }
  return <Outlet />;
}
