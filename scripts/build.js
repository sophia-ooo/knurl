import * as esbuild from "esbuild";
import { minifyCSS } from "./minify-css.js";

const base = {
  entryPoints: ["src/index.js"],
  bundle: true,
  format: "esm",
  minify: true,
  loader: {
    ".js": "jsx",
    ".css": "text",
  },
  jsx: "automatic",
  jsxImportSource: "preact",
  plugins: [minifyCSS],
};

await esbuild.build({
  ...base,
  outfile: "dist/knurl.js",
});

await esbuild.build({
  ...base,
  outfile: "dist/knurl.external.js",
  external: ["preact", "preact/hooks", "preact/jsx-runtime"],
});
