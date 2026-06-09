import Footer from "./sections/Footer";
import Contact from "./sections/Contact";
import TechStack from "./sections/TechStack";
import Scholarships from "./sections/Scholarships";
import Experience from "./sections/Experience";
import Hero from "./sections/Hero";
import ShowcaseSection from "./sections/ShowcaseSection";
import LogoShowcase from "./sections/LogoShowcase";
import Navbar from "./components/NavBar";
import GlobalBackground from "./components/GlobalBackground";
import AICopilot from "./components/AICopilot";

const App = () => (
  <>
    <GlobalBackground />
    <Navbar />
    <Hero />
    <ShowcaseSection />
    <LogoShowcase />
    <Experience />
    <Scholarships />
    <TechStack />
    <Contact />
    <Footer />
    <AICopilot />
  </>
);

export default App;
