import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.browser,
    }
  },
  pluginJs.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,  // Adding node globals for the environment
    },
    rules: {
      "eqeqeq": "error",
      "no-undef": "error",
      "no-unused-vars": ["error", { "args": "none" }],
    }
  }
];

