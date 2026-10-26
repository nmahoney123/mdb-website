import { useSeo } from "@/lib/useSeo";
import { STATIC_PAGE_SEO } from "@/lib/seo";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Hero from "@/sections/home/Hero";
import StatBand from "@/sections/home/StatBand";
import Advantage from "@/sections/home/Advantage";
import Industries from "@/sections/home/Industries";
import FeaturedWork from "@/sections/home/FeaturedWork";
import WhyMdb from "@/sections/home/WhyMdb";
import CtaBand from "@/sections/home/CtaBand";

export default function Home() {
  useSeo(STATIC_PAGE_SEO["/"]);
  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatBand />
        <Advantage />
        <Industries />
        <FeaturedWork />
        <WhyMdb />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
