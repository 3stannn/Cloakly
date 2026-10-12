import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import Simulation from "./components/Simulation";
import FeatureGrid from "./components/FeatureGrid";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <section className="landing-stage">
        <Navbar />
        <Hero />
        <TrustStrip />
      </section>
      <main>
        <Simulation />
        <FeatureGrid />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}

export default App;
