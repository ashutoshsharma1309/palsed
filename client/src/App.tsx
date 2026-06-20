import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Background } from "./components/layout/Background";
import { Nav } from "./components/layout/Nav";
import { Footer } from "./components/layout/Footer";
import { MobileTabBar } from "./components/layout/MobileTabBar";
import { EngagementProvider } from "./components/adaptive/EngagementProvider";
import { FocusMode } from "./components/adaptive/FocusMode";
import { CommandPalette } from "./components/CommandPalette";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { RequireAuth } from "./components/auth/RequireAuth";
import { Loader } from "./components/ui/Loader";
import { refreshApiUrl } from "./lib/api";

// Landing loads eagerly (first-paint critical). Everything else is lazy.
import Landing from "./routes/Landing";

const Onboarding = lazy(() => import("./routes/Onboarding"));
const Dashboard = lazy(() => import("./routes/Dashboard"));
const Dsa = lazy(() => import("./routes/Dsa"));
const DsaProblem = lazy(() => import("./routes/DsaProblem"));
const Companies = lazy(() => import("./routes/Companies"));
const CompanyDetail = lazy(() => import("./routes/CompanyDetail"));
const Pyq = lazy(() => import("./routes/Pyq"));
const PyqSubmit = lazy(() => import("./routes/PyqSubmit"));
const Applications = lazy(() => import("./routes/Applications"));
const Internships = lazy(() => import("./routes/Internships"));
const AuthCallback = lazy(() => import("./routes/AuthCallback"));
const Review = lazy(() => import("./routes/Review"));
const SystemDesign = lazy(() => import("./routes/SystemDesign"));
const CoreCs = lazy(() => import("./routes/CoreCs"));
const Aptitude = lazy(() => import("./routes/Aptitude"));
const InterviewResources = lazy(() => import("./routes/InterviewResources"));
const Mastery = lazy(() => import("./routes/Mastery"));
const Engagement = lazy(() => import("./routes/Engagement"));
const Certificates = lazy(() => import("./routes/Certificates"));
const VerifyCertificate = lazy(() => import("./routes/VerifyCertificate"));
const Settings = lazy(() => import("./routes/Settings"));
const PlacementHub = lazy(() => import("./routes/PlacementHub"));
const ResumeRoast = lazy(() => import("./routes/ResumeRoast"));
const Salary = lazy(() => import("./routes/Salary"));
const Compare = lazy(() => import("./routes/Compare"));
const Pricing = lazy(() => import("./routes/Pricing"));
const NotFound = lazy(() => import("./routes/NotFound"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function HideChromeForLanding({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const hide = pathname === "/" || pathname === "/onboarding" || pathname.startsWith("/verify-certificate");
  return (
    <>
      {!hide && <Nav />}
      {!hide && <FocusMode />}
      {children}
      {!hide && <Footer />}
      {!hide && <MobileTabBar />}
    </>
  );
}

export default function App() {
  useEffect(() => {
    refreshApiUrl();
  }, []);

  return (
    <ErrorBoundary>
      <EngagementProvider>
        <Background />
        <CommandPalette />
        <div className="relative z-10 min-h-screen flex flex-col">
          <ScrollToTop />
          <HideChromeForLanding>
            <main className="flex-1 pb-[calc(56px+env(safe-area-inset-bottom))] lg:pb-0">
              <Suspense fallback={<div className="py-32"><Loader label="Loading" /></div>}>
                <Routes>
                  {/* Public — accessible without login */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/verify-certificate" element={<VerifyCertificate />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/pricing" element={<Pricing />} />
                  {/* Onboarding is a profile-setup form, not the gate — keep it public.
                      The real signup/login lives on Landing via <AuthPanel />. */}
                  <Route path="/onboarding" element={<Onboarding />} />

                  {/* Protected — login required for every feature */}
                  <Route element={<RequireAuth />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/companies" element={<Companies />} />
                    <Route path="/companies/:slug" element={<CompanyDetail />} />
                    <Route path="/pyq" element={<Pyq />} />
                    <Route path="/internships" element={<Internships />} />
                    <Route path="/dsa" element={<Dsa />} />
                    <Route path="/dsa/:slug" element={<DsaProblem />} />
                    <Route path="/pyq/submit" element={<PyqSubmit />} />
                    <Route path="/applications" element={<Applications />} />
                    <Route path="/review" element={<Review />} />
                    <Route path="/system-design" element={<SystemDesign />} />
                    <Route path="/core-cs" element={<CoreCs />} />
                    <Route path="/aptitude" element={<Aptitude />} />
                    <Route path="/interview-resources" element={<InterviewResources />} />
                    <Route path="/mastery" element={<Mastery />} />
                    <Route path="/engagement" element={<Engagement />} />
                    <Route path="/certificates" element={<Certificates />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/placement-hub" element={<PlacementHub />} />
                    <Route path="/resume-roast" element={<ResumeRoast />} />
                    <Route path="/salary" element={<Salary />} />
                    <Route path="/compare" element={<Compare />} />
                  </Route>

                  {/* Legacy redirects — old AI routes → new homes */}
                  <Route path="/courses" element={<Navigate to="/companies" replace />} />
                  <Route path="/courses/*" element={<Navigate to="/companies" replace />} />
                  <Route path="/roadmaps" element={<Navigate to="/companies" replace />} />
                  <Route path="/roadmaps/*" element={<Navigate to="/companies" replace />} />
                  <Route path="/tutor" element={<Navigate to="/applications" replace />} />
                  <Route path="/auth" element={<Navigate to="/onboarding" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </HideChromeForLanding>
        </div>
        {/* Vercel Analytics + Speed Insights — zero-config, free on Hobby tier.
            Surface page views, geos, devices, and Core Web Vitals (LCP/INP/CLS)
            in the Vercel dashboard. Both auto no-op in dev. */}
        <Analytics />
        <SpeedInsights />
      </EngagementProvider>
    </ErrorBoundary>
  );
}
