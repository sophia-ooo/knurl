import knurl from "knurl";

// ============================================================================
// LIBRARY SETUP
// ============================================================================

const panel = knurl.create({
  id: "knurl",
  type: "group",
  nodes: [
    // Background conveyor belt
    {
      id: "background",
      type: "group",
      label: "background",
      nodes: [
        {
          id: "bgDirection",
          type: "pad2",
          label: "direction",
          value: { x: 1, y: 0.5 },
        },
        {
          id: "bgColor",
          type: "color",
          label: "color",
          value: "#000000",
        },
        {
          id: "bgThickness",
          type: "range",
          label: "thickness",
          value: 40,
          min: 10,
          max: 100,
          step: 5,
        },
        {
          id: "bgSpeed",
          type: "range",
          label: "speed",
          value: 1,
          min: 0,
          max: 5,
          step: 0.1,
        },
      ],
    },

    // Text settings
    {
      id: "text-group",
      type: "group",
      label: "text",
      nodes: [
        {
          id: "text",
          type: "text",
          value: "knurl",
        },
        {
          id: "fontSize",
          type: "range",
          label: "size",
          value: 200,
          min: 50,
          max: 400,
          step: 10,
        },
      ],
    },

    // Foreground conveyor belt (shows through text)
    {
      id: "foreground",
      type: "group",
      label: "foreground",
      nodes: [
        {
          id: "fgDirection",
          type: "pad2",
          label: "direction",
          value: { x: -0.5, y: -1 },
        },
        {
          id: "fgColor",
          type: "color",
          label: "color",
          value: "#000000",
        },
        {
          id: "fgThickness",
          type: "range",
          label: "thickness",
          value: 30,
          min: 10,
          max: 100,
          step: 5,
        },
        {
          id: "fgSpeed",
          type: "range",
          label: "speed",
          value: 2,
          min: 0,
          max: 5,
          step: 0.1,
        },
      ],
    },
  ],
});

// ============================================================================
// DEMO LOGIC - Moving stripe conveyors with text masking
// ============================================================================

// Create canvases
const bgCanvas = document.createElement("canvas"); // Background stripes (offscreen)
const fgCanvas = document.createElement("canvas"); // Foreground stripes (offscreen)
const textCanvas = document.createElement("canvas"); // Text mask (offscreen)
const tempCanvas = document.createElement("canvas"); // Temp for masking (offscreen)
const outputCanvas = document.createElement("canvas"); // Final output (visible)

const bgCtx = bgCanvas.getContext("2d");
const fgCtx = fgCanvas.getContext("2d");
const textCtx = textCanvas.getContext("2d");
const tempCtx = tempCanvas.getContext("2d");
const outCtx = outputCanvas.getContext("2d");

document.getElementById("canvas-container").append(outputCanvas);

// Animation state
let bgOffset = 0;
let fgOffset = 0;

// Resize handler
const resizeCanvases = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;

  bgCanvas.width =
    fgCanvas.width =
    textCanvas.width =
    tempCanvas.width =
    outputCanvas.width =
      w;
  bgCanvas.height =
    fgCanvas.height =
    textCanvas.height =
    tempCanvas.height =
    outputCanvas.height =
      h;
};

// ============================================================================
// DRAWING FUNCTIONS
// ============================================================================

function drawStripes(ctx, width, height, direction, color, thickness, offset) {
  const angle = Math.atan2(direction.y, direction.x);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = color;

  // Rotate canvas to draw stripes at angle
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(angle);

  // Draw enough stripes to cover the rotated canvas
  const diagonal = Math.sqrt(width ** 2 + height ** 2);
  const spacing = thickness * 2;
  const numStripes = Math.ceil(diagonal / spacing) + 2;
  const start = -diagonal / 2 - spacing;

  for (let i = 0; i < numStripes; i++) {
    const x = start + i * spacing + offset;
    ctx.fillRect(x, -diagonal / 2, thickness, diagonal);
  }

  ctx.restore();
}

function drawTextMask(ctx, width, height, text, fontSize) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "white";
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);
}

function compositeLayers() {
  const w = outputCanvas.width;
  const h = outputCanvas.height;

  // Clear output
  outCtx.clearRect(0, 0, w, h);

  // Step 1: Draw background stripes everywhere EXCEPT text area
  outCtx.drawImage(bgCanvas, 0, 0);

  // Cut out the text area from background
  outCtx.globalCompositeOperation = "destination-out";
  outCtx.drawImage(textCanvas, 0, 0);
  outCtx.globalCompositeOperation = "source-over"; // Reset

  // Step 2: Create masked foreground (fg stripes ONLY where text is)
  tempCtx.clearRect(0, 0, w, h);

  // Draw foreground stripes to temp canvas
  tempCtx.drawImage(fgCanvas, 0, 0);

  // Mask to keep only the text area
  tempCtx.globalCompositeOperation = "destination-in";
  tempCtx.drawImage(textCanvas, 0, 0);
  tempCtx.globalCompositeOperation = "source-over"; // Reset

  // Step 3: Draw masked foreground in the cut-out text area
  outCtx.drawImage(tempCanvas, 0, 0);
}

// ============================================================================
// ANIMATION LOOP
// ============================================================================

function animate() {
  const {
    bgDirection,
    bgColor,
    bgThickness,
    bgSpeed,
    fgDirection,
    fgColor,
    fgThickness,
    fgSpeed,
    text,
    fontSize,
  } = panel.get();

  const w = outputCanvas.width;
  const h = outputCanvas.height;

  // Update offsets for conveyor belt animation
  bgOffset = (bgOffset + bgSpeed) % (bgThickness * 2);
  fgOffset = (fgOffset + fgSpeed) % (fgThickness * 2);

  // Draw background stripes
  drawStripes(bgCtx, w, h, bgDirection, bgColor, bgThickness, bgOffset);

  // Draw foreground stripes
  drawStripes(fgCtx, w, h, fgDirection, fgColor, fgThickness, fgOffset);

  // Draw text mask
  drawTextMask(textCtx, w, h, text, fontSize);

  // Composite everything
  compositeLayers();

  requestAnimationFrame(animate);
}

// ============================================================================
// EVENT BINDINGS
// ============================================================================

window.addEventListener("resize", resizeCanvases);

// Initialize and start
resizeCanvases();
animate();
