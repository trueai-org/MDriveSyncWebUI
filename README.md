# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## 框架

```bash
# 创建 vite + react
# https://cn.vitejs.dev/guide/
yarn create vite
√ Project name: ... mdrive
√ Select a framework: » React
√ Select a variant: » TypeScript

# 添加 antd
# https://ant.design/docs/react/introduce-cn
yarn add antd

# 添加 tailwindcss
# https://tailwindcss.com/docs/guides/vite
yarn add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 添加 antd 组件
yarn add @ant-design/pro-components

# 添加 vite proxy

# 添加时间格式化
yarn add date-fns

# 待定
# 1. 添加 eslint
# 2. 添加 prettier
# 3. 添加 commitlint
# 4. 添加 stylelint
# 5. 添加 husky
# 6. 添加 lint-staged
# 8. 添加 vitest
# 9. 添加 react-router
# 10. 添加 react-query
# 11. 添加 react-query-devtools
# 12. 添加 分包 js
# 13. 添加 pinia / reciol
# 14. 添加 react-i18next
# 15. 添加 electron
# 16. 添加 electron-builder
# 17. 添加 electron-devtools
# 18. 添加 axios
# 20. 添加 mock
# 21. 添加 less scss
# 22. 添加 svgr
# 23. 添加 react-refresh
# 24. 添加 react-app-rewired
# 25. 添加 react-app-rewired-plugin-tailwindcss
# 26. 配置 HtmlPlugin 替换标题
# 27. 配置 HtmlPlugin 添加 favicon
# 28. 配置 Copyright
# 29. 配置 alias
```