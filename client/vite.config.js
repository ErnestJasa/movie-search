import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/movie-search/",
  plugins: [react()],
  // server: {
  //   https: {
  //     key: fs.readFileSync(path.resolve("./", "localhost-key.pem")),
  //     cert: fs.readFileSync(path.resolve("./", "localhost.pem")),
  //   },
  // },
});
