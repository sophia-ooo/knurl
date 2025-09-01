const registry = {};

const globalDefaults = {
  layout: "row",
  visible: true,
};

export const register = (type, component, controlDefaults = {}) => {
  registry[type] = {
    ...globalDefaults,
    ...controlDefaults,
    component,
  };
};

const controlRegistered = (type) => {
  if (!(type in registry)) {
    console.warn(`control of type "${type}" is requested but not registered`);
    return false;
  }
  return true;
};

export const getDefaults = (node) => {
  if (!controlRegistered(node.type)) return undefined;

  const { component, ...defaults } = registry[node.type];

  return defaults;
};

export const getComponent = (node) => {
  if (!controlRegistered(node.type)) return undefined;

  const { component, ...defaults } = registry[node.type];

  return component;
};
