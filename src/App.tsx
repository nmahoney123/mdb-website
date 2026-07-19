import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import { useSettingsSideEffects } from "@/hooks/useCms";
import Home from "./pages/Home";
import Industries from "./pages/Industries";
import IndustryDetail from "./pages/IndustryDetail";
import Portfolio from "./pages/Portfolio";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Careers from "./pages/Careers";
import News from "./pages/News";
import Article from "./pages/Article";
import Contact from "./pages/Contact";
import Subcontractors from "./pages/Subcontractors";
import AdminLogin from "./admin/Login";
import AdminApp from "./admin/AdminApp";

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
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
