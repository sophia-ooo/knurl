[← Back to README](../README.md)

# Controls Reference

A **control** is a UI element that displays and/or modifies a value. Each control is defined as a JSON object with at least an `id` and `type` property. Controls can be inputs (like sliders), displays (like graphs), or containers (like groups).

```js
// A single control
{ id: "speed", type: "range", min: 0, max: 10, value: 5 }

// Multiple controls in a panel
knurl.create([
  { id: "speed", type: "range", min: 0, max: 10, value: 5 },
  { id: "color", type: "color", value: "#ff0055" },
  { id: "debug", type: "toggle", value: false }
]);
```

## How Controls Work

### Common Properties

All controls accept these properties:

- `id` - Unique identifier (auto-generated if not provided)
- `type` - Control type (required)
- `label` - Display label (defaults to `id` if `undefined`; set to `null` to hide)
- `visible` - Whether the control is shown (defaults to `true`)

### Default Values

knurl uses a cascading default system where each level overrides the previous:

1. **Global defaults** (in `registry.js`)<br>
   All controls start with: `{ layout: "row", visible: true }`

2. **Control defaults** (in each control's `register()` call)<br>
   For example, `button` sets: `{ label: null }`

3. **User config** (what you pass to `knurl.create()`)<br>
   Your values override everything: `{ label: "Speed", value: 7 }`

Example showing all three levels:

```js
// 1. Global: { layout: "row", visible: true }
// 2. Button control adds: { label: null }
// 3. User overrides with:
{ type: "button", text: "Reset", label: "Actions" }
// Final result: button with text "Reset" under an "Actions" label
```

## Input Controls

### `range` – Slider with number input

```js
{
  id: "speed", type: "range",
  min: 0, max: 10, value: 5, step: 0.1
}
```

- **value** – number
- **min** – number (lower bound)
- **max** – number (upper bound)
- **step** – number (increment)

### `number` – Numeric text input

```js
{
  id: "age", type: "number",
  min: 0, max: 100, value: 25
}
```

- **value** – number
- **min** – number (optional lower bound)
- **max** – number (optional upper bound)
- **step** – number (optional increment)

### `text` – Text input field

```js
// Single line (default)
{ id: "name", type: "text", value: "untitled" }

// Multiline textarea
{
  id: "description", type: "text",
  multiline: true, rows: 4, value: "Line 1\nLine 2"
}
```

- **value** – string
- multiline – boolean (use textarea instead of input, defaults to `false`)
- rows – number (visible rows for multiline, defaults to `4`)

### `color` – Color picker with hex input

```js
{ id: "theme", type: "color", value: "#ff0055" }
```

- **value** – string (hex color)

### `toggle` – Checkbox on/off switch

```js
{ id: "debug", type: "toggle", value: false }
```

- **value** – boolean

### `pad2` – 2D vector pad with drag control

```js
{
  id: "position", type: "pad2",
  value: { x: 0, y: 0 }, minX: -1, maxX: 1,
  minY: -1, maxY: 1, scale: 0.01, step: 0.01
}
```

- **value** – object with x and y properties
- **minX** – number (x-axis lower bound)
- **maxX** – number (x-axis upper bound)
- **minY** – number (y-axis lower bound)
- **maxY** – number (y-axis upper bound)
- **scale** – number (drag sensitivity)
- **step** – number (snap increment)

## Selection Controls

### `select` – Dropdown menu

```js
{
  id: "size", type: "select",
  options: ["S", "M", "L"], value: "M"
}
```

- **value** – any
- **options** – array or object<br>
  Array: `["S", "M", "L"]`<br>
  Object: `{ "Low": 1, "Medium": 5, "High": 10 }`

### `buttons` – Radio-style button group

```js
{
  id: "mode", type: "buttons",
  options: ["play", "pause", "stop"], value: "play"
}
```

- **value** – any
- **options** – array or object (same format as select)

## Action Controls

### `button` – Clickable trigger button

```js
{ id: "reset", type: "button", text: "Reset All" }
```

- **text** – string (button text, defaults to `id`)
- **label** – Set to `null` by default (buttons typically don't show separate labels)
- Fires events on click
- Does not store state
- Subscribe to button events like any other control:
    ```js
    panel.subscribe("reset", () => {
        console.log("Button was clicked!");
    });
    ```

## Display Controls

### `display` – Read-only text display

```js
{
  id: "status", type: "display",
  value: "Server: connected", format: "text"
}
```

- **value** – string
- **format** – string<br>
  `"text"` (default)<br>
  `"monospace"` (fixed-width font)<br>
  `"block"` (multi-line)<br>
  `"html"` (renders HTML)

### `graph` – Real-time value history graph

```js
{
  id: "cpu", type: "graph", value: 0,
  min: 0, max: 100, height: 60, samples: 60
}
```

- **value** – number (current sample)
- **min** – number (graph lower bound)
- **max** – number (graph upper bound)
- **height** – number (pixels)
- **samples** – number (history length)

## Layout Controls

### `group` – Collapsible container for controls

```js
{
  id: "settings", type: "group",
  label: "Display", expanded: true,
  nodes: [/* nested controls */]
}
```

- **nodes** – array of control configs
- **expanded** – boolean (whether group is expanded)
- **expandable** – boolean (whether to show expand/collapse arrow, defaults to `true`)
- **label** – string or null (group title; set to `null` to hide)
