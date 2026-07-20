import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { useSeo } from "@/lib/useSeo";

export default function NotFound() {
  useSeo({
    title: "Page Not Found | Mahoney Design & Build",
    description: "The page you're looking for doesn't exist or has moved.",
    path: "/404",
    noindex: true,
  });

  return (
    <>
      <Header />
      <main className="flex min-h-[70vh] items-center bg-ink text-white">
        <div className="container-site py-24 text-center sm:py-32">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-mahoney">
            Error 404
          </p>
          <h1 className="display-1 mt-6 text-5xl sm:text-7xl">Page not found.</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60">
            The page you're looking for doesn't exist or may have moved. Let's get
            you back on solid ground.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/" className="btn-primary">
              Back to Home <ArrowRight className="arrow h-4 w-4" />
            </Link>
            <Link to="/portfolio" className="btn-outline-light">
              View Our Work <ArrowRight className="arrow h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
