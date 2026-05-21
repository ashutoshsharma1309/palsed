import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Background } from "./components/layout/Background";
import { Nav } from "./components/layout/Nav";
import { Footer } from "./components/layout/Footer";
import { EngagementProvider } from "./components/adaptive/EngagementProvider";
import { InterventionToast } from "./components/adaptive/InterventionToast";
import { refreshApiUrl } from "./lib/api";

import Landing from "./routes/Landing";
import Onboarding from "./routes/Onboarding";
import Dashboard from "./routes/Dashboard";
import Dsa from "./routes/Dsa";
import DsaProblem from "./routes/DsaProblem";
import Courses from "./routes/Courses";
import CourseCreate from "./routes/CourseCreate";
import CourseDetail from "./routes/CourseDetail";
import CourseLesson from "./routes/CourseLesson";
import CourseQuiz from "./routes/CourseQuiz";
import Roadmaps from "./routes/Roadmaps";
import RoadmapCreate from "./routes/RoadmapCreate";
import RoadmapDetail from "./routes/RoadmapDetail";
import Tutor from "./routes/Tutor";
import Review from "./routes/Review";
import SystemDesign from "./routes/SystemDesign";
import CoreCs from "./routes/CoreCs";
import Aptitude from "./routes/Aptitude";
import InterviewResources from "./routes/InterviewResources";
import Mastery from "./routes/Mastery";
import Engagement from "./routes/Engagement";
import Certificates from "./routes/Certificates";
import VerifyCertificate from "./routes/VerifyCertificate";
import Settings from "./routes/Settings";
import NotFound from "./routes/NotFound";

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
    <EngagementProvider>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col">
        <ScrollToTop />
        <HideChromeForLanding>
          <main className="flex-1">
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
              <Route path="/auth" element={<Navigate to="/onboarding" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </HideChromeForLanding>
        <InterventionToast />
      </div>
    </EngagementProvider>
  );
}
