module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["@svgr/babel-plugin-transform-react-native-svg"],
      [
        "module-resolver",
        {
          extensions: [
            ".ios.ts",
            ".android.ts",
            ".ts",
            ".ios.tsx",
            ".android.tsx",
            ".tsx",
            ".jsx",
            ".js",
            ".json",
            ".png",
          ],
          alias: {
            "@assets": "./assets",
            "@": "./src",
          },
        },
      ],
    ],
  }
}
