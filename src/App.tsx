import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router";
import { useSettingsSideEffects } from "@/hooks/useCms";

const Home = lazy(() => import("./pages/Home"));
const Industries = lazy(() => import("./pages/Industries"));
const IndustryDetail = lazy(() => import("./pages/IndustryDetail"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const About = lazy(() => import("./pages/About"));
const Careers = lazy(() => import("./pages/Careers"));
const News = lazy(() => import("./pages/News"));
const Article = lazy(() => import("./pages/Article"));
const Contact = lazy(() => import("./pages/Contact"));
const Subcontractors = lazy(() => import("./pages/Subcontractors"));
const Locations = lazy(() => import("./pages/Locations"));
const LocationDetail = lazy(() => import("./pages/LocationDetail"));
const AdminLogin = lazy(() => import("./admin/Login"));
const AdminApp = lazy(() => import("./admin/AdminApp"));

/** Lightweight route fallback — avoids a jarring blank flash on chunk load. */
function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bone" aria-busy="true">
      <span className="sr-only">Loading…</span>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-fog border-t-mahoney" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  useSettingsSideEffects();
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/industries/:slug" element={<IndustryDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<ProjectDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<Article />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/subcontractors" element={<Subcontractors />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/locations/:slug" element={<LocationDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<Home />} />
      </Routes>
      </Suspense>
    </>
  );
}
