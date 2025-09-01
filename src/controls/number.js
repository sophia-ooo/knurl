import { useBoundedNumber } from "./util.js";
import { register } from "../registry.js";

export const NumberControl = ({ nodes, treeNode, update }) => {
  const node = nodes[treeNode.id];

  const { text, setValue, handleBlur } = useBoundedNumber({
    value: node.value,
    min: node.min,
    max: node.max,
    commit: (v) => update({ [node.id]: { value: v } }),
  });

  return (
    <input
      className="knurl-number-input"
      type="text"
      value={text}
      onInput={(e) => setValue(e.currentTarget.value)}
      onChange={handleBlur}
    />
  );
};

register("number", NumberControl, { value: () => 0 });
