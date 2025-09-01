import { getComponent } from "./registry.js";

export const Control = ({ nodes, treeNode, update }) => {
  const node = nodes[treeNode.id];

  // visible option
  if (!node.visible) return null;

  const Component = getComponent(node);
  if (!Component) return null;

  const element = (
    <Component nodes={nodes} treeNode={treeNode} update={update} />
  );

  // layout option -- "block" means we don't wrap in .row
  if (node.layout === "block") {
    return element;
  }

  const showLabel = !(node.label === "" || node.label === null); // same as Group

  return (
    <div className="knurl-row" role="group" aria-label={node.label ?? node.id}>
      {showLabel && <span className="knurl-label">{node.label ?? node.id}</span>}
      <div className="knurl-control">{element}</div>
    </div>
  );
};
