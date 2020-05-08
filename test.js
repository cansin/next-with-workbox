const withWorkbox = require("./index");

const dir = process.cwd();

describe("workbox", () => {
  it("can use WorkboxPlugin.InjectManifest", () => {
    const options = {
      workbox: {
        additionalManifestEntries: [
          { url: "/offline", revision: "fake-revision" },
        ],
        swSrc: "worker.js",
      },
    };
    const nextConfig = withWorkbox(options);

    const webpackConfig = nextConfig.webpack(
      { output: { publicPath: undefined }, plugins: [] },
      { dev: false, dir, isServer: false, config: options }
    );

    expect(nextConfig).toEqual({
      webpack: expect.any(Function),
      workbox: {
        additionalManifestEntries: [
          { revision: "fake-revision", url: "/offline" },
        ],
        swSrc: "worker.js",
      },
    });

    expect(webpackConfig).toEqual({
      output: { publicPath: undefined },
      plugins: [
        {
          apply: expect.any(Function),
          cleanAfterEveryBuildPatterns: [],
          cleanOnceBeforeBuildPatterns: [
            `${dir}/public/sw.js`,
            `${dir}/public/sw.js.map`,
          ],
          cleanStaleWebpackAssets: true,
          currentAssets: [],
          dangerouslyAllowCleanPatternsOutsideProject: false,
          dry: false,
          handleDone: expect.any(Function),
          handleInitial: expect.any(Function),
          initialClean: false,
          outputPath: "",
          protectWebpackAssets: true,
          removeFiles: expect.any(Function),
          verbose: false,
        },
        {
          alreadyCalled: false,
          config: {
            additionalManifestEntries: [
              { revision: "fake-revision", url: "/offline" },
            ],
            dontCacheBustURLsMatching: /^\/_next\/static\/.*/iu,
            exclude: [
              /^build-manifest\.json$/i,
              /^react-loadable-manifest\.json$/i,
              /.*\.js\.map/i,
            ],
            modifyURLPrefix: { "static/": "/_next/static/" },
            swDest: `${dir}/public/sw.js`,
            swSrc: `${dir}/worker.js`,
          },
        },
      ],
    });
  });

  it("can use WorkboxPlugin.GenerateSW", () => {
    const options = {
      workbox: {
        additionalManifestEntries: [
          { url: "/offline", revision: "fake-revision" },
        ],
      },
    };
    const nextConfig = withWorkbox(options);

    const webpackConfig = nextConfig.webpack(
      { output: { publicPath: undefined }, plugins: [] },
      { dev: false, dir, isServer: false, config: options }
    );

    expect(nextConfig).toEqual({
      webpack: expect.any(Function),
      workbox: {
        additionalManifestEntries: [
          { revision: "fake-revision", url: "/offline" },
        ],
      },
    });

    expect(webpackConfig).toEqual({
      output: { publicPath: undefined },
      plugins: [
        {
          apply: expect.any(Function),
          cleanAfterEveryBuildPatterns: [],
          cleanOnceBeforeBuildPatterns: [
            `${dir}/public/sw.js`,
            `${dir}/public/sw.js.map`,
          ],
          cleanStaleWebpackAssets: true,
          currentAssets: [],
          dangerouslyAllowCleanPatternsOutsideProject: false,
          dry: false,
          handleDone: expect.any(Function),
          handleInitial: expect.any(Function),
          initialClean: false,
          outputPath: "",
          protectWebpackAssets: true,
          removeFiles: expect.any(Function),
          verbose: false,
        },
        {
          alreadyCalled: false,
          config: {
            additionalManifestEntries: [
              { revision: "fake-revision", url: "/offline" },
            ],
            dontCacheBustURLsMatching: /^\/_next\/static\/.*/iu,
            exclude: [
              /^build-manifest\.json$/i,
              /^react-loadable-manifest\.json$/i,
              /.*\.js\.map/i,
            ],
            modifyURLPrefix: { "static/": "/_next/static/" },
            swDest: `${dir}/public/sw.js`,
          },
        },
      ],
    });
  });
});
