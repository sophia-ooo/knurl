[← Back to README](../README.md)

# API Reference

The knurl API consists of 7 methods: 2 static methods on the `knurl` object and 5 instance methods on created panels.

## Static Methods

### `knurl.create(config[, options])`

Creates a new panel instance.

**Parameters:**

- `config` - Array of control descriptors or single group object
- `options` - Optional configuration object

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| `mount` | auto-created `<div>` | HTMLElement to mount the panel |
| `throttleRendering` | `true` | Batch renders with `requestAnimationFrame` |
| `injectStyles` | `true` | Inject minimal default CSS |
| `classNames` | `[]` | Array of CSS class names to add to panel |

**Returns:** Panel instance

```js
const panel = knurl.create(
    [{ id: "speed", type: "range", min: 0, max: 10, value: 1 }],
    {
        mount: document.querySelector("#controls"),
        classNames: ["my-theme"], // custom styling
    }
);
```

### `knurl.register(type, component[, options])`

Register a custom control type.

**Parameters:**

- `type` - String identifier for the control
- `component` - Preact component function
- `options` - Optional configuration object

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| `label` | `undefined` | Display label (defaults to `id` if `undefined`; set to `null` to hide) |
| `layout` | `"row"` | Layout mode: `"row"` or `"block"` |
| `visible` | `true` | Whether the control is visible |
| `value` | `() => undefined` | Function that returns default value given node config |

**Returns:** `void`

```js
import { register } from "knurl/external";

register("my-slider", MySliderComponent, {
    showLabel: false,
    value: (node) => node.min || 0,
});
```

## Instance Methods

### `panel.get()`

Returns all values as an object. Object-typed values (e.g. vectors) are **immutable**.

```js
const values = panel.get(); // { speed: 1, color: "#ff0055" }
const { speed } = panel.get(); // destructure single value
const { speed, color } = panel.get(); // destructure multiple
```

### `panel.set(values[, options])`

Updates one or more control values. Object-typed values (e.g. vectors) are **immutable**.

**Parameters:**

- `values` - Object with id-value pairs to update
- `options` - Optional object with `silent: true` to skip events

```js
panel.set({ speed: 5 }); // set single value
panel.set({ speed: 5, color: "#00ff00" }); // set multiple values
panel.set({ speed: 5 }, { silent: true }); // no events fired
```

### `panel.update(updates[, options])`

Updates any part of the control configuration, not just values. This is more powerful than `set()` as it can modify properties like `min`, `max`, `label`, etc.

**Parameters:**

- `updates` - Object with id-update pairs. Each update is an object of properties to change
- `options` - Optional object with `silent: true` to skip events

```js
// Update value and constraints
panel.update({
    speed: { value: 5, min: 0, max: 10 },
});

// Change labels dynamically
panel.update({
    speed: { label: "Velocity" },
    color: { label: "Theme Color" },
});

// Hide/show controls
panel.update({
    debugMode: { visible: false },
});

// Silent updates (no events)
panel.update({ speed: { value: 7 } }, { silent: true });
```

### `panel.subscribe(id, handler)`

Subscribe to changes for a specific control.

**Parameters:**

- `id` - Control identifier
- `handler` - Function called with `(value)` on change

**Returns:** Disposer function

```js
const dispose = panel.subscribe("speed", (value) => {
    console.log("Speed is now:", value);
});

// Later: stop listening
dispose();
```

### `panel.subscribe(handler)`

Subscribe to changes for any control.

**Parameters:**

- `handler` - Function called with `(id, value)` on any change

**Returns:** Disposer function

```js
const dispose = panel.subscribe((id, value) => {
    console.log(`${id} changed to:`, value);
});

// Later: stop listening
dispose();
```

### `panel.destroy()`

Removes the panel from DOM and cleans up all listeners.

```js
panel.destroy(); // panel is now unusable
```
