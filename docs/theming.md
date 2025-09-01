[← Back to README](../README.md)

# Theming Reference

Apply custom styles using the `classNames` option:

```js
const panel = knurl.create(controls, {
    classNames: ["dark-theme", "compact"],
});
```

### CSS Custom Properties

knurl uses CSS custom properties for easy theming. Override any of these variables in your CSS:

```css
.my-theme {
    /* Colors */
    --panel-bg: hsl(230 7% 10%);
    --panel-fg: hsl(230 10% 75%);
    --panel-border: hsl(230 9% 18%);
    --panel-hover: hsl(230 9% 26%);
    --panel-pressed: hsl(230 7% 16%);
    --panel-low-emphasis: hsl(230 4% 55%);
    --panel-focus: var(--panel-fg);
    --panel-selection-fg: var(--panel-bg);
    --panel-selection-bg: var(--panel-fg);

    /* Semantic colors */
    --value-number: hsl(220 80% 65%);
    --value-string: hsl(139 45% 56%);

    /* Spacing and layout */
    --panel-space: 4px;
    --panel-radius: 2px;
    --panel-width: 256px;
    --label-width: 80px;
    --row-height: 20px;

    /* Typography */
    --font-ui: system-ui, -apple-system, sans-serif;
    --font-value: ui-monospace, monospace;
    --font-size-normal: 11px;
    --line-height-normal: 1.4;
    --color-link: var(--value-number);

    /* Motion */
    --panel-tween-func: cubic-bezier(0.25, 0.8, 0.5, 1);
    --panel-tween-duration: 200ms;

    /* Controls */
    --checkbox-check-width: 3px;
    --checkbox-check-height: 9px;
}
```

### Example: Light Theme

```css
.light-theme {
    --panel-bg: hsl(0 0% 98%);
    --panel-fg: hsl(0 0% 20%);
    --panel-border: hsl(0 0% 85%);
    --panel-hover: hsl(0 0% 90%);
    --panel-low-emphasis: hsl(0 0% 50%);
}
```

See the [theming example](examples/theming/) for more ideas.
