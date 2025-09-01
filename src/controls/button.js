import { register } from "../registry.js";

const ButtonControl = ({ nodes, treeNode, update }) => {
  const node = nodes[treeNode.id];

  return (
    <button
      type="button"
      onClick={() => update({ [node.id]: { value: true } }, { event: true })}
    >
      {node.text ?? node.id}
    </button>
  );
};

register("button", ButtonControl, { label: null });
