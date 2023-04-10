const { buildEslintConfig } = require("@snowcoders/renovate-config");

module.exports = {
  ...buildEslintConfig({
    esm: true,
    prettier: true,
    typescript: true,
  }),
};
