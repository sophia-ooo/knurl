import { render } from "preact";
import { Control } from "./control.js";
import { injectStyles, createContainer, initializeState } from "./util.js";

const ALL = Symbol("all");

export default class Panel {
  constructor(config, options) {
    const [nodes, root] = initializeState(config);
    this.nodes = nodes;
    this.root = root;
    this.container = options.mount ?? createContainer();
    this.options = options;
    this.subscribers = new Map();
    this.raf = null;

    if (options.injectStyles) injectStyles();

    this.render();
  }

  render() {
    const commit = () => {
      render(
        <div className={`knurl ${this.options.classNames.join(" ")}`}>
          <Control
            nodes={this.nodes}
            treeNode={this.root}
            update={this.handleUpdate.bind(this)}
          />
        </div>,
        this.container
      );
    };

    if (!this.options.throttleRendering) {
      commit();
      return;
    }

    if (this.options.throttleRendering && !this.raf) {
      this.raf = requestAnimationFrame(() => {
        commit();
        this.raf = null;
      });
    } // else -- an update is scheduled, no need to render
  }

  handleUpdate(updates, { silent = false, event = false } = {}) {
    if (typeof updates !== "object") {
      console.warn("could not set values: invalid values object");
      return;
    }

    for (const id in updates) {
      const node = this.nodes[id];
      if (!node) continue;

      const update = updates[id];

      if (!event) {
        this.nodes[id] = {
          ...node,
          ...update,
        };
      }

      if ("value" in update && !silent) {
        this.notifySubscribers(id, updates[id].value);
      }
    }

    this.render();
  }

  notifySubscribers(id, value) {
    this.subscribers.get(id)?.forEach((handler) => handler(value));
    this.subscribers.get(ALL)?.forEach((handler) => handler(id, value));
  }

  subscribe(idOrHandler, maybeHandler) {
    const id = typeof idOrHandler === "string" ? idOrHandler : ALL;
    const handler =
      typeof maybeHandler === "function"
        ? maybeHandler
        : typeof idOrHandler === "function"
          ? idOrHandler
          : undefined;

    if (handler === undefined) {
      console.warn("could not subscribe: no handler");
      return;
    }

    if (!this.subscribers.has(id)) {
      this.subscribers.set(id, []);
    }
    this.subscribers.get(id).push(handler);

    return () => {
      const handlers = this.subscribers.get(id);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      } else {
        console.warn("could not unsubscribe: could not find handler");
      }
    };
  }

  set(values, options) {
    const newValues = {};
    for (const id in values) {
      newValues[id] = { value: values[id] };
    }

    this.handleUpdate(newValues, options);
  }

  update(updates, options) {
    this.handleUpdate(updates, { ...options, event: false });
  }

  get() {
    const values = {};
    for (const id in this.nodes) {
      const node = this.nodes[id];
      const value = node?.value;
      if (value !== undefined) {
        values[id] = value;
      }
    }
    return values;
  }

  destroy() {
    // cancel queued renders
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }

    // empty the container
    render(null, this.container);

    if (!this.options.mount) {
      this.container.remove();
    }

    // empty the subscribers
    this.subscribers.clear();

    // empty the values
    this.values = {};
  }
}
