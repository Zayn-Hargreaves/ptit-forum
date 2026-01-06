import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { fixupConfigRules } from "@eslint/compat";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Fix circular dependency issue by wrapping legacy configs
const patchedConfig = fixupConfigRules([...compat.extends("next/core-web-vitals", "next/typescript")]);

const eslintConfig = [
  // Global ignores must be first
  {
    ignores: [
      "**/node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "**/*.min.js",
      "**/*.stories.tsx",
      "**/*.stories.ts",
    ],
  },
  ...patchedConfig,
  eslintConfigPrettier,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_",
        },
      ],
    },
  },
];

export default eslintConfig;
