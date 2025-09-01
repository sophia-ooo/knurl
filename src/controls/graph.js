import { useRef, useState, useEffect } from "preact/hooks";

import { register } from "../registry.js";

const GraphControl = ({ nodes, treeNode, update }) => {
  const node = nodes[treeNode.id];
  const canvasRef = useRef(null);
  const [history, setHistory] = useState(Array(node.samples).fill(0));
  const [range, setRange] = useState({ min: null, max: null });

  useEffect(() => {
    setHistory((prev) => {
      const newHistory = [...prev, node.value];
      return newHistory.slice(-node.samples);
    });

    setRange((prev) => ({
      min: prev.min === null ? node.value : Math.min(prev.min, node.value),
      max: prev.max === null ? node.value : Math.max(prev.max, node.value),
    }));
  }, [node]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const width = rect.width;
    const height = node.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.scale(dpr, dpr);

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.clearRect(0, 0, width, height);

    const panel = canvas.closest(".knurl");
    const computedStyle = getComputedStyle(panel);
    const fillColor =
      computedStyle.getPropertyValue("--panel-fg").trim() || "#aaa";

    const min = node.min ?? range.min ?? 0;
    const max = node.max ?? range.max ?? 1;
    const valueRange = max - min || 1;
    const barWidth = (1 / (node.samples - 1)) * width;

    ctx.fillStyle = fillColor;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, height);

    history.forEach((sample, i) => {
      const barHeight = ((sample - min) / valueRange) * height;
      const x = i * barWidth;
      const y = height - barHeight;
      ctx.lineTo(x, y);
    });

    ctx.lineTo(width, height);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.font = "10px ui-monospace, monospace";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText(max, 3, 0);
    ctx.textBaseline = "bottom";
    ctx.fillText(min, 3, height);
  }, [history, range, node]);

  return <canvas className="knurl-graph" ref={canvasRef} height={node.height} />;
};

register("graph", GraphControl, {
  height: 60,
  samples: 60,
});
