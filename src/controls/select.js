import { register } from "../registry.js";
import { normalizeOptions } from "./util.js";

const SelectControl = ({ nodes, treeNode, update }) => {
  const node = nodes[treeNode.id];

  const normalizedOptions = normalizeOptions(node.options);

  const handleChange = (e) => {
    const index = Number(e.currentTarget.value);
    const value = normalizedOptions[index].value;
    update({ [node.id]: { value } });
  };

  const options = normalizedOptions.map(({ label }, i) => (
    <option key={label} value={i}>
      {label}
    </option>
  ));

  const index = normalizedOptions.findIndex(
    ({ value }) => value === node.value
  );

  return (
    <select value={index < 0 ? "" : index} onChange={handleChange}>
      {options}
    </select>
  );
};

register("select", SelectControl, {
  value: (n) => normalizeOptions(n.options)[0]?.value,
});
