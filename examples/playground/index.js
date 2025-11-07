import knurl from "knurl";

// ============================================================================
// LIBRARY SETUP - Comprehensive Control State Testing
// ============================================================================

const container = document.getElementById("container");
const createMount = () => container.appendChild(document.createElement("div"));

// Text control states
const textPanel = knurl.create(
  {
    type: "group",
    label: "type: text",
    nodes: [
      {
        id: "textEmpty",
        type: "text",
        label: "default",
      },
      {
        id: "textValue",
        type: "text",
        label: "initial value",
        value: "hello world",
      },
      {
        id: "textNoLabel",
        type: "text",
        label: null,
        value: "label: null - no label shown",
      },
      {
        id: "textLongValue",
        type: "text",
        label: "long value",
        value:
          "this is a very long text value that might overflow the input field",
      },
      {
        id: "textMultiline",
        type: "text",
        label: "multiline",
        rows: 4,
        value: "Line 1\nLine 2\nLine 3",
      },
      {
        id: "textMultilineCustom",
        type: "text",
        label: "6 rows",
        rows: 6,
        value:
          "Custom row count.\n\nYou can set the number of visible rows.\n\nThis one has rows: 6",
      },
      {
        id: "textMultilineEmpty",
        type: "text",
        label: "empty multiline",
        rows: 4,
      },
    ],
  },
  { mount: createMount() }
);

// Display control variations
const displayPanel = knurl.create(
  {
    type: "group",
    label: "type: display",
    nodes: [
      {
        id: "displayEmpty",
        type: "display",
        label: "default",
      },
      {
        id: "displayText",
        type: "display",
        label: "initial value",
        value: "hello world",
      },
      {
        id: "displayMonospace",
        type: "display",
        label: "monospace format",
        value: "font-family: monospace",
        format: "monospace",
      },
      {
        id: "displayBlock",
        type: "display",
        label: "block format",
        value: `line 1
line 2
line 3
{
  "format": "block",
  "preserves": "whitespace"
}`,
        format: "block",
      },
      {
        id: "displayHtml",
        type: "display",
        label: "html format",
        value: `<strong>bold</strong>, <em>italic</em>, <a href="#">link</a>`,
        format: "html",
      },
      {
        id: "displayNoLabel",
        type: "display",
        label: null,
        value: "label: null - can be used for instructions or descriptions",
      },
    ],
  },
  { mount: createMount() }
);

// Checkbox states
const togglePanel = knurl.create(
  {
    type: "group",
    label: "type: toggle",
    nodes: [
      {
        id: "toggleDefault",
        type: "toggle",
        label: "default (false)",
      },
      {
        id: "toggleTrue",
        type: "toggle",
        label: "initially true",
        value: true,
      },
      {
        id: "toggleNoLabel",
        type: "toggle",
        label: null,
        value: false,
      },
    ],
  },
  { mount: createMount() }
);

// Number states
const numberPanel = knurl.create(
  {
    type: "group",
    label: "type: number",
    nodes: [
      {
        id: "numDefault",
        type: "number",
        label: "default",
      },
      {
        id: "numPositive",
        type: "number",
        label: "positive value",
        value: 42,
      },
      {
        id: "numNegative",
        type: "number",
        label: "negative value",
        value: -123,
      },
      {
        id: "numDecimal",
        type: "number",
        label: "decimal value",
        value: 3.14159,
      },
      {
        id: "numBounded",
        type: "number",
        label: "bounded",
        value: 50,
        min: 0,
        max: 100,
      },
      {
        id: "numNoBounds",
        type: "number",
        label: "no bounds",
        value: 999999,
      },
    ],
  },
  { mount: createMount() }
);

// Range variations
const rangePanel = knurl.create(
  {
    type: "group",
    label: "type: range",
    nodes: [
      {
        id: "rangeDefault",
        type: "range",
        label: "default",
      },
      {
        id: "rangeValue",
        type: "range",
        label: "with value",
        value: 75,
        min: 0,
        max: 100,
      },
      {
        id: "rangeNegative",
        type: "range",
        label: "negative range",
        value: 0,
        min: -50,
        max: 50,
      },
      {
        id: "rangeDecimal",
        type: "range",
        label: "decimal step",
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.01,
      },
      {
        id: "rangeLarge",
        type: "range",
        label: "large range",
        value: 5000,
        min: 0,
        max: 10000,
        step: 100,
      },
      {
        id: "rangeNoStep",
        type: "range",
        label: "default step",
        value: 25,
        min: 0,
        max: 50,
      },
    ],
  },
  { mount: createMount() }
);

