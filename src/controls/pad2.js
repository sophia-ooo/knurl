import { useState, useEffect } from "preact/hooks";
import { useBoundedNumber } from "./util.js";
import { register } from "../registry.js";

const snapToStep = (value, step) => {
  const inv = 1 / step;
  return Math.round(value * inv) / inv;
};

export const Pad2Control = ({ nodes, treeNode, update }) => {
  const node = nodes[treeNode.id];
  const { x, y } = node.value;

  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  const [styles, setStyles] = useState({
    height: 176,
    width: 176,
    space: 6,
    radius: 2,
  });

  useEffect(() => {
    const panel = document.querySelector(".knurl");
    if (!panel) return;

    const computedStyles = getComputedStyle(panel);

    const panelWidthString = computedStyles.getPropertyValue("--panel-width");
    const labelWidthString = computedStyles.getPropertyValue("--label-width");
    const radiusString = computedStyles.getPropertyValue("--panel-radius");
    const spaceString = computedStyles.getPropertyValue("--panel-space");

    const width =
      parseFloat(panelWidthString) -
      parseFloat(labelWidthString) -
      2 * parseFloat(spaceString);

    const radius = parseFloat(radiusString);
    const space = parseFloat(spaceString);

    setStyles({
      width,
      height: width,
      radius,
      space,
    });
  }, []);

  const boundX = useBoundedNumber({
    value: node.value.x,
    min: node.minX,
    max: node.maxX,
    commit: (x) => update({ [node.id]: { value: { ...node.value, x } } }),
  });

  const boundY = useBoundedNumber({
    value: node.value.y,
    min: node.minY,
    max: node.maxY,
    commit: (y) => update({ [node.id]: { value: { ...node.value, y } } }),
  });

  useEffect(() => {
    if (!dragging || !dragStart) return;

    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = "grabbing";

    const handleMove = (e) => {
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY;

      if (clientX === undefined || clientY === undefined) return;

      const deltaX = clientX - dragStart.pointerX;
      const deltaY = clientY - dragStart.pointerY;

      const newX = dragStart.valueX + deltaX * node.scale;
      const newY = dragStart.valueY + deltaY * node.scale;

      const clampedX = Math.max(node.minX, Math.min(node.maxX, newX));
      const clampedY = Math.max(node.minY, Math.min(node.maxY, newY));

      const snappedX = snapToStep(clampedX, node.step);
      const snappedY = snapToStep(clampedY, node.step);

      update({
        [node.id]: {
          value: {
            x: snappedX,
            y: snappedY,
          },
        },
      });
    };

    const handleEnd = () => {
      setDragging(false);
      setDragStart(null);
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.body.style.cursor = originalCursor;

      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [dragging, dragStart, node]);

  const startDrag = (e, valueOverride = null) => {
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;

    setDragging(true);
    setDragStart({
      pointerX: clientX,
      pointerY: clientY,
      valueX: valueOverride?.x ?? node.value.x,
      valueY: valueOverride?.y ?? node.value.y,
    });
  };

  return (
    <>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          startDrag(e);
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          startDrag(e);
        }}
        className={`knurl-translate ${dragging ? "knurl-selected" : ""}`}
        type="button"
        style={{
          touchAction: "none",
          userSelect: "none",
        }}
      >
        &#8982;
      </button>
      <input
        className="knurl-number-input knurl-fixed"
        type="text"
        size="7"
        value={boundX.text}
        onInput={(e) => boundX.setValue(e.currentTarget.value)}
        onChange={boundX.handleBlur}
      />
      <input
        className="knurl-number-input knurl-fixed"
        type="text"
        size="7"
        value={boundY.text}
        onInput={(e) => boundY.setValue(e.currentTarget.value)}
        onChange={boundY.handleBlur}
      />
      {dragging && (
        <div className="knurl-pad2">
          <svg
            width={styles.width}
            height={styles.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              borderRadius: styles.radius,
            }}
          >
            {/* background */}
            <rect
              width={styles.width}
              height={styles.height}
              fill="transparent"
              className="knurl-border"
              rx={styles.radius}
            />
            {/* grid lines */}
            <line
              x1={styles.width / 2}
              y1={0}
              x2={styles.width / 2}
              y2={styles.height}
              className="knurl-grid"
            />
            <line
              x1={0}
              y1={styles.height / 2}
              x2={styles.width}
              y2={styles.height / 2}
              className="knurl-grid"
            />

            {/* corner labels */}
            <text
              x={styles.space}
              y={styles.space}
              className="knurl-label"
              dominant-baseline="hanging"
              font-size="10"
            >
              {node.minX},{node.minY}
            </text>
            <text
              x={styles.width - styles.space}
              y={styles.space}
              dominant-baseline="hanging"
              className="knurl-label"
              font-size="10"
              text-anchor="end"
            >
              {node.maxX},{node.minY}
            </text>
            <text
              x={styles.space}
              y={styles.height - styles.space}
              className="knurl-label"
              font-size="10"
            >
              {node.minX},{node.maxY}
            </text>
            <text
              x={styles.width - styles.space}
              y={styles.height - styles.space}
              className="knurl-label"
              font-size="10"
              text-anchor="end"
            >
              {node.maxX},{node.maxY}
            </text>

            {/* position indicator circle */}
            <circle
              cx={((x - node.minX) / (node.maxX - node.minX)) * styles.width}
              cy={((y - node.minY) / (node.maxY - node.minY)) * styles.height}
              r={6}
              className="knurl-indicator"
            />
          </svg>
        </div>
      )}
    </>
  );
};

register("pad2", Pad2Control, {
  value: (node) => ({
    x: node.minX + (node.maxX - node.minX) * 0.5,
    y: node.minY + (node.maxY - node.minY) * 0.5,
  }),
  scale: 0.01,
  step: 0.01,
  minX: -1,
  maxX: 1,
  minY: -1,
  maxY: 1,
});
