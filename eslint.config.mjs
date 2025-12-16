import nextPlugin from "@next/eslint-plugin-next"

export default [
  {
    ignores: ["**/node_modules/**", ".next/**", "backend/target/**"],
  },
  {
    ...nextPlugin.configs["core-web-vitals"],
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
]
