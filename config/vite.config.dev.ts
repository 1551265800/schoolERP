import { mergeConfig } from "vite";
import baseConfig from "./vite.config.base";

export default mergeConfig(
  {
    mode: "development",
    server: {
      open: true,
      fs: {
        strict: true,
      },
      port: 8080,
     /*  proxy: {
        "/api": {
          target: "http://jckn75.natappfree.cc",
          changeOrigin: true,
          pathRewrite: {
            "^/api": "",
          }
        },
      }, */
    },
    plugins: [],
  },

  baseConfig
);
