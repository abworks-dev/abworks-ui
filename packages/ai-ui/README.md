# @abworks-dev/ai-ui

基于 `@abworks-dev/ui`、Base UI 1.7 和 Tailwind CSS 4 的可选 React 19 展示组件。不要求或包含 Nexus Host、contracts、传输、持久化、模型或审批实现。

## 安装与样式

```sh
pnpm add @abworks-dev/ai-ui @abworks-dev/ui react@^19 react-dom@^19
pnpm add -D tailwindcss@^4
```

仅使用 UI 的应用只需要 `@abworks-dev/ui`；AI UI 是显式可选安装项。以下是未来发布版本的安装说明，不表示 npm 上已经可用。

```css
/* Tailwind 4 build input. Opt-in theme, not a precompiled browser stylesheet. */
@import '@abworks-dev/ui/styles/default';
@import '@abworks-dev/ai-ui/styles';
@source '../node_modules/@abworks-dev/ui/dist';
@source '../node_modules/@abworks-dev/ai-ui/dist';
```

使用 `<html class="style-nova abworks-theme">`，深色模式添加 `dark`。主题变量和样式作用域放在 html/body 上，让挂载到 body 的 Portal 继承它们。现有自定义主题使用方可以继续使用 `@abworks-dev/ui/styles` 和自己的 Token。AI UI 不提供独立默认主题。图组件还需要有尺寸的画布和支持 CSS 的 bundler；Canvas 导入 React Flow 与有作用域的图样式。

```tsx
import { Message, MessageContent } from '@abworks-dev/ai-ui/message'

export function Answer() {
  return <Message from="assistant"><MessageContent>Hello</MessageContent></Message>
}
```

## Message 迁移

| 迁移前（Nexus 集成） | 独立展示 API |
| --- | --- |
| 来自 `@aboard-nexus/contracts` 的 `Message` | 来自 `@abworks-dev/ai-ui/message-types`（或根入口）的 `RuntimeMessage` |
| 来自 contracts 的 `MessagePart`, `MessageRole` | 来自 `@abworks-dev/ai-ui/message-types` 的同名类型 |
| 运行时 JSON 输入/输出类型 | `unknown` 展示载荷，由调用方校验/执行 |
| `<Message message={nexusMessage}>` | 不变：Nexus 消息在结构上可赋值 |
| 工具状态词汇 | 不变：pending/running/waiting-approval/succeeded/failed |

这些形状仅描述渲染，不是传输 schema、校验器或运行时 API。本地回调作者必须收窄未知工具载荷。`MessagePartOf<T>` 和元数据继续通过 `@abworks-dev/ai-ui/sources` 提供；该旧子路径拥有来源/类型信息，`@abworks-dev/ai-ui/sources-ui` 则导出可见 Sources 组件。

## TypeScript 使用方要求

已使用 TypeScript 6.0.3 验证；更早编译器版本未经认证（固定的 Node 类型要求至少 TypeScript 5.6）。编译器 `lib` 需包含 `DOM`、适当的 ECMAScript lib（例如 `ES2022`）和 `ESNext.Disposable`。Shiki 声明需要 `Symbol.dispose`；编译器库的选择归调用方负责。

包直接依赖 `@types/node@24.13.3`、`@types/json-schema@7.0.15` 和 `type-fest@4.41.0`，补齐上游声明依赖：AI SDK/provider 类型引用 Buffer、`node:http` 和 JSON Schema，Mermaid 11.17.2 则导入 `SetOptional`/`SetRequired` 却没有声明 type-fest。这些是 AI 专用包依赖，不要求只使用 UI 的应用或使用方 manifest 添加变通依赖，也不授予浏览器组件 Node/运行时权威。上游 manifest 完整声明类型依赖图，且移除它们后严格的外部 NodeNext 检查仍通过时，才移除这些直接补齐的依赖。

## 构建与打包

先构建 `@abworks-dev/ui`，再运行 `pnpm --filter @abworks-dev/ai-ui build`。通用构建器把工作区兄弟包导入解析到已发布形式的 UI 声明，不把 UI 源码复制进本分发包。开发工作区导出仍指向源码。`pnpm pack` 通过 `publishConfig.exports` 指向构建后的 ESM/声明；npm pack 不会应用这项 pnpm 覆盖规则。Prepack 会重新构建 AI UI；只分发 `dist` 和标准包元数据/README/许可证文件。所有已有子路径保留，`./message-types` 为增量新增。CSS 标记为有副作用；JS 保留模块结构和现有 `use client` 指令。面向浏览器的模块未认证可用于任意 SSR/RSC 场景。

构建后运行 `pnpm --filter @abworks-dev/ai-ui test` 和 `typecheck`，覆盖产物回归。不会自动发生模型调用、工具执行或审批。本地展示交互和已文档化的用户触发浏览器行为保持不变。固定上游适配与声明见 SOURCES.md、NOTICE 和 LICENSE。
