import knurl, { register } from "knurl/external";

// ============================================================================
// CUSTOM CONTROL DEFINITION
// ============================================================================

const EMOJI_CODEPOINTS = [
  0x1f986, 0x1f92e, 0x1f4a9, 0x1f648, 0x1f9a5, 0x1f9a1, 0x1f9a8, 0x1f9ad,
  0x1face, 0x1facf, 0x1fabf, 0x1f409, 0x1f9a0, 0x1f9cc, 0x1f9df, 0x1f9ff,
  0x1fab0, 0x1fab2, 0x1fab3, 0x1fab1, 0x1fae7, 0x1fad9, 0x1f5ff, 0x1f30b,
  0x1f6f8, 0x1fa84, 0x1f573, 0x1faa6, 0x1faa7, 0x1fa97, 0x1fa98, 0x1fa99,
  0x1faa1, 0x1faa2, 0x1faa3, 0x1fa83, 0x1fa90, 0x1fae8, 0x1fae0, 0x1f974,
  0x1fae5, 0x1fad0,
];

const EmojiPalette = ({ nodes, treeNode, update }) => {
  const node = nodes[treeNode.id];

  const emojiButtons = EMOJI_CODEPOINTS.map((codepoint) => {
    const isSelected = node.value === codepoint;
    const emoji = String.fromCodePoint(codepoint);

    return (
      <button
        type="button"
        onClick={() => update({ [node.id]: { value: codepoint } })}
        className={isSelected ? "knurl-selected" : ""}
        key={emoji}
      >
        {emoji}
      </button>
    );
  });

  return <div className="emoji-palette">{emojiButtons}</div>;
};

// Register the custom control
register("emoji-palette", EmojiPalette, {
  value: () => 0x1f986, // Default to duck emoji
  label: null,
});

// ============================================================================
// LIBRARY SETUP
// ============================================================================

const panel = knurl.create({
  type: "group",
  id: "emoji picker",
  nodes: [
    {
      id: "emoji",
      type: "emoji-palette",
    },
  ],
});

// ============================================================================
// DEMO LOGIC
// ============================================================================

// Canvas setup
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.getElementById("canvas-container").append(canvas);

// Resize handler
const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

// Animation loop
const animate = (bubbles = []) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Get current emoji selection
  const { emoji } = panel.get();
  const emojiString = String.fromCodePoint(emoji);

  // Create new bubble
  const newBubble = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    velocity: Math.random() * 5.0 + 5.0,
    emoji: emojiString,
  };

  // Set up text rendering
  ctx.font = "48px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Update and filter bubbles
  const survivingBubbles = [...bubbles, newBubble]
    .map((bubble) => ({
      ...bubble,
      y: bubble.y + bubble.velocity,
    }))
    .filter((bubble) => {
      if (bubble.y >= canvas.height + 48) {
        return false;
      }

      // Draw bubble
      ctx.save();
      ctx.translate(bubble.x, bubble.y);
      ctx.fillText(bubble.emoji, 0, 0);
      ctx.restore();

      return true;
    });

  requestAnimationFrame(() => animate(survivingBubbles));
};

// ============================================================================
// EVENT BINDINGS
// ============================================================================

window.addEventListener("resize", resizeCanvas);

// Initialize
resizeCanvas();
animate();
