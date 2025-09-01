import knurl from "knurl";

// ============================================================================
// LIBRARY SETUP
// ============================================================================

const panel = knurl.create({
  id: "paint",
  type: "group",
  nodes: [
    {
      id: "tool",
      type: "buttons",
      value: "brush",
      options: ["brush", "eraser"],
    },
    {
      id: "size",
      type: "range",
      value: 20,
      min: 1,
      max: 100,
    },
    {
      id: "color",
      type: "color",
      value: "#0066FF",
    },
    {
      id: "opacity",
      type: "range",
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      id: "pressure",
      type: "toggle",
      label: "pressure",
      value: true,
    },
    {
      id: "clear",
      type: "button",
      text: "clear canvas",
    },
    {
      id: "save",
      type: "button",
      text: "save image",
    },
  ],
});

// ============================================================================
// DEMO LOGIC - Drawing Application
// ============================================================================
//
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const prompt = document.getElementById("prompt");
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.cursor = "crosshair";

// Demo state
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let lastTime = 0;
let lastSize = 0;

//
const hidePrompt = () => prompt && prompt.remove();

// Get coordinates from mouse or touch event
const getCoordinates = (e) => {
  if (e.touches && e.touches.length > 0) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  }
  return { x: e.offsetX, y: e.offsetY };
};

// Drawing functions
const startDrawing = (e) => {
  hidePrompt();

  isDrawing = true;
  const coords = getCoordinates(e);
  [lastX, lastY] = [coords.x, coords.y];
  lastTime = Date.now();

  // Initialize lastSize for smooth pressure
  const { size } = panel.get();
  lastSize = size;
};

const draw = (e) => {
  if (!isDrawing) return;

  e.preventDefault(); // Prevent scrolling on touch
  const coords = getCoordinates(e);
  const { tool, size, color, opacity, pressure } = panel.get();

  // Calculate speed-based pressure if enabled
  let currentSize = size;
  if (pressure && tool !== "eraser") {
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTime;
    const distance = Math.sqrt(
      Math.pow(coords.x - lastX, 2) + Math.pow(coords.y - lastY, 2)
    );
    const speed = distance / (timeDelta + 1);

    // Smooth the pressure with rolling average
    const targetSize = size * Math.max(0.3, Math.min(1, 2 / (speed + 0.5)));
    currentSize = lastSize * 0.7 + targetSize * 0.3; // Smooth transition
    lastSize = currentSize;
    lastTime = currentTime;
  }

  // Regular drawing code
  ctx.globalAlpha = opacity;
  ctx.lineWidth = currentSize;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = color;
  }

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(coords.x, coords.y);
  ctx.stroke();

  [lastX, lastY] = [coords.x, coords.y];
};

const stopDrawing = () => {
  isDrawing = false;
};

// ============================================================================
// EVENT BINDINGS
// ============================================================================

// Canvas drawing events - Mouse
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Canvas drawing events - Touch
canvas.addEventListener("touchstart", startDrawing, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchcancel", stopDrawing);

// Panel controls
panel.subscribe("clear", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

panel.subscribe("save", () => {
  const link = document.createElement("a");
  link.download = "knurl-drawing.png";
  link.href = canvas.toDataURL();
  link.click();
});

// Window resize
window.addEventListener("resize", () => {
  // Save current drawing
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Resize canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Restore drawing
  ctx.putImageData(imageData, 0, 0);
});
