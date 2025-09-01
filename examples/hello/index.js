import knurl from "knurl";

// ============================================================================
// LIBRARY SETUP
// ============================================================================

const panel = knurl.create({
  id: "hello, knurl",
  type: "group",
  nodes: [
    {
      id: "text",
      type: "text",
      value: "knurl",
    },
    {
      id: "fontSize",
      type: "range",
      label: "font size",
      value: 200,
      min: 100,
      max: 1000,
      step: 50,
    },
    {
      id: "maxBubbles",
      type: "range",
      label: "# bubbles",
      value: 380,
      min: 0,
      max: 1000,
      step: 40,
    },
    {
      id: "bubbleRadius",
      type: "range",
      label: "radius",
      value: 10,
      min: 0,
      max: 100,
    },
    {
      id: "bubbleLifeVariance",
      type: "range",
      label: "life variance",
      value: 5,
      min: 0,
      max: 100,
    },
    {
      id: "bubbleColor",
      type: "color",
      label: "color",
      value: "#ff0055",
    },
    {
      id: "wind",
      type: "pad2",
      value: { x: 0, y: -0.05 },
    },
    {
      id: "shadowColor",
      type: "color",
      label: "shadow color",
      value: "#debaba",
    },
    {
      id: "shadow",
      type: "pad2",
      label: "shadow offset",
      value: { x: 10, y: 10 },
      minX: -20,
      maxX: 20,
      minY: -20,
      maxY: 20,
      scale: 0.1,
    },
    {
      id: "showEvents",
      type: "toggle",
      label: "show events",
      value: false,
    },
    {
      id: "sampleInterval",
      type: "range",
      label: "sample interval",
      value: 3,
      min: 1,
      max: 20,
    },
    {
      id: "numSamples",
      type: "display",
      label: "# samples",
      value: 0,
    },
  ],
});

// ============================================================================
// DEMO LOGIC
// ============================================================================

// Canvas setup
const textCanvas = document.createElement("canvas");
const bubbleCanvas = document.createElement("canvas");
const textCtx = textCanvas.getContext("2d", { willReadFrequently: true });
const bubbleCtx = bubbleCanvas.getContext("2d");

document.getElementById("canvas-container").append(bubbleCanvas);

// Demo state
let textPixels = [];
let bubbles = [];

// Resize canvases to fullscreen
const resizeCanvas = () => {
  textCanvas.width = bubbleCanvas.width = window.innerWidth;
  textCanvas.height = bubbleCanvas.height = window.innerHeight;
};

// Sample pixels from text to find spawn points
const updateTextPixels = (text, fontSize, interval) => {
  // Clear and draw text
  textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
  textCtx.font = `${fontSize}px sans-serif`;
  textCtx.fillStyle = "black";
  textCtx.textAlign = "center";
  textCtx.textBaseline = "middle";
  textCtx.fillText(text, textCanvas.width / 2, textCanvas.height / 2);

  // Sample pixels where text is drawn
  textPixels = [];
  const imageData = textCtx.getImageData(
    0,
    0,
    textCanvas.width,
    textCanvas.height
  );

  for (let y = 0; y < textCanvas.height; y += interval) {
    for (let x = 0; x < textCanvas.width; x += interval) {
      const alpha = imageData.data[(y * textCanvas.width + x) * 4 + 3];
      if (alpha > 0) {
        textPixels.push({ x, y });
      }
    }
  }

  // Update display - silent to avoid triggering events
  panel.set({ numSamples: textPixels.length }, { silent: true });
};

// Animation loop
const animate = () => {
  const {
    bubbleLifeVariance,
    shadowColor,
    bubbleColor,
    bubbleRadius,
    maxBubbles,
    wind,
    shadow,
  } = panel.get();

  // Clear canvas
  bubbleCtx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);

  // Spawn new bubbles
  while (bubbles.length < maxBubbles && textPixels.length > 0) {
    const spawn = textPixels[Math.floor(Math.random() * textPixels.length)];
    bubbles.push({
      x: spawn.x,
      y: spawn.y,
      life: 0,
      maxLife: 5 + Math.random() * bubbleLifeVariance,
    });
  }

  // Update bubble physics
  bubbles = bubbles.filter((bubble) => {
    bubble.life += 0.1;
    bubble.x += wind.x * bubble.life;
    bubble.y += wind.y * bubble.life;

    const progress = bubble.life / bubble.maxLife;
    bubble.radius = Math.sin(progress * Math.PI) * bubbleRadius;

    return progress < 1;
  });

  // Draw shadows
  bubbleCtx.fillStyle = shadowColor;
  bubbles.forEach((bubble) => {
    bubbleCtx.beginPath();
    bubbleCtx.arc(
      bubble.x + shadow.x,
      bubble.y + shadow.y,
      bubble.radius,
      0,
      2 * Math.PI
    );
    bubbleCtx.fill();
  });

  // Draw bubbles
  bubbleCtx.fillStyle = bubbleColor;
  bubbles.forEach((bubble) => {
    bubbleCtx.beginPath();
    bubbleCtx.arc(bubble.x, bubble.y, bubble.radius, 0, 2 * Math.PI);
    bubbleCtx.fill();
  });

  requestAnimationFrame(animate);
};

// Event logging
const eventsElement = document.getElementById("events");

const logEvent = (message) => {
  const event = document.createElement("div");
  event.textContent = `${new Date().toLocaleString("en-US", {})} ${message}`;
  eventsElement.append(event);
};

// Helper to update text canvas when relevant values change
const updateTextCanvas = () => {
  const { text, fontSize, sampleInterval } = panel.get();
  updateTextPixels(text, fontSize, sampleInterval);
};

// Initial setup
resizeCanvas();
updateTextCanvas();
logEvent("use the panel. events will appear here.");

// ============================================================================
// EVENT BINDINGS
// ============================================================================

// Re-render on resize
window.addEventListener("resize", () => {
  resizeCanvas();
  updateTextCanvas();
});

// Re-render when any control changes
panel.subscribe((id, value) => {
  updateTextCanvas();
  logEvent(`${id}: ${JSON.stringify(value)}`);
});

// Toggle event display
panel.subscribe("showEvents", (value) =>
  value
    ? eventsElement.classList.add("show")
    : eventsElement.classList.remove("show")
);

// Start animation
animate();
