import cssText from "./styles.css";
import { getDefaults } from "./registry.js";

let id = 0;
const nextId = (ids) => `node ${id++}`;

export const initializeState = (configNode) => {
  const { id = nextId(), nodes: children = [], ...rest } = configNode;

  const nodes = {};
  const tree = { id, nodes: [] };
  const node = { id };

  // apply defaults
  const defaults = getDefaults(configNode);
  for (const key in defaults) {
    // defaults may be a function, if so, run the function with
    // the node as the argument
    //
    // defaults for range, select need access to whole node
    // to calculate the default value (.min, .options, etc).
    typeof defaults[key] === "function"
      ? (node[key] = defaults[key]({ ...defaults, ...configNode }))
      : (node[key] = defaults[key]);
  }

  // apply user overrides
  Object.assign(node, rest);

  nodes[id] = node;

  if (children.length > 0) {
    children.forEach((child) => {
      const [childNodes, childTree] = initializeState(child);
      Object.assign(nodes, childNodes);
      tree.nodes.push(childTree);
    });
  }

  return [nodes, tree];
};

export const createContainer = () => {
  const container = document.createElement("div");
  container.classList.add("knurl-container");
  document.body.append(container);
  return container;
};

export const injectStyles = () => {
  if (!document.querySelector("style[data-knurl]")) {
    const style = document.createElement("style");
    style.textContent = cssText;
    style.setAttribute("data-knurl", "true");
    document.head.appendChild(style);
  }
};
