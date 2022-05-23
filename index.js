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
            force = false,
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

      if (dev && !force) {
        console.log("> Progressive Web App is disabled");
        return config;
      }

      const swDestPath = path.join(options.dir, dest, swDest);

      console.log("> Progressive web app is enabled using Workbox");
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
          .sync("**/*", {
            cwd: dest,
            nodir: true,
          })
          .filter((f) => f.indexOf(swDest) !== 0)
          .map((f) => ({
            url: `/${f}`,
            revision: getRevision(`public/${f}`),
          }))
          .concat(additionalManifestEntries),
        exclude: [
          /^build-manifest\.json$/i,
          /^react-loadable-manifest\.json$/i,
          /\/_error\.js$/i,
          /\.js\.map$/i,
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
        console.log('> Using "WorkboxPlugin.InjectManifest" plugin');
        config.plugins.push(
          new WorkboxPlugin.InjectManifest({
            swSrc: swSrcPath,
            ...defaultWorkboxOptions,
            ...workboxOptions,
          })
        );
      } else {
        console.log('> Using "WorkboxPlugin.GenerateSW" plugin');
        config.plugins.push(
          new WorkboxPlugin.GenerateSW({
            ...defaultWorkboxOptions,
            ...workboxOptions,
          })
        );
      }

      console.log("> Progressive web app configuration complete");
      return config;
    },
  };
}

module.exports = withWorkbox;
