import { useBoundedNumber } from "./util.js";
import { register } from "../registry.js";

export const RangeControl = ({ nodes, treeNode, update }) => {
  const node = nodes[treeNode.id];

  const { text, setValue, handleBlur } = useBoundedNumber({
    value: node.value,
    min: node.min,
    max: node.max,
    commit: (v) => update({ [node.id]: { value: v } }),
  });

  return (
    <>
      <input
        type="range"
        value={text}
        min={node.min}
        max={node.max}
        step={node.step ?? 1}
        onInput={(e) => setValue(e.currentTarget.value)}
      />
      <input
        type="text"
        size="7"
        className="knurl-number-input knurl-fixed"
        value={text}
        onInput={(e) => setValue(e.currentTarget.value)}
        onChange={handleBlur}
      />
    </>
  );
};

register("range", RangeControl, {
  value: (node) => node.min ?? 0,
});
