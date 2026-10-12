const stats = [
  ["03", "Guided threat scenarios"],
  ["10 min", "Average simulation"],
  ["100%", "Safe and sandboxed"],
];
function TrustStrip() {
  return (
    <section
      className="trust-strip page-width"
      aria-label="Cloakly at a glance"
    >
      {stats.map(([value, label]) => (
        <div className="trust-item" key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
      <p>No technical background required.</p>
    </section>
  );
}
export default TrustStrip;
