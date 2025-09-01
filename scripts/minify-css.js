import * as esbuild from "esbuild";
import fs from "node:fs/promises";

export const minifyCSS = {
  name: "minify-css-text",
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const src = await fs.readFile(args.path, "utf8");

      const result = await esbuild.build({
        stdin: {
          contents: src,
          loader: "css",
        },
        bundle: false,
        minify: true,
        write: false,
      });

      const css = result.outputFiles[0].text.trim();
      return { contents: css, loader: "text" };
    });
  },
};
