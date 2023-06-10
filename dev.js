#!/usr/bin/env node
const { build } = require("estrella");

const port = process.env.PORT || 8080;

build({
  entry: ["./src/index.ts", "./src/style.css"],
  outdir: "dist",
  watch: true,
  bundle: true,
  tslint: "on",
  sourcemap: true,
  minify: false,
  run: `npx serve -n -l ${port} dist`,
});
