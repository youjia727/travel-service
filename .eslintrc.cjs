module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:prettier/recommended' // 放在最后，覆盖冲突规则
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // 关闭部分严格TS校验，适合Express后端
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-floating-promises': 'off',
    'no-console': 'off',
    semi: ["warn", "always"],
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "auto",
      },
    ],
  },
  ignorePatterns: ['dist', 'node_modules', '*.config.cjs'],
};