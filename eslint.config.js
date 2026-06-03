import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

const jsxUsesVars = {
  rules: {
    "jsx-uses-vars": {
      create(context) {
        const sourceCode = context.sourceCode;

        function markNameAsUsed(name, node) {
          sourceCode.markVariableAsUsed(name, node);
        }

        function markJsxNameAsUsed(node) {
          if (!node) {
            return;
          }

          if (node.type === "JSXIdentifier") {
            markNameAsUsed(node.name, node);
            return;
          }

          if (node.type === "JSXMemberExpression") {
            markJsxNameAsUsed(node.object);
          }
        }

        return {
          JSXOpeningElement(node) {
            markJsxNameAsUsed(node.name);
          },
        };
      },
    },
  },
};

export default [
  {
    ignores: ["dist", "node_modules"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      local: jsxUsesVars,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "local/jsx-uses-vars": "error",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
