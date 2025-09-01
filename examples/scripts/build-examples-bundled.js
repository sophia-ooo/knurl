import * as esbuild from "esbuild";
import path from "node:path";

const entryPoints = [
  `hello/index.js`,
  `p5-demo/index.js`,
  `particles/index.js`,
  `playground/index.js`,
  `throttle/index.js`,
  `theming/index.js`,
  `paint/index.js`,
];

console.log(`building bundled examples:`);
console.log(entryPoints.join("\n"));

await esbuild.build({
  entryPoints,
  outdir: ".",
  outbase: ".",
  entryNames: "[dir]/bundle",
  bundle: true,
  minify: true,
  format: "esm",
  plugins: [
    {
      name: "knurl-alias",
      setup(build) {
        build.onResolve({ filter: /^knurl$/ }, () => ({
          path: path.resolve("../dist/knurl.js"),
        }));
      },
    },
  ],
});

console.log("done.");
