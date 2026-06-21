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
 *
 * Also enforces profile completion: an authenticated user whose profile is not
 * yet complete is forced to /onboarding before they can reach any feature.
 * Without this gate, a signed-in user could deep-link straight to /dashboard
 * (or any protected route) and use the app without ever filling in their
 * college / branch / year / target roles.
 */
export function RequireAuth() {
  const { isAuthenticated, loading, user } = useAuth();
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

  // Authenticated but profile not completed → force onboarding first.
  // (Skip when already on /onboarding to avoid a redirect loop. When `user`
  // hasn't resolved yet we don't redirect — once it loads, this guard re-runs.)
  if (user && user.profileComplete !== true && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
