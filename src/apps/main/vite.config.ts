import { defineConfig } from "vite";
import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import solidPlugin from "vite-plugin-solid";
import istanbulPlugin from "vite-plugin-istanbul";
import swc from "unplugin-swc";
import NoranekoTestPlugin from "vitest-noraneko/plugin.ts";
import deno from "@deno/vite-plugin";

import { generateJarManifest } from "../common/scripts/gen_jarmanifest";

const r = (dir: string) => {
  return path.resolve(import.meta.dirname, dir);
};

export default defineConfig({
  publicDir: r("public"),
  server: {
    port: 5181,
    strictPort: true,
  },
  define: {
    "import.meta.env.__BUILDID2__": '"placeholder"',
  },
  build: {
    sourcemap: true,
    reportCompressedSize: false,
    minify: false,
    cssMinify: false,
    emptyOutDir: true,
    assetsInlineLimit: 0,
    target: "firefox133",

    rollupOptions: {
      //https://github.com/vitejs/vite/discussions/14454
      preserveEntrySignatures: "allow-extension",

      input: {
        core: r("./core/index.ts"),
        "about-preferences": r("./about/preferences/index.ts"),
        "about-newtab": r("./about/newtab/index.ts"),
        //env: "./experiment/env.ts",
      },
      output: {
        esModule: true,
        entryFileNames: "[name].js",
        manualChunks(id, meta) {
          if (id.includes("node_modules")) {
            const arr_module_name = id
              .toString()
              .split("node_modules/")[1]
              .split("/");
            if (arr_module_name[0] === ".pnpm") {
              return `external/${arr_module_name[1].toString()}`;
            }
            return `external/${arr_module_name[0].toString()}`;
          }
          if (id.includes(".svg")) {
            return `svg/${id.split("/").at(-1)?.replaceAll("svg_url", "glue")}`;
          }
          try {
            const re = new RegExp(/\/core\/common\/([A-Za-z-]+)/);
            const result = re.exec(id);
            if (result?.at(1) != null) {
              return `modules/${result[1]}`;
            }
          } catch {}
        },
        assetFileNames(assetInfo) {
          if (assetInfo.originalFileNames.at(0)?.endsWith(".svg")) {
            return "assets/svg/[name][extname]";
          }
          if (assetInfo.originalFileNames.at(0)?.endsWith(".css")) {
            return "assets/css/[name][extname]";
          }
          return "assets/[name][extname]";
        },
        chunkFileNames(chunkInfo) {
          return "assets/js/[name].js";
        },
      },
    },

    outDir: r("_dist"),
  },

  //? https://github.com/parcel-bundler/lightningcss/issues/685
  //? lepton uses System Color and that occurs panic.
  //? when the issue resolved, gladly we can use lightningcss
  // css: {
  //   transformer: "lightningcss",
  // },

  plugins: [
    tsconfigPaths(),
    {
      name: "solid-xul-refresh",
      apply: "serve",
      handleHotUpdate(ctx) {
        console.log(`handle hot : ${JSON.stringify(ctx.modules)}`);
      },
    },
    solidPlugin({
      // dev:true,
      solid: {
        generate: "universal",
        moduleName: "@nora/solid-xul",
        contextToCustomElements: false,
        hydratable: true,
      },
      hot: false,
    }),
    swc.vite({
      exclude: ["*solid-xul*", "*solid-js*"],
      "jsc": {
        target: "esnext",
        "parser": {
          "syntax": "typescript",
          "decorators": true,
        },
        transform: {
          decoratorMetadata: true,
          decoratorVersion: "2022-03",
        },
      },
    }),
    {
      name: "gen_jarmn",
      enforce: "post",
      async generateBundle(options, bundle, isWrite) {
        this.emitFile({
          type: "asset",
          fileName: "jar.mn",
          needsCodeReference: false,
          source: await generateJarManifest(bundle, {
            prefix: "content",
            namespace: "noraneko",
            register_type: "content",
          }),
        });
        this.emitFile({
          type: "asset",
          fileName: "moz.build",
          needsCodeReference: false,
          source: `JAR_MANIFESTS += ["jar.mn"]`,
        });
      },
    },
    istanbulPlugin({}),
    {
      name: "noraneko_component_hmr_support",
      enforce: "pre",
      "apply": "serve",
      transform(code, id, options) {
        if (
          code.includes("\n@noraComponent") &&
          !code.includes("//@nora-only-dispose")
        ) {
          code += "\n";
          code += [
            "/**",
            " * THIS IS AUTOGENERATED BY noraneko_component_hmr_support",
            " * PLEASE CHECK /src/apps/main/vite.config.ts",
            " */",
            "if (import.meta.hot) {",
            "  import.meta.hot.accept((m) => {",
            "    if(m && m.default) {",
            "      new m.default();",
            "    }",
            "  })",
            "}",
            "/**",
            " * AUTOGENERATED END",
            " */",
          ].join("\n");
          return {
            code,
          };
        }
      },
    },
    NoranekoTestPlugin(),
    deno(),
  ],
  optimizeDeps: {
    include: [
      "./node_modules/@nora",
      "solid-js",
      "solid-js/web",
      "solid-js/store",
      "solid-js/html",
      "solid-js/h",
    ],
  },
  resolve: {
    dedupe: [
      "solid-js",
      "solid-js/web",
      "solid-js/store",
      "solid-js/html",
      "solid-js/h",
    ],
    preserveSymlinks: true,
  },
});
