// //CMS用
// import { pluginHtml } from '@rsbuild/plugin-html';
// import ejs from 'ejs';
// import fs from 'fs';


import { defineConfig } from '@rsbuild/core';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginGlsl } from 'rsbuild-plugin-glsl';

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  target: 'web',
  html: {
    outputStructure: 'nested',
  },
  server: {
    port: 1692,
    open: 'http://localhost:1692',
  },
  source: {
    entry: {
      script: { import: './src/js/script.js', html: false },
      style: { import: './src/css/style.scss', html: false },
    },
  },
  dev: {
    hmr: true,
    liveReload: true,
    watchFiles: {
      paths: ['./src/js/**/*.js', './src/css/**/*.scss', './public/**/*.html'],
    },
  },
  output: {
    filenameHash: false,
    distPath: { js: 'assets/js/', css: 'assets/css/' },
    copy: [
      { from: './src/img', to: 'assets/img' },
      // { from: './src/font', to: 'assets/font' },
    ],
    sourceMap: { css: isDev },
  },
  performance: { chunkSplit: { strategy: 'all-in-one' }, removeConsole: isProd },
  plugins: [pluginSass(), pluginGlsl()],
  tools: {
    cssLoader: {
      url: {
        filter: (url) => {
          if (/\/image\/font/.test(url)) {
            return false;
          }
          return true;
        },
      },
    },
  },
});
