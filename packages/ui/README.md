# @aboard/ui

基于 Base UI 1.7.0 的 React 19 展示原语。仅支持 ESM；React 18 和完整 SSR/RSC 兼容性尚未认证。

## 独立样式

使用 Tailwind CSS 4（例如其 PostCSS 插件）处理以下 CSS：

```css
@import '@aboard/ui/styles/default';
```

设置 `<html class="style-nova aboard-theme">`（或将这两个 class 放在 `body`）。在同一元素上添加 `dark` 切换模式。此显式选用的入口包含 Tailwind、动画辅助、Nova 样式、源码注册和浅色/深色语义 Token。安装的 peer dependencies 为 React 19、ReactDOM 19 和 Tailwind 4；导入后覆盖语义变量即可定制色板。

**Portal 作用域：**Dialog、Tooltip、菜单等浮层通过 Portal 挂载到 `body`。主题 Token 与 `style-nova` 祖先类应放在 `html` 或 `body`，不能只放在应用根节点，确保 Portal 内容同时继承它们。仅给子树设置作用域不能为 body Portal 提供样式。

现有 `@aboard/ui/styles` 仍不包含 Token，也不加载默认主题或 Tailwind reset。现有使用方保留自己的主题、Tailwind 配置，以及 `tw-animate-css` 和 `shadcn/tailwind.css` 导入。

## JavaScript 与类型

```tsx
import { Button } from '@aboard/ui/core/button'
import { Dialog, DialogContent, DialogTrigger } from '@aboard/ui/core/dialog'
```

保留 root、core、data-table 和已有组件子路径。发布包保留 ESM 模块结构、显式相对 `.js` 导入、声明和源码中的客户端指令。CSS 是构建时 Tailwind 入口，不是预编译的独立浏览器 CSS。CSS 声明为有副作用；JavaScript 支持 tree-shaking。

## 工作区与打包归档

工作区 `exports` 有意指向源码，以支持当前 Next/TypeScript 开发而无需预构建。`pnpm pack` 将其替换为指向构建后 JS/类型/CSS 的 `publishConfig.exports`。本包必须使用 pnpm 打包，不要使用不会应用 pnpm 发布覆盖规则的 npm pack。`prepack` 会重新构建；归档白名单为 `dist`（另含包元数据和 README），不分发源码 TS/TSX。测试用 tree-fixture 入口以编译后的 JS/类型保留，维持兼容。

运行 `pnpm --filter @aboard/ui build`、`test` 和 `typecheck`。可复用构建实现位于 `tooling/component-library/build.mjs`，仅在构建时需要工作区 TypeScript。源码来源记录和保留的第三方许可证原文包含在 `dist/SOURCES.md` 与 `dist/src/styles/reui/`。

本包不包含 Nexus 工作区/运行时依赖或服务行为。浏览器集成和公开双语文档由上层独立分发任务验证；仅包构建通过，不代表浏览器或发布认证。
