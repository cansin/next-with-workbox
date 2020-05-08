module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
  ],
  overrides: [
    {
      files: ["test.js"],
      env: { jest: true },
    },
  ],
  parser: "babel-eslint",
  rules: {
    "import/order": ["error", { "newlines-between": "always" }],
  },
};
