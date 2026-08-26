import B2B from "./_sections/B2B";
import Contact from "./_sections/Contact";
import Footer from "./_sections/Footer";
import Gallery from "./_sections/Gallery";
import Hero from "./_sections/Hero";
import Intro from "./_sections/Intro";
import Nav from "./_sections/Nav";
import Process from "./_sections/Process";
import Projects from "./_sections/Projects";
import SiteShell from "./_sections/SiteShell";
import Software from "./_sections/Software";
import WhyDis from "./_sections/WhyDis";

export default function Home() {
  return (
    <SiteShell>
      <Nav />
      <main id="top">
        <Hero />
        {/* Intro and WhyDis are deliberately adjacent: the hero CTA points at
            #pourquoi, and the two read as one movement. */}
        <Intro />
        <WhyDis />
        <Projects />
        <Process />
        <B2B />
        <Software />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </SiteShell>
  );
}
