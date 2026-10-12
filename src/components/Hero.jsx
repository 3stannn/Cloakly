import ArrowIcon from "./ArrowIcon";

function Hero() {
  return (
    <section className="hero page-width" id="top">
      <div className="hero-copy">
        <span className="eyebrow">Adversarial Perturbations</span>
        <h1>
          Protect yourself
          <br />
          before the attack.
        </h1>
        <p>
          Experience real-world threats in a safe simulation, then learn exactly
          what to spot next time.
        </p>
      </div>
      <div
        className="hero-visual"
        aria-label="A layered security simulation interface"
      >
        <div className="visual-glow" />
        <div className="simulation-device" aria-hidden="true">
          <div className="device-top">
            <span>
              <i /> Live simulation
            </span>
            <b>CL—01</b>
          </div>
          <div className="device-screen">
            <span className="scan-line" />
            <i className="signal signal-one" />
            <i className="signal signal-two" />
            <i className="signal signal-three" />
            <strong>
              Protect Your
              <br />
              Face
            </strong>
          </div>
          <div className="device-controls">
            <span />
            <span />
            <span />
            <button>Protect</button>
          </div>
        </div>
      </div>
      <div className="hero-actions" id="try">
        <a className="button button-primary" href="#simulation">
          Start a simulation <ArrowIcon />
        </a>
        <a className="button button-muted" href="#how-it-works">
          How it works
        </a>
      </div>
    </section>
  );
}
export default Hero;
