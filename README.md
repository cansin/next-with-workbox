# next-with-workbox

Higher order Next.js config to generate a [Workbox service worker](https://developers.google.com/web/tools/workbox).
Heavily inspired from [shadowwalker/next-pwa](https://github.com/shadowwalker/next-pwa).

![size](https://img.shields.io/bundlephobia/minzip/next-with-sourcemap.svg) ![dependencies](https://img.shields.io/david/cansin/next-with-workbox.svg) ![build](https://img.shields.io/travis/com/cansin/next-with-workbox) ![downloads](https://img.shields.io/npm/dt/next-with-workbox) ![license](https://img.shields.io/npm/l/next-with-workbox.svg)

## Install

```bash
yarn add next-with-workbox
```

## Basic Usage

Update or create `next.config.js` with

```js
const withWorkbox = require("next-with-workbox");

module.exports = withWorkbox({
  workbox: {
    swSrc: "worker.js",
  },
  // .
  // ..
  // ... other Next.js config
});
```

Add `public/sw.js` and `public/sw.js.map` to your `.gitignore`

```git
public/sw.js
public/sw.js.map
```

## Configuration

There are options you can use to customize the behavior of this plugin
by adding `workbox` object in the Next.js config in `next.config.js`.
Alongside those documented `workbox` options below, this library would
also pass through any [Workbox plugin options](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin)
to the appropriate plugin

```js
const withWorkbox = require("next-with-workbox");

module.exports = withWorkbox({
  workbox: {
    dest: "public",
    swDest: "sw.js",
    swSrc: "worker.js",
  },
});
```

### Available Options

- **dest:** string - the destination folder to put generated files, relative to the project root.
  - defaults to `public`.
- **swDest:** string - the destination file to write the service worker code to.
  - defaults to `sw.js`.
- **swDest:** string - the input file to read the custom service worker code from. Settings this automatically
switches to [InjectManifest](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.InjectManifest) plugin.
If not set, [GenerateSW](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.GenerateSW) plugin
is used.
  - defaults to `false`.