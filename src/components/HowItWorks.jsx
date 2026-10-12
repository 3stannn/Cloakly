import ArrowIcon from "./ArrowIcon";
const steps = [
  [
    "Choose your portrait",
    "Select a JPG, PNG, or WebP. The browser previews it locally and keeps it unchanged.",
  ],
  [
    "Preview the cloak",
    "See how an adversarial protection layer could sit over the image without changing how it feels to people.",
  ],
  [
    "Compare the result",
    "Run the concept simulation to compare the original and intended protected outcomes side by side.",
  ],
];
function HowItWorks() {
  return (
    <section className="steps-section page-width" id="how-it-works">
      <div className="steps-panel">
        <div className="steps-intro">
          <span className="eyebrow">How Cloakly works</span>
          <h2>
            Three simple steps.
            <br />
            <span>One safer portrait.</span>
          </h2>
          <a className="button button-light" href="#simulation">
            Try the simulation <ArrowIcon />
          </a>
        </div>
        <div className="steps-list">
          {steps.map(([title, text], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export default HowItWorks;
