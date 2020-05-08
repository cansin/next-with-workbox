const path = require("path");
const crypto = require("crypto");

const glob = require("glob");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

const getRevision = (file) =>
  crypto.createHash("md5").update(Buffer.from(file)).digest("hex");

function withWorkbox(nextConfig = {}) {
  return {
    ...nextConfig,
    webpack(config, options) {
      if (typeof nextConfig.webpack === "function") {
        config = nextConfig.webpack(config, options);
      }

      const {
        dev,
        isServer,
        config: {
          workbox: {
            additionalManifestEntries = [],
            dest = "public",
            dontCacheBustURLsMatching = false,
            exclude = [],
            modifyURLPrefix = {},
            swDest = "sw.js",
            swSrc = false,
            ...workboxOptions
          } = {},
        },
      } = options;

      if (isServer) {
        return config;
      }

      if (dev) {
        console.log("> Progressive web app  is disabled");
        return config;
      }

      const swDestPath = path.join(options.dir, dest, swDest);

      console.log("> Compiling progressive web app");
      console.log(`> Service worker destination path: "${swDestPath}"`);

      config.plugins.push(
        new CleanWebpackPlugin({
          cleanOnceBeforeBuildPatterns: [swDestPath, `${swDestPath}.map`],
        })
      );

      const defaultDontCacheBustURLsMatching = /^\/_next\/static\/.*/iu;
      const defaultWorkboxOptions = {
        swDest: swDestPath,
        dontCacheBustURLsMatching: dontCacheBustURLsMatching
          ? new RegExp(
              `${dontCacheBustURLsMatching.source}|${defaultDontCacheBustURLsMatching.source}`,
              "iu"
            )
          : defaultDontCacheBustURLsMatching,
        additionalManifestEntries: glob
          .sync(`{,"**/*","!${swDest}","!${swDest}.map"}`, {
            cwd: dest,
          })
          .map((f) => ({
            url: `/${f}`,
            revision: getRevision(`public/${f}`),
          }))
          .concat(additionalManifestEntries),
        exclude: [
          /^build-manifest\.json$/i,
          /^react-loadable-manifest\.json$/i,
          /.*\.js\.map/i,
          ...exclude,
        ],
        modifyURLPrefix: {
          [`${config.output.publicPath || ""}static/`]: "/_next/static/",
          ...modifyURLPrefix,
        },
      };

      if (swSrc) {
        const swSrcPath = path.join(options.dir, swSrc);
        console.log(`> Service worker source path: "${swSrcPath}"`);
        console.log('> Using "WorkboxPlugin.InjectManifest"');
        config.plugins.push(
          new WorkboxPlugin.InjectManifest({
            swSrc: swSrcPath,
            ...defaultWorkboxOptions,
            ...workboxOptions,
          })
        );
      } else {
        console.log('> Using "WorkboxPlugin.GenerateSW"');
        config.plugins.push(
          new WorkboxPlugin.GenerateSW({
            ...defaultWorkboxOptions,
            ...workboxOptions,
          })
        );
      }

      return config;
    },
  };
}

module.exports = withWorkbox;
