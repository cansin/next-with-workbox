# next-with-workbox
[![tests](https://github.com/cansin/next-with-workbox/actions/workflows/tests.yml/badge.svg)](https://github.com/cansin/next-with-workbox/actions/workflows/tests.yml)
[![codeql](https://github.com/cansin/next-with-workbox/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/cansin/next-with-workbox/actions/workflows/codeql-analysis.yml)
[![size](https://img.shields.io/bundlephobia/minzip/next-with-workbox)](https://bundlephobia.com/result?p=next-with-workbox)
[![dependencies](https://img.shields.io/librariesio/release/npm/next-with-workbox)](https://libraries.io/npm/next-with-workbox)
[![downloads](https://img.shields.io/npm/dm/next-with-workbox)](https://www.npmjs.com/package/next-with-workbox)
[![license](https://img.shields.io/github/license/cansin/next-with-workbox)](https://github.com/cansin/next-with-workbox/blob/master/LICENSE)

Higher order Next.js config to generate a [Workbox service worker](https://developers.google.com/web/tools/workbox).
It auto-magically sets up certain aspects like pre-caching `public` folder and cache busting exclusions in order
to get the most out of Workbox with Next.js.
Heavily inspired from [shadowwalker/next-pwa](https://github.com/shadowwalker/next-pwa).

## Install

```bash
npm install next-with-workbox --save
# or
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

Create your service worker at `/path/to/your-next-app/worker.js`

```js
import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);
```

Register your service worker at `/path/to/your-next-app/pages/_app.js`:

```js
import React, { useEffect } from "react";
import { Workbox } from "workbox-window";

function App({ Component, pageProps }) {
  useEffect(() => {
    if (
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      console.warn("Pwa support is disabled");
      return;
    }

    const wb = new Workbox("sw.js", { scope: "/" });
    wb.register();
  }, []);

  return <Component {...pageProps} />;
}

export default App;
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
    force: true,
  },
});
```

### Available Options

- **dest:** string - the destination folder to put generated files, relative to the project root.
  - defaults to `public`.
- **swDest:** string - the destination file to write the service worker code to.
  - defaults to `sw.js`.
- **swSrc:** string - the input file to read the custom service worker code from. Setting this
  switches to [InjectManifest](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.InjectManifest) plugin.
  If not set, [GenerateSW](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.GenerateSW) plugin
  is used.
  - defaults to `false`.
- **force:** boolean - whether to force enable Workbox in dev mode.
  - defaults to `false`.
