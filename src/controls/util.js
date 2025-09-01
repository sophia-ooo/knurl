import { useState, useEffect } from "preact/hooks";

const isEmpty = (s) => s.trim() === "";

const isNumeric = (n) => isFinite(n);

const willFormat = (n, next) => String(n) !== next;

const withinBounds = (n, min, max) => n >= min && n <= max;

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

// shared behaviors for number validation and boundedness
export const useBoundedNumber = ({
  value,
  min = -Infinity,
  max = Infinity,
  commit,
}) => {
  const [text, setText] = useState(String(value));
  const [lastValid, setLastValid] = useState(value);

  useEffect(() => {
    setText(String(value));
    setLastValid(value);
  }, [value]);

  function setValue(raw) {
    // we only commit the number value while typing if:
    // - the number is valid (finite value and within bounds)
    // - the number, when parsed and formatted, will be the same exactly as it
    //   is input (avoids annoying updates while typing, like the insertion
    //   of a "0" for decimal numbers, and other stuff)

    const next = String(raw);
    setText(next);

    if (isEmpty(next)) return;

    const num = Number(next);

    if (
      !isNumeric(num) ||
      !withinBounds(num, min, max) ||
      willFormat(num, next)
    )
      return;

    setLastValid(num);
    commit(num);
  }

  function handleBlur() {
    if (isEmpty(text) || !isNumeric(Number(text))) {
      // the entered value is not a number. revert to last valid value
      setText(String(lastValid));
      return;
    }

    const num = Number(text);

    // bound the value if needed
    const clamped = clamp(num, min, max);

    setText(String(clamped));
    setLastValid(clamped);
    commit(clamped);
  }

  return { value, text, setValue, handleBlur };
};

export const normalizeOptions = (raw) => {
  if (
    Array.isArray(raw) &&
    raw.every(
      (item) =>
        item != null &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        "label" in item &&
        "value" in item
    )
  ) {
    return raw;
  }

  if (Array.isArray(raw)) {
    return raw.map((item) => ({
      label: String(item),
      value: item,
    }));
  }

  if (raw && typeof raw === "object") {
    return Object.entries(raw).map(([label, value]) => ({
      label,
      value,
    }));
  }

  return [];
};
