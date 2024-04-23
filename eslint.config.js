import globals from "globals";
import babelParser from "@babel/eslint-parser";
import jest from "eslint-plugin-jest";
import jestDom from "eslint-plugin-jest-dom";
import testingLibraryReact from "eslint-plugin-testing-library/react";
import vkBansalConfig  from "eslint-config-vkbansal";
import vkBansalReactConfig  from "eslint-config-vkbansal/react";

export default [
  {
    ignores: ["examples/bundle.js"],
  },
  vkBansalConfig,
  vkBansalReactConfig,
  {
    languageOptions: {
      parser: babelParser,
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "react/no-array-index-key": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/tests/*.js"],
    plugins: {
      jest,
      "jest-dom": jestDom,
      "testing-library": testingLibraryReact,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...jest.configs['flat/recommended'].rules,
      ...jestDom.configs['flat/recommended'].rules,
      "prefer-arrow-callback": "off",
      "no-mixed-requires": "off",
      // This disallows using direct Node properties (eg: firstChild), but we
      // have legitimate uses:
      "testing-library/no-node-access": "off",
    }
  },
];
