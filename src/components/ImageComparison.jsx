import { useState } from "react";

function ImageComparison() {
  const [position, setPosition] = useState(50);
  return <div className="effect-comparison"><img src="/demo/original.jpg" alt="Original portrait" /><img className="effect-layer" src="/demo/effect.png" alt="Supplied effect preview" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }} /><span className="image-label left">Simulated result</span><span className="image-label right">Original</span><span className="comparison-divider" style={{ left: `${position}%` }}>↔</span><input type="range" min="0" max="100" value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-label="Compare effect preview with original" /></div>;
}
export default ImageComparison;