// Color states
const colorPanel = knurl.create(
  {
    type: "group",
    label: "type: color",
    nodes: [
      {
        id: "colorDefault",
        type: "color",
        label: "default",
      },
      {
        id: "colorBlack",
        type: "color",
        label: "black",
        value: "#000000",
      },
      {
        id: "colorRed",
        type: "color",
        label: "red",
        value: "#ff0000",
      },
      {
        id: "colorCustom",
        type: "color",
        label: "custom color",
        value: "#ff6b35",
      },
      {
        id: "colorNoLabel",
        type: "color",
        label: null,
        value: "#00ff00",
      },
    ],
  },
  { mount: createMount() }
);

// Select variations
const selectPanel = knurl.create(
  {
    type: "group",
    label: "type: select",
    nodes: [
      {
        id: "selectArray",
        type: "select",
        label: "[] options",
        options: ["small", "medium", "large"],
      },
      {
        id: "selectArrayValue",
        type: "select",
        label: "[] with value",
        value: "blue",
        options: ["red", "green", "blue"],
      },
      {
        id: "selectObjectString",
        type: "select",
        label: "{} → string",
        value: "warning",
        options: {
          info: "info",
          warning: "warning",
          error: "error",
        },
      },
      {
        id: "selectObjectNumber",
        type: "select",
        label: "{} → number",
        value: 10,
        options: {
          low: 1,
          medium: 10,
          high: 100,
        },
      },
      {
        id: "selectObjectBool",
        type: "select",
        label: "{} → boolean",
        value: true,
        options: {
          yes: true,
          no: false,
        },
      },
      {
        id: "selectObjectMixed",
        type: "select",
        label: "{} → mixed",
        value: null,
        options: {
          string: "text",
          number: 42,
          boolean: true,
          null: null,
        },
      },
      {
        id: "selectNoLabel",
        type: "select",
        label: null,
        options: ["option 1", "option 2", "option 3"],
      },
    ],
  },
  { mount: createMount() }
);

// Toggle group variations
const buttonsPanel = knurl.create(
  {
    type: "group",
    label: "type: buttons",
    nodes: [
      {
        id: "buttonsArray",
        type: "buttons",
        label: "array options",
        options: ["A", "B", "C", "D"],
      },
      {
        id: "buttonsObject",
        type: "buttons",
        label: "object options",
        value: "md",
        options: {
          xs: "xs",
          sm: "sm",
          md: "md",
          lg: "lg",
          xl: "xl",
        },
      },
      {
        id: "buttonsLongLabels",
        type: "buttons",
        label: "long labels",
        options: ["short", "medium length", "very long option label"],
      },
      {
        id: "buttonsNoLabel",
        type: "buttons",
        label: null,
        value: "center",
        options: ["left", "center", "right"],
      },
    ],
  },
  { mount: createMount() }
);

// Button variations
const buttonPanel = knurl.create(
  {
    type: "group",
    label: "type: button",
    nodes: [
      {
        id: "buttonIdText",
        type: "button",
      },
      {
        id: "buttonCustomText",
        type: "button",
        text: "Custom Text",
      },
      {
        id: "buttonAction",
        type: "button",
        text: "Click Me!",
      },
      {
        id: "buttonLong",
        type: "button",
        text: "This is very long button text",
      },
    ],
  },
  { mount: createMount() }
);

// Number monitor variations
const monitorPanel = knurl.create(
  {
    type: "group",
    label: "type: graph",
    nodes: [
      {
        id: "monitorDefault",
        type: "graph",
        label: "default",
        value: 0,
      },
      {
        id: "monitorCustomHeight",
        type: "graph",
        label: "height: 100",
        value: 0,
        height: 100,
      },
      {
        id: "monitorSamples",
        type: "graph",
        label: "samples: 120",
        value: 0,
        samples: 120,
      },
      {
        id: "monitorBounded",
        type: "graph",
        label: "bounded [0, 1]",
        value: 0.5,
        min: 0,
        max: 1,
      },
      {
        id: "monitorNegative",
        type: "graph",
        label: "negative range",
        value: 0,
        min: -100,
        max: 100,
      },
    ],
  },
  { mount: createMount() }
);

// Vector 2D variations
const vectorPanel = knurl.create(
  {
    type: "group",
    label: "type: pad2",
    nodes: [
      {
        id: "vectorDefault",
        type: "pad2",
        label: "default",
      },
      {
        id: "vectorValue",
        type: "pad2",
        label: "with value",
        value: { x: 0.5, y: -0.5 },
      },
      {
        id: "vectorCustomRange",
        type: "pad2",
        label: "custom range",
        value: { x: 50, y: 50 },
        minX: 0,
        maxX: 100,
        minY: 0,
        maxY: 100,
      },
      {
        id: "vectorAsymmetric",
        type: "pad2",
        label: "asymmetric",
        value: { x: 0, y: 0 },
        minX: -10,
        maxX: 10,
        minY: -100,
        maxY: 100,
      },
      {
        id: "vectorScale",
        type: "pad2",
        label: "scale: 0.1",
        value: { x: 0, y: 0 },
        scale: 0.1,
      },
      {
        id: "vectorStep",
        type: "pad2",
        label: "step: 0.1",
        value: { x: 0, y: 0 },
        step: 0.1,
      },
    ],
  },
  { mount: createMount() }
);

