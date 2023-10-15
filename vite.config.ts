import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import { resolve } from "path";
import vueJsx from "@vitejs/plugin-vue-jsx";
import VueI18n from "@intlify/unplugin-vue-i18n/vite";
import Pages from "vite-plugin-pages";
import Markdown from "vite-plugin-vue-markdown";
import LinkAttributes from "markdown-it-link-attributes";
import Shiki from "markdown-it-shiki";
import AutoImport from "unplugin-auto-import/vite";
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    AutoImport({
      imports: ["vue"],
      dts: "./src/auto-import.d.ts", //避免ts报错问题
    }),
    vueJsx(),
    UnoCSS(),
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [resolve(__dirname, "./src/locales/**")],
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
    Pages({
      dirs: "src/pages",
      extensions: ["vue", "tsx"],
    }),
    Markdown({
      wrapperClasses: "prose prose-sm m-auto text-left",
      headEnabled: true,
      markdownItSetup(md) {
        // https://prismjs.com/
        md.use(Shiki, {
          theme: {
            light: "vitesse-light",
            dark: "vitesse-dark",
          },
        });
        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: "_blank",
            rel: "noopener",
          },
        });
      },
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      '/api/rbac': {
        target: 'http://localhost:30001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rbac/, ""),


      },
      '/api/deploy': {
        target: 'http://localhost:30003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deploy/, ""),
      }
    }
  }
});
