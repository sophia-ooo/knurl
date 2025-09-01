import { register } from "../registry.js";

const ToggleControl = ({ nodes, treeNode, update }) => {
  const node = nodes[treeNode.id];

  return (
    <input
      type="checkbox"
      checked={node.value}
      onInput={(e) => update({ [node.id]: { value: e.currentTarget.checked } })}
    />
  );
};

register("toggle", ToggleControl, {
  value: (n) => false,
});
