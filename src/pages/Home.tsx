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
