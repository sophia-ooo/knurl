import "./controls/index.js";
import Panel from "./panel.js";
import { register } from "./registry.js";

export {
  /**
   * register a **custom control** so it can be referenced in panel config.
   *
   * ```js
   * import { register } from "knurl/external";
   * import Knob from "./Knob.jsx";
   *
   * register("knob", Knob, {
   *   showLabel: false,
   *   value: (node) => node.min ?? 0,
   * });
   * ```
   *
   * @param {string}   type - unique identifier used in the panel config.
   * @param {Function} component - preact component
   * @param {object}   [defaults] - optional defaults (layout, value, ...)
   *
   * @returns {void}
   */
  register,
};

export default {
  /**
   * create and mount a new knurl instance.
   *
   * the `config` parameter can be either:
   * - **array** a flat list of controls (wrapped in an implicit root `group`)
   * - **object** a single `group` containing nested `nodes`
   *
   * ```js
   * const panel = knurl.create(
   *   [
   *     { id: "speed", type: "range", min: 0, max: 10, value: 1 },
   *     { id: "color", type: "color", value: "#ff0055" },
   *   ],
   *   { mount: document.querySelector("#ui") }
   * );
   * ```
   *
   * @param {Object[]|Object} config - defines panel controls
   * @param {Object}          [options]
   * @param {HTMLElement}     [options.mount] - element to mount into
   * @param {boolean}         [options.throttleRendering=true] - batch renders
   * @param {boolean}         [options.injectStyles=true] - inject css once
   *
   * @returns {object} panel facade exposing:
   *  * `subscribe()` - listen to changes
   *  * `set()`       - set values only
   *  * `update()`    - update any control property
   *  * `get()`       - get current values
   *  * `destroy()`   - unmount the panel
   */
  create(config, options = {}) {
    const root = Array.isArray(config)
      ? { type: "group", label: "controls", nodes: config }
      : config;

    const instance = new Panel(root, {
      throttleRendering: true,
      injectStyles: true,
      classNames: [],
      ...options,
    });

    return {
      /**
       * subscribe to value changes.
       *
       * @overload subscribe(id, handler)
       * @param {string}               id - control identifier
       * @param {(value: any) => void} handler
       *        called when control of this id value changes
       *
       * @overload subscribe(handler)
       * @param {(id: string, value: any) => void} handler
       *        called when any control value changes
       *
       * @returns {() => void} disposer - call to stop listening
       */
      subscribe: instance.subscribe.bind(instance),

      /**
       * patch **any** control property: value, label, min/max, etc.
       *
       * @param {object}  updates - object of `id -> partial node`.
       * @param {object}  [options]
       * @param {boolean} [options.silent=false] - suppress subscriber callback
       */
      update: instance.update.bind(instance),

      /**
       * set one or more **values** (alias for `update({ id: { value }})`).
       *
       * @param {object}  values - object of `id -> value`
       * @param {object}  [options]
       * @param {boolean} [options.silent=false] - suppress subscriber callback
       */
      set: instance.set.bind(instance),

      /**
       * get a *shallow, immutable* snapshot of current values.
       *
       * @returns {object} object of `id -> value`.
       */
      get: instance.get.bind(instance),

      /**
       * unmount panel and remove listeners.
       */
      destroy: instance.destroy.bind(instance),
    };
  },
};
