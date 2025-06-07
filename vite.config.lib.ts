import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    dts({
      include: ["lib/**/*.ts"],
      exclude: ["**/*.spec.ts", "**/*.test.ts"],
      outDir: "dist",
      rollupTypes: true,
      tsconfigPath: "./tsconfig.build.json",
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "ArrowExpress",
      fileName: format => `index.${format === "es" ? "js" : `${format}.js`}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["express"],
      output: {
        globals: {
          express: "express",
        },
      },
    },
    outDir: "dist",
    sourcemap: true,
    minify: false,
    target: "es2022",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "lib"),
    },
  },
  esbuild: {
    target: "es2022",
  },
});
