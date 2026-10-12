import { useState } from "react";
import ImageComparison from "./ImageComparison";
import "../demo.css";
import "../simulation-layout.css";
import "../comparison-fix.css";

const steps = ["Upload", "Apply", "Simulate"];
const details = ["Your test photo", "Fixed preview", "AI comparison"];
const titles = ["Ready for the demo", "Preview applied", "AI comparison shown"];
const descriptions = ["Apply displays the supplied effect preview.", "Drag the divider to compare the original with the effect preview.", "Both images are supplied examples, not generated results."];

function Simulation() {
  const [step, setStep] = useState(-1);
  return (
    <section className="simulation-section page-width" id="simulation">
      <div className="simulation-heading"><span className="eyebrow">Interactive simulation</span><h2>See the protection<br />in action.</h2><p>Explore the flow with our test portrait and supplied example outputs.</p></div>
      <div className="demo-workspace restored-workspace">
        <div className="step-rail">{steps.map((label, index) => <div className={`step-item ${step >= index ? "active" : ""}`} key={label}><span>{index + 1}</span><div><strong>{label}</strong><small>{details[index]}</small></div></div>)}</div>
        {step === -1 && <div className="upload-zone"><span className="upload-icon">＋</span><strong>Choose a portrait</strong><small>Try the supplied test portrait to explore Cloakly.</small><button className="button button-primary" onClick={() => setStep(0)}>Use demo portrait</button></div>}
        {step >= 0 && <>
        <div className="demo-content" key={step}>
          {step === 0 && <img className="demo-original" src="/demo/original.jpg" alt="Original test portrait" />}
          {step === 1 && <ImageComparison />}
          {step === 2 && <div className="demo-results">{[["protected.png", "Simulated protected", "Input shown to the AI"], ["generated.png", "Simulated generation", "Example AI result"]].map(([file, label, title]) => <figure key={file}><img src={`/demo/${file}`} alt={title} /><figcaption><span>{label}</span><strong>{title}</strong></figcaption></figure>)}</div>}
        </div>
        <aside className="demo-sidebar">
          <div className="demo-status"><strong>{titles[step]}</strong><p>{descriptions[step]}</p></div>
          <div className="demo-buttons"><button className="button button-primary" disabled={step === 2} onClick={() => setStep(step + 1)}>{["Apply protection", "Run AI simulation", "Simulation complete"][step]}</button>{step > 0 && <><a className="button demo-secondary" href="/demo/original.jpg" download>Download original</a><button className="button demo-secondary" onClick={() => setStep(-1)}>Start over</button></>}</div>
        </aside>
        </>}
      </div>
    </section>
  );
}
export default Simulation;
