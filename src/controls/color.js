import { useState, useEffect } from "preact/hooks";
import { getDefaults, register } from "../registry.js";

const defaultValue = (n) => "#ffffff";

const ColorControl = ({ nodes, treeNode, update }) => {
  const node = nodes[treeNode.id];
  const [value, setValue] = useState(node.value);
  const [lastValid, setLastValid] = useState(node.value);

  useEffect(() => {
    setValue(node.value);
  }, [node.value]);

  const isValid = (input) =>
    input.startsWith("#") && input.length === 7 && CSS.supports("color", input);

  const validate = (e) => {
    const inputValue = e.currentTarget.value;
    const validValue = isValid(inputValue) ? inputValue : lastValid;

    update({ [node.id]: { value: validValue } });
    setValue(validValue);
  };

  const handleInput = (e) => {
    const inputValue = e.currentTarget.value;

    if (!isValid(inputValue)) return;

    update({ [node.id]: { value: inputValue } });
    setLastValid(inputValue);
  };

  return (
    <>
      <input
        type="color"
        value={value}
        onInput={handleInput}
        className="knurl-color-picker"
      />
      <input
        type="text"
        className="knurl-fixed"
        size="7"
        value={value}
        onInput={handleInput}
        onChange={validate}
      />
    </>
  );
};

register("color", ColorControl, { value: defaultValue });
