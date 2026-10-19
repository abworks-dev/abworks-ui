# Aboard UI

独立维护的 React 19 组件库（ESM、Tailwind CSS 4）。

- `@aboard/ui`：Base UI/Base Nova 通用组件、语义主题与 DataTable。
- `@aboard/ai-ui`：可选 AI 展示组件；执行、模型、传输、持久化、凭据和权限归调用方。

## 安装与样式

```sh
pnpm add @aboard/ui react@19 react-dom@19 tailwindcss@4
# AI 界面可选：pnpm add @aboard/ai-ui
```

通过 Tailwind 4/PostCSS 处理 `@import '@aboard/ui/styles/default';`，将 `style-nova aboard-theme` 放在 html/body；在同一元素添加 dark 切换暗色，确保 body Portal 继承主题。CSS 是构建输入，不是预编译样式。

```tsx
import { Button } from '@aboard/ui/core/button'
```

详见 [UI 接入](packages/ui/README.md)、[AI 接入](packages/ai-ui/README.md)、[独立消费验证](tooling/component-consumer/README.md)。React18、CommonJS、Next SSR/RSC 未认证。

## 维护与验证

Node24、pnpm11。

```sh
pnpm install --frozen-lockfile
pnpm run check
pnpm exec playwright install chromium
pnpm --filter @aboard/ui pack --pack-destination "$PWD/.data/packages"
pnpm --filter @aboard/ai-ui pack --pack-destination "$PWD/.data/packages"
node tooling/component-consumer/verify.mjs "$PWD/.data/packages/aboard-ui-0.1.0.tgz" "$PWD/.data/packages/aboard-ai-ui-0.1.0.tgz"
```

使用 `pnpm pack` 应用发布 exports 与 workspace 依赖转换。按 UI → AI 顺序发布已核验归档；执行 `npm publish <archive> --access public --registry=https://registry.npmjs.org`，不要直接用 npm 打包源码目录。发布前检查包名权限、版本、许可证及归档文件清单。源码仓库公开不等于 npm 已发布。

## 来源与许可

从已提交组件代码提取，源快照 `6c43467f5fcd667dcf9b718791772067fb6a1328`；本仓库不携带私有应用历史、Host、Workbench 或 contracts。UI 声明 MIT，上游 ReUI/Base Nova MIT 原文及来源位于 packages/ui/src/styles/reui；AI 为 Apache-2.0，并保留 AgentbaseAI/Vercel 等组件级 NOTICE/SOURCES。不要将整库简单描述成单一许可；以各包及上游声明为准。Nexus 结构兼容集成测试留在原项目；本仓库独立验证调用方展示形状。
