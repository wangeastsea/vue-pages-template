module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    'no-useless-catch': 'off',
    'no-console': 'off',
    'no-async-promise-executor': 'off',
    'no-unused-vars': 'off',
    'prettier/prettier': [
      'error',
      {
          singleQuote: true, //单引号
          tabWidth: 4, // tab是4个空格
          semi: false // 不要分号结尾
      }
  ],
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true
      }
    }
  ]
};