// Group variations
const groupPanel = knurl.create(
  {
    type: "group",
    label: "type: group (nesting)",
    nodes: [
      {
        type: "group",
        label: "expanded: true (default)",
        nodes: [
          { id: "g1text1", type: "text", value: "text 1" },
          { id: "g1text2", type: "text", value: "text 2" },
        ],
      },
      {
        type: "group",
        label: "expanded: false",
        expanded: false,
        nodes: [
          { id: "g2text1", type: "text", value: "hidden 1" },
          { id: "g2text2", type: "text", value: "hidden 2" },
        ],
      },
      {
        type: "group",
        label: "expandable: false",
        expandable: false,
        nodes: [{ id: "g3text", type: "text", value: "always expanded" }],
      },
      {
        type: "group",
        label: "nested groups",
        nodes: [
          { id: "g4text", type: "text", value: "parent level" },
          {
            type: "group",
            label: "child group",
            nodes: [{ id: "g4nested", type: "text", value: "nested level" }],
          },
        ],
      },
      {
        type: "group",
        label: null,
        nodes: [
          { id: "g5color", type: "color", label: "no group label" },
          { id: "g5range", type: "range", label: "still grouped" },
        ],
      },
    ],
  },
  { mount: createMount() }
);

// Visibility control demonstration
const visibilityPanel = knurl.create(
  {
    type: "group",
    label: "visible property demo",
    nodes: [
      {
        id: "visToggle",
        type: "buttons",
        label: "show control",
        value: "text",
        options: ["text", "range", "color"],
      },
      {
        id: "visText",
        type: "text",
        label: "text control",
        value: "I'm visible!",
      },
      {
        id: "visRange",
        type: "range",
        label: "range control",
        value: 50,
        visible: false,
      },
      {
        id: "visColor",
        type: "color",
        label: "color control",
        value: "#ff0000",
        visible: false,
      },
    ],
  },
  { mount: createMount() }
);

// Mixed control panel - stress test
const mixedPanel = knurl.create(
  {
    type: "group",
    id: "mixed controls stress test",
    label: null,
    nodes: [
      {
        id: "mixDisplay",
        type: "display",
        value: "All controls in one panel",
      },
      { id: "mixText", type: "text", value: "text" },
      { id: "mixNumber", type: "number", value: 42 },
      { id: "mixRange", type: "range", min: 0, max: 100, value: 50 },
      { id: "mixColor", type: "color", value: "#0066cc" },
      { id: "mixCheckbox", type: "toggle", value: true },
      { id: "mixSelect", type: "select", options: ["A", "B", "C"] },
      { id: "mixToggle", type: "buttons", options: ["1", "2", "3"] },
      { id: "mixVector", type: "pad2" },
      { id: "mixMonitor", type: "graph", value: 0 },
      { id: "mixButton", type: "button", text: "Action" },
      {
        type: "group",
        label: "nested group",
        expanded: false,
        nodes: [
          { id: "mixNested1", type: "text", value: "nested" },
          { id: "mixNested2", type: "range" },
        ],
      },
    ],
  },
  { mount: createMount() }
);

// ============================================================================
// EVENT BINDINGS & DEMOS
// ============================================================================

// Button click counter
let buttonClickCount = 0;
buttonPanel.subscribe("buttonAction", () => {
  buttonClickCount++;
  buttonPanel.update({
    buttonAction: { text: `Clicked ${buttonClickCount} times` },
  });
});

// Monitor animation
setInterval(() => {
  const time = Date.now() * 0.001;

  // Different patterns for each monitor
  monitorPanel.set({
    monitorDefault: Math.sin(time) * 0.5 + 0.5,
    monitorCustomHeight: Math.sin(time * 2),
    monitorSamples: Math.cos(time * 0.5) * 50,
    monitorBounded: Math.abs(Math.sin(time * 3)),
    monitorNegative: Math.sin(time * 1.5) * 100,
  });

  // Also update the mixed panel monitor
  mixedPanel.set(
    {
      mixMonitor: Math.random(),
    },
    { silent: true }
  );
}, 16);

// Visibility toggle logic
visibilityPanel.subscribe("visToggle", (value) => {
  visibilityPanel.update({
    visText: { visible: value === "text" },
    visRange: { visible: value === "range" },
    visColor: { visible: value === "color" },
  });
});

// Log all changes from mixed panel
mixedPanel.subscribe((id, value) => {
  console.log(`Mixed panel - ${id}: ${JSON.stringify(value)}`);
});
