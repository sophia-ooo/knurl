import knurl from "knurl";

// ============================================================================
// LIBRARY SETUP
// ============================================================================

// Shared control configuration for all panels
const config = {
  label: "theming",
  type: "group",
  nodes: [
    {
      id: "display",
      type: "display",
      value: "all controls in one panel",
    },
    { id: "text", type: "text", value: "text" },
    { id: "number", type: "number", value: 42 },
    { id: "range", type: "range", min: 0, max: 100, value: 50 },
    { id: "color", type: "color", value: "#0066cc" },
    { id: "checkbox", type: "toggle", value: true },
    { id: "select", type: "select", options: ["A", "B", "C"] },
    { id: "toggle", type: "buttons", options: ["1", "2", "3"] },
    { id: "vector", type: "pad2" },
    { id: "monitor", type: "graph", value: 0 },
    { id: "button", type: "button", text: "Action" },
  ],
};

// Create panels with different themes
const container = document.getElementById("container");
const createMount = () => container.appendChild(document.createElement("div"));

const lightPanel = knurl.create(config, {
  classNames: ["knurl-light"],
  mount: createMount(),
});

const contrastPanel = knurl.create(config, {
  classNames: ["knurl-high-contrast"],
  mount: createMount(),
});

const solarPanel = knurl.create(config, {
  classNames: ["knurl-solarized-dark"],
  mount: createMount(),
});

const pocketPanel = knurl.create(config, {
  classNames: ["pocket-console"],
  mount: createMount(),
});

// ============================================================================
// DEMO LOGIC
// ============================================================================

// Update monitors with random values
setInterval(() => {
  const update = { monitor: Math.random() };

  lightPanel.set(update);
  contrastPanel.set(update);
  solarPanel.set(update);
  pocketPanel.set(update);
}, 16);
