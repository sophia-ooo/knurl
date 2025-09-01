import p5 from "p5";
import knurl from "knurl";

// ============================================================================
// LIBRARY SETUP
// ============================================================================

const panel = knurl.create({
  id: "p5.js demo",
  type: "group",
  nodes: [
    {
      id: "text",
      type: "text",
      value: "hello, p5.js",
    },
    {
      id: "radius",
      type: "range",
      value: 350,
      min: 0,
      max: 500,
    },
    {
      id: "noiseLod",
      type: "range",
      value: 2,
      min: 0,
      max: 10,
      step: 0.1,
    },
    {
      id: "noiseFalloff",
      type: "range",
      value: 0.4,
      min: 0,
      max: 1,
      step: 0.01,
    },
  ],
});

// ============================================================================
// DEMO LOGIC
// ============================================================================

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = () => {
    const originX = p.windowWidth / 2.0;
    const originY = p.windowHeight / 2.0;

    // Get current panel values
    const { noiseLod, noiseFalloff, text, radius } = panel.get();
    p.noiseDetail(noiseLod, noiseFalloff);

    // Clear background
    p.background(255);
    p.fill(0);

    // Draw morphing circle
    p.beginShape();
    const numPoints = 200;
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const x = Math.sin(angle);
      const y = Math.cos(angle);
      const offset = p.frameCount * 0.01;
      const radiusModifier = p.noise(x + offset, y + offset);
      p.vertex(
        originX + x * radius * radiusModifier,
        originY + y * radius * radiusModifier
      );
    }
    p.endShape(p.CLOSE);

    // Draw text in center
    p.fill(255);
    p.text(text, originX, originY);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

// Initialize p5.js
p5.disableFriendlyErrors = true;
new p5(sketch, document.getElementById("canvas-container"));
