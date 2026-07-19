import { useSeo, organizationLd, websiteLd } from "@/lib/useSeo";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Hero from "@/sections/home/Hero";
import StatBand from "@/sections/home/StatBand";
import Advantage from "@/sections/home/Advantage";
import Industries from "@/sections/home/Industries";
import FeaturedWork from "@/sections/home/FeaturedWork";
import Process from "@/sections/home/Process";
import Credibility from "@/sections/home/Credibility";
import WhyMdb from "@/sections/home/WhyMdb";
import Testimonials from "@/sections/home/Testimonials";
import CareersTeaser from "@/sections/home/CareersTeaser";
import NewsTeaser from "@/sections/home/NewsTeaser";
import CtaBand from "@/sections/home/CtaBand";

export default function Home() {
  useSeo({
    title:
      "Mahoney Design & Build — Design-Build General Contractor | Self Storage, Hospitality, Multifamily",
    description:
      "Family-owned design-build general contractor delivering ground-up Self Storage, Hotel, and Multifamily construction across the Northeast. Building since 1985.",
    path: "/",
    jsonLd: [organizationLd(), websiteLd()],
  });
  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatBand />
        <Advantage />
        <Industries />
        <FeaturedWork />
        <Process />
        <Credibility />
        <WhyMdb />
        <Testimonials />
        <CareersTeaser />
        <NewsTeaser />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
