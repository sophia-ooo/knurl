import { useState } from "preact/hooks";
import { register } from "../registry.js";
import { Control } from "../control.js";

export const Group = ({ nodes, treeNode, update }) => {
  const node = nodes[treeNode.id];

  const children = treeNode.nodes.map((treeNodeChild, i) => (
    <Control
      key={treeNodeChild.id}
      nodes={nodes}
      treeNode={treeNodeChild}
      update={update}
    />
  ));

  const expandStyle = node.expanded ? "knurl-expanded" : "knurl-collapsed";
  const labelStyle = node.showLabel ? "knurl-show-label" : "knurl-hide-label";
  const showLabel = !(node.label === "" || node.label === null); // same as Control

  return (
    <div className={`knurl-group ${expandStyle} ${labelStyle}`}>
      {showLabel && (
        <span
          className="knurl-label"
          onClick={() => {
            if (node.expandable) {
              update({ [node.id]: { expanded: !node.expanded } });
            }
          }}
        >
          {node.expandable && <span className="knurl-icon">&#8963;</span>}
          {node.label ?? node.id}
        </span>
      )}
      <div className="knurl-group-container">{children}</div>
    </div>
  );
};

register("group", Group, {
  layout: "block",
  expandable: true,
  expanded: true,
});
