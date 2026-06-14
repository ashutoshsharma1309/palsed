import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Background } from "./components/layout/Background";
import { Nav } from "./components/layout/Nav";
import { Footer } from "./components/layout/Footer";
import { EngagementProvider } from "./components/adaptive/EngagementProvider";
import { InterventionToast } from "./components/adaptive/InterventionToast";
import { FocusMode } from "./components/adaptive/FocusMode";
import { CommandPalette } from "./components/CommandPalette";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Loader } from "./components/ui/Loader";
import { refreshApiUrl } from "./lib/api";

// Landing loads eagerly (first-paint critical). Everything else is lazy.
import Landing from "./routes/Landing";

const Onboarding = lazy(() => import("./routes/Onboarding"));
const Dashboard = lazy(() => import("./routes/Dashboard"));
const Dsa = lazy(() => import("./routes/Dsa"));
const DsaProblem = lazy(() => import("./routes/DsaProblem"));
const Courses = lazy(() => import("./routes/Courses"));
const CourseCreate = lazy(() => import("./routes/CourseCreate"));
const CourseDetail = lazy(() => import("./routes/CourseDetail"));
const CourseLesson = lazy(() => import("./routes/CourseLesson"));
const CourseQuiz = lazy(() => import("./routes/CourseQuiz"));
const Roadmaps = lazy(() => import("./routes/Roadmaps"));
const RoadmapCreate = lazy(() => import("./routes/RoadmapCreate"));
const RoadmapDetail = lazy(() => import("./routes/RoadmapDetail"));
const Tutor = lazy(() => import("./routes/Tutor"));
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
            <main className="flex-1">
              <Suspense fallback={<div className="py-32"><Loader label="Loading" /></div>}>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dsa" element={<Dsa />} />
                  <Route path="/dsa/:slug" element={<DsaProblem />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/create" element={<CourseCreate />} />
                  <Route path="/courses/:id" element={<CourseDetail />} />
                  <Route path="/courses/:id/lesson/:lessonId" element={<CourseLesson />} />
                  <Route path="/courses/:id/quiz" element={<CourseQuiz />} />
                  <Route path="/roadmaps" element={<Roadmaps />} />
                  <Route path="/roadmaps/create" element={<RoadmapCreate />} />
                  <Route path="/roadmaps/:id" element={<RoadmapDetail />} />
                  <Route path="/tutor" element={<Tutor />} />
                  <Route path="/review" element={<Review />} />
                  <Route path="/system-design" element={<SystemDesign />} />
                  <Route path="/core-cs" element={<CoreCs />} />
                  <Route path="/aptitude" element={<Aptitude />} />
                  <Route path="/interview-resources" element={<InterviewResources />} />
                  <Route path="/mastery" element={<Mastery />} />
                  <Route path="/engagement" element={<Engagement />} />
                  <Route path="/certificates" element={<Certificates />} />
                  <Route path="/verify-certificate" element={<VerifyCertificate />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/placement-hub" element={<PlacementHub />} />
                  <Route path="/auth" element={<Navigate to="/onboarding" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </HideChromeForLanding>
          <InterventionToast />
        </div>
      </EngagementProvider>
    </ErrorBoundary>
  );
}
