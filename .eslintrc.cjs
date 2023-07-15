const { buildEslintConfig } = require("@snowcoders/renovate-config");

const config = buildEslintConfig({
  esm: true,
  prettier: true,
  typescript: true,
});

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
  },
};
