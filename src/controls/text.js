import { register } from "../registry.js";

const TextControl = ({ nodes, treeNode, update }) => {
  const node = nodes[treeNode.id];

  const handleInput = (e) => {
    update({ [node.id]: { value: e.currentTarget.value } });
  };

  if (node.multiline) {
    return (
      <textarea value={node.value} onInput={handleInput} rows={node.rows} />
    );
  }

  return <input type="text" value={node.value} onInput={handleInput} />;
};

register("text", TextControl, { value: "", multiline: false, rows: 4 });
