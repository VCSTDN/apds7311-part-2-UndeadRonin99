// eslint.config.js
export default [
    {
      ignores: ["node_modules/**"],
    },
    {
      files: ["**/*.js"],
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      rules: {
        semi: ["error", "always"],
        quotes: ["error", "double"],
      },
    },
  ];
  