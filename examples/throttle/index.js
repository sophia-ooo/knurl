import knurl from "knurl";

// ============================================================================
// DEMO LOGIC - RAF Counting
// ============================================================================

// Override window's RAF to count calls
const originalRAF = window.requestAnimationFrame;
let rafCallCount = 0;

window.requestAnimationFrame = (callback) => {
  rafCallCount++;
  return originalRAF.call(this, (timestamp) => callback(timestamp));
};

// ============================================================================
// LIBRARY SETUP
// ============================================================================

const panelWithRAF = knurl.create(
  {
    type: "group",
    label: "throttleRendering: true (default)",
    nodes: [
      { id: "sets", type: "display" },
      { id: "renders", type: "display" },
    ],
  },
  {
    mount: document.querySelector("#with-raf"),
  }
);

const panelWithoutRAF = knurl.create(
  {
    type: "group",
    label: "throttleRendering: false",
    nodes: [
      { id: "sets", type: "display" },
      { id: "renders", type: "display" },
    ],
  },
  {
    throttleRendering: false,
    mount: document.querySelector("#no-raf"),
  }
);

// ============================================================================
// DEMO LOGIC - Test Loop
// ============================================================================

let counter = 0;
const testInterval = setInterval(() => {
  counter++;

  // Update both panels with the same value
  panelWithRAF.set({ sets: counter });
  panelWithoutRAF.set({ sets: counter });

  // Stop after 600 updates and show results
  if (counter >= 600) {
    clearInterval(testInterval);

    // Show final render counts
    panelWithRAF.set({ renders: rafCallCount });
    panelWithoutRAF.set({ renders: counter });
  }
}, 0);
