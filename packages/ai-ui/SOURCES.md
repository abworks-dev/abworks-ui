# AI Elements 源码来源

本包拥有源码适配，不从上游应用进行运行时导入。

**迁移契约：** 新增或实质修改组件前，遵循 [`../UI-PORTING.md`](../UI-PORTING.md)。已验证的 Base UI 映射说明见 [`../ui/BASE-UI-MAPPING.md`](../ui/BASE-UI-MAPPING.md)。本文件是来源索引，不能替代迁移契约。

- AI Elements: https://github.com/vercel/ai-elements
- 固定 commit：`6a9d5b1822ffb10bba4bd97175f01edd7d8651cd`
- 许可证：Apache-2.0（上游仓库 `LICENSE`）
- 基础原语：ReUI Base Nova，版本固定于 `8a2c701eaf95729f238274d5ce2555a5a8bd23e7`，由 `@aboard/ui` 公开。

## 已移植源码

| 组件                  | `packages/elements/src/` 下的上游源码    | 适配                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent                 | `agent.tsx`                             | 固定 commit、优先复制源码的 Base UI/Base Nova 原语适配；DTO/回调归调用方所有；无运行时权威                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Artifact              | `artifact.tsx`                          | Base UI Button/Tooltip render 组合；操作归调用方所有                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Environment Variables | `environment-variables.tsx`             | 经净化的调用方所有的值，以及显式复制回调；无剪贴板权威                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| File Tree             | `file-tree.tsx`                         | Base UI Collapsible render 组合、原生可访问控件，以及调用方所有的选择状态                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Package Info          | `package-info.tsx`                      | 展示调用方所有的包/版本 DTO                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Schema Display        | `schema-display.tsx`                    | 转义后的结构化路径渲染和 Base UI Collapsible                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Snippet               | `snippet.tsx`                           | 复制回调归调用方所有；无剪贴板权威                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Stack Trace           | `stack-trace.tsx`                       | 原生 Base UI 展开按钮与并列操作控件；安全的仅回调复制和文件导航                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Terminal              | `terminal.tsx`                          | 输出、清空和复制回调归调用方所有；无终端权威                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Test Results          | `test-results.tsx`                      | 展示调用方所有的结果 DTO，总数为零时进度仍为有限值                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Message               | `message.tsx`                           | Base Nova Button/ButtonGroup/Tooltip；使用 `render` 而非 `asChild`；在 `from` 之外保留可选的 Aboard RuntimeMessage 边界适配器；完整分支/操作/Streamdown                                                                                                                                                                                                                                                                                                                                                            |
| Sources               | `sources.tsx`                           | Base UI Collapsible props 公开受控状态；动画选择器使用 Base UI 生命周期属性                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Task                  | `task.tsx`                              | Base UI Collapsible；触发器使用 `data-panel-open`，面板使用生命周期选择器                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Shimmer               | `shimmer.tsx`                           | 本地 cn 工具、官方 Motion 渲染器；调用方提供本地化文本                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Plan                  | `plan.tsx`                              | 通过 `render` 组合 Base Nova Card/Button/Collapsible（无嵌套按钮）；本地 cn/Shimmer；保留流式上下文与复合导出                                                                                                                                                                                                                                                                                                                                                                                                     |
| Reasoning             | `reasoning.tsx`                         | Base UI Collapsible；本地可控状态 hook 替代 Radix；生命周期选择器使用 Base UI 属性；保留流式时序、自动展开/收起、Streamdown 插件和 Shimmer                                                                                                                                                                                                                                                                                                                                                                         |
| Chain of Thought      | `chain-of-thought.tsx`                  | Base Nova Badge 和 Base UI Collapsible；本地可控状态 hook 替代 Radix；`data-open` 和生命周期选择器替代 Radix 状态选择器；保留复合导出与展开状态上下文                                                                                                                                                                                                                                                                                                                                                            |
| CodeBlock             | `code-block.tsx`                        | 通过 `@aboard/ui` 使用 Base UI Button/Select、本地 cn 工具和 Base UI 组合；保留异步 Shiki 高亮器/Token 缓存、原始内容回退、语言选择器和主题行为；复制回调归调用方所有，无剪贴板权威                                                                                                                                                                                                                                                                                                                                |
| Suggestion            | `suggestion.tsx`                        | Base Nova Button；本地语义化横向溢出视口替代上游 ScrollArea，保留键盘滚动、横向布局和建议回调类型                                                                                                                                                                                                                                                                                                                                                                                                                |
| Attachments           | `attachments.tsx`                       | Base Nova Button 和 Aboard Base UI HoverCard；本地 cn 工具；AI SDK 仍仅提供 FileUIPart/SourceDocumentUIPart DTO 类型；无运行时传输或上传行为                                                                                                                                                                                                                                                                                                                                                                     |
| Inline Citation       | `inline-citation.tsx`                   | Aboard Base UI HoverCard 和 Badge；本地语义化轮播替代上游 Carousel；格式错误和非 HTTP(S) URL 渲染为安全的未知回退，不发起获取                                                                                                                                                                                                                                                                                                                                                                                     |
| Tool                  | `tool.tsx`                              | 固定 commit 的完整复合工具接口；Aboard 工具调用状态、Base Nova Collapsible/Badge、本地 CodeBlock，以及调用方所有的执行回调（组件不调用任何此类回调）                                                                                                                                                                                                                                                                                                                                                             |
| Confirmation          | `confirmation.tsx`                      | 固定 commit 的完整复合确认接口；Aboard `waiting-approval`/`succeeded`/`failed` 映射、Base Nova Button，以及调用方所有的审批回调                                                                                                                                                                                                                                                                                                                                                                                  |
| Prompt Input          | `prompt-input.tsx`                      | 完整复合接口适配至本地 Base Nova Button/Textarea/Select/Tooltip/HoverCard；语义化菜单/命令适配器替代仅支持 Radix 的原语；保留 textarea、IME 提交、附件校验、拖放/粘贴、截图捕获、来源 ref，以及成功后清空/出错时保留；Host 边界仅通过回调表达                                                                                                                                                                                                                                                                       |
| Checkpoint            | `checkpoint.tsx`                        | Base Nova Button、Separator、Tooltip 和 `render` 组合替代 Radix `asChild`；仅提供调用方所有的点击回调                                                                                                                                                                                                                                                                                                                                                                                                           |
| Context               | `context.tsx`                           | Base Nova HoverCard/Progress；调用方提供的 Token 用量和费用 DTO 替代上游 tokenlens 价格查询，无模型/提供商调用                                                                                                                                                                                                                                                                                                                                                                                                   |
| Queue                 | `queue.tsx`                             | Base Nova Button/Collapsible，以及现有的 `@aboard/ui` ScrollArea 和 `render` 组合替代 Radix；QueueList 保留上游队列列表 API 与滚动行为                                                                                                                                                                                                                                                                                                                                                                            |
| Audio Player          | `audio-player.tsx`                      | 原生 `<audio>` 替代 media-chrome；语音音频使用显式 `{ mediaType, base64 }` DTO 或调用方 URL；`controls` 和 `preload` 解构默认值为 `false`/`metadata`，并应用调用方覆盖；本地 React 媒体上下文（media context）支持播放、暂停、定位、静音、时间和音量控件，无网络权威；媒体来源仍归调用方所有。本包未配置 React 渲染测试装置，因此属性行为由源码契约测试而非 DOM 渲染覆盖 |
| Transcription         | `transcription.tsx`                     | 本地可控时间状态与显式 `{ startSecond, endSecond, text }` 片段 DTO；定位回调仍归调用方所有                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Voice Selector        | `voice-selector.tsx`                    | Base Nova/Base UI Dialog 和本地 Command；共享 CommandItem（shared CommandItem）移除原生事件处理器冲突，使选择回调仅接收值，签名为 `(value: string) => void`；仅提供受控 value/open 状态和预览回调；无预览播放或语音提供商调用                                                                                                                                                                                                                                                                                    |
| Sandbox               | `sandbox.tsx`                           | Base UI Collapsible/Tabs、窄化状态 DTO，无执行权威或 Host 调用                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Commit                | `commit.tsx`                            | Base UI Collapsible/Button/Avatar、调用方所有的 DTO（caller-owned DTOs）和显式的仅回调复制；无 Git/文件系统权威                                                                                                                                                                                                                                                                                                                                                                                                    |
| Question              | `question.tsx`                          | 固定 commit、优先复制源码的复合表单；`@aboard/ui` Button/Textarea、语义 Token，以及调用方所有的异步提交/值回调；无传输或持久化权威                                                                                                                                                                                                                                                                                                                                                                                |

## 图组件源码移植

以下六个展示接口是从 AI Elements commit `6a9d5b1822ffb10bba4bd97175f01edd7d8651cd` 优先复制源码的移植，许可证为 Apache-2.0, Copyright 2023 Vercel, Inc.（[固定版本上游许可证](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/LICENSE)）。

| 接口 | 固定版本上游源码 | 适配 |
| --- | --- | --- |
| Canvas | [canvas.tsx](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/canvas.tsx) | `theme-adaptation`：本地 `cn`、限定作用域的图 Token 样式表和语义 Background 颜色；保留 ReactFlow 交互默认值与调用方覆盖。导出 CanvasProps。 |
| Connection | [connection.tsx](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/connection.tsx) | `theme-adaptation`：语义背景替代白色端点填充；保留 ConnectionLineComponent 和三次曲线路径。 |
| Controls | [controls.tsx](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/controls.tsx) | `theme-adaptation`：本地 `cn`、语义边框/文本/焦点，以及原有 Controls 原语 props/回调。 |
| Edge | [edge.tsx](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/edge.tsx) | `theme-adaptation`：语义主色动画填充；保留 Animated/Temporary、连接点坐标计算、markerEnd/style 转发和上游几何。 |
| Panel | [panel.tsx](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/panel.tsx) | `theme-adaptation`：本地 `cn`、语义边框和卡片文本；保留 Panel 原语位置与 props。导出 PanelProps。 |
| Toolbar | [toolbar.tsx](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/toolbar.tsx) | `theme-adaptation`：本地 `cn`、语义边框/文本；保留 NodeToolbar 及可覆盖的 Position.Bottom 默认值。导出 ToolbarProps。 |
| Node | [node.tsx](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/node.tsx) | `theme-adaptation`：带有语义 Token 的 Aboard Card 复合接口；保留必需的 `{ target, source }` 连接点可见性，以及调用方所有的 React Flow 连接点位置。导出 Node 及其七个复合 part。 |

- 引擎依赖：Aboard 将 `@xyflow/react` 精确固定为 `12.10.0`；[固定版本上游包](https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/package.json) 声明为 `^12.10.0`。不涉及 Radix 原语。所有图模块均显式声明客户端边界。
- `authority-boundary`：节点、边、图更新归调用方所有（callers own nodes, edges, graph updates），连接、选择、持久化、执行和 ReactFlow 回调也归调用方所有。Canvas 只提供展示/交互默认值；调用方 props 可覆盖这些默认值。React Flow 拥有其常规视口/内部测量；Controls 操作该引擎的本地视口/交互状态，并转发原生回调。此处未实现工作流执行引擎。
- 样式：Canvas 保留必需的 `@xyflow/react/dist/style.css` 副作用导入，随后导入 `src/styles/graph.css`；其中限定作用域的 CSS 变量已依据 [12.10.0 样式表](https://unpkg.com/@xyflow/react@12.10.0/dist/style.css) 核实。调用方需要 Aboard 语义主题 Token、Tailwind 源码扫描、支持 CSS 的打包器，以及有明确尺寸的 Canvas 容器。不通过 Canvas 使用 Connection/Controls/Edge/Panel/Toolbar 时，调用方需要提供相同的 React Flow CSS/上下文。调用方样式可覆盖 CSS 变量。
- 已知上游限制（Known upstream limits）：Animated 假设来源连接点位于 Position.Right、目标连接点位于 Position.Left，选择首个匹配连接点，在两个内部节点都存在前返回 null，且在没有匹配连接点时回退到坐标 `[0, 0]`。Temporary 只保留上游几何/id/虚线样式，不转发所有 EdgeProps。Node 仅公开由调用方选择的左目标/右来源连接点；连接状态与测量仍归 React Flow 所有。Animated 使用无限重复的 SVG animateMotion；减少动态效果行为未变。即使在 RTL 文本布局中，React Flow 仍保留 LTR 图几何和物理位置。未包含 Handle 和 MiniMap，因为固定版本上游源码没有对应的独立文件。
- 验证：`pnpm --filter @aboard/ai-ui typecheck` 在已安装的 `@xyflow/react@12.10.0` 下通过；`pnpm --filter @aboard/ai-ui test` 的全部 45 项包契约通过（包含 7 项聚焦图契约）；`node --test packages/ai-ui/tests/graph-boundary.test.mjs` 通过 7/7；`git diff --check -- packages/ai-ui` 通过。聚焦包源码契约测试覆盖导出、精确依赖、可覆盖默认值、原生回调转发、引擎归属、Token/CSS 接线和固定来源。两项 CSS 导入使用窄化的样式表声明，未禁用严格检查。这些检查不能证明挂载后的图行为、浏览器布局、键盘交互、深色/浅色/RTL 一致性或像素一致性；产品/页面和文档站点集成不在范围内。
- 文档影响：本包来源记录拥有源码/引擎边界记录。此有界修改只新增库接口；不宣称产品工作流或公开文档站点变更。

## Assistant UI 源码移植（Assistant UI Source Ports）

这些是源码复制适配，与 AI Elements 的 Apache-2.0 基线及下文的模式参考不同。

- 仓库：https://github.com/assistant-ui/assistant-ui
- 固定 commit：`b6444661cf03cae6c5e10baba1e12c9e010b8ea0`
- 许可证：MIT, Copyright (c) 2026 AgentbaseAI Inc.；[上游声明](https://github.com/assistant-ui/assistant-ui/blob/b6444661cf03cae6c5e10baba1e12c9e010b8ea0/LICENSE)。
- 源码目录：`packages/ui/src/components/react/assistant-ui/elements/`。
- MemoryChips：`memory-chips.tsx`；保留 `MemoryChip`、`MemoryChange`、调用方所有的 `chips`/`onForget`、新增条目计数，以及条件性遗忘控件。`theme-adaptation`：语义强调色、逻辑间距和长文本换行。`accessibility-fix`：隐藏装饰性图标，扩大焦点可见的遗忘操作目标，并使用 motion-safe 动画。可选标签/格式化器 props 支持调用方本地化。无记忆持久化、模型调用或传输。
- ArtifactCard：`artifact-card.tsx`，以及来自 `surfaces.tsx` 的展示字符串/动画；保留 title/meta/generating/words 和转发的 div props。`theme-adaptation`：Nova 圆角、语义表面和响应式元数据。`accessibility-fix`：调用方提供点击行为时增加按钮语义、Enter/Space 激活、preventDefault 组合和 aria-disabled 防护；不可点击卡片没有隐式按钮角色。Shimmer 遵循减少动态效果设置。可选标签/格式化器 props 支持本地化。现有 `artifact.tsx` 面板未变；不宣称版本历史或生成运行时能力。
- 验证：UI/AI UI 和 Workbench 类型检查通过；AI 挂载测试通过（6 项），包含遗忘/本地化/生成/点击/键盘/ARIA 转发。共享浏览器矩阵通过（5 项），覆盖桌面浅色/深色和移动端浅色/深色 RTL，并检查减少动态效果下的 shimmer。测试将准确匹配的既有 React DevTools shim 警告保留为注解；其他控制台警告/错误会导致失败。不宣称文档站点或产品工作流集成。

### Assistant UI MIT 声明

Copyright (c) 2026 AgentbaseAI Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 模式参考移植

这些接口不是源码副本，而是参考 assistant-ui Elements 的视觉与交互语义，以 Aboard Base UI 原语构建，仅使用调用方所有的状态与回调：

| 组件              | 参考（assistant-ui Elements）     | 适配                                                                                      |
| ----------------- | --------------------------------- | ----------------------------------------------------------------------------------------- |
| StreamingText     | `streaming-text`                  | 调用方所有的 `isStreaming` 标志；通过语义 Token 短暂强调文本 Token，无运行时                 |
| ThinkingIndicator | `thinking-indicator`              | 调用方所有的 `label`/`elapsedMs`；Spinner + 等宽数字耗时                                    |
| TypingIndicator   | `typing-indicator`                | 静态三点存在标记；显示/隐藏归调用方所有                                                     |
| MessageError      | `error-state`                     | Alert + `onRetry` 回调；非模态，无传输                                                      |
| MessageQueue      | `message-queue`                   | 调用方所有的 `items`/`onCancel`；无待处理队列运行时                                         |
| EditMessage       | `edit-message`                    | 调用方所有的 `defaultValue`/`onSave`/`onCancel` + 丢弃回复数                                 |
| FeedbackDialog    | `feedback-dialog`                 | Dialog 使用调用方所有的 `open`/`onSubmit`；仅保留本地草稿文本                              |
| StoppedRun        | `stopped-run`                     | 调用方所有的 `onContinue`；保持部分回答可见                                                |
| CodeDiff          | `code-diff`                       | 调用方所有的差异块；为增/删行着色，不计算差异                                              |
| ReviewableDiff    | `reviewable-diff`                 | 每块的保留/丢弃决定归调用方所有；此处不应用任何修改                                         |
| ToolTimeline      | `tool-timeline`                   | 调用方所有的动词/目标/状态条目；无执行状态                                                 |
| CodeRunner        | `code-runner`                     | 调用方所有的 `onRun` 和输出；无代码执行                                                    |
| ComputerUse       | `computer-use`                    | 调用方所有的截图/光标/轨迹/操作 DTO；无驱动权威                                            |
| PermissionGrant   | `permission-grant`                | 调用方所有的授权范围 DTO；授权/拒绝均为回调，此处从不执行                                  |
| GuardrailNotice   | `guardrail-notice`                | 调用方所有的拒绝文本和最接近的替代方案；无策略评估                                         |
| ElicitationForm   | `elicitation-form`                | 调用方所有的字段和 `onSubmit`；仅有本地字段值，无传输                                      |
| WebSearch         | `web-search`                      | 调用方所有的查询/结果 DTO；无搜索或网络访问                                                |
| ImageGeneration   | `image-generation`                | 调用方所有的提示词/状态/图像 DTO；无生成或网络访问                                         |

`Terminal` 新增 `exitStatus` prop，以调用方所有的 DTO 携带命令退出码；流式输出、复制和清空仍作为调用方回调保留。

元数据子路径 `@aboard/ai-ui/sources` 为兼容性而保留，解析到 `provenance.ts`。Sources 组件请通过 `@aboard/ai-ui/sources-ui` 或根 barrel 导入。

## 历史适配

Prompt Input、Tool 和 Confirmation 现在使用固定 commit 的复合接口，并适配 Aboard 状态/回调。其传输/执行/审批归属仍在调用方和 Host；组件不执行副作用。

## 依赖与权威

新增的直接渲染依赖：`ai`（视觉 API 类型）、`use-stick-to-bottom`、`motion`、`lucide-react`、`shiki`、`streamdown`、`@streamdown/cjk`、`@streamdown/code`、`@streamdown/math`、`@streamdown/mermaid`。本次移植未引入直接的 Radix 原语或状态 hook 依赖。不宣称仓库其他位置的现有传递依赖不含 Radix。

展示 API 中的 AI SDK 类型不会将传输、凭据、模型调用、持久化或工具审批权威转移给 UI 包。Message 使用包内的结构化展示消息类型；现有 Nexus 消息无需导入 contracts 即可赋值。不在运行时代码或声明中导入 Host 实现或 contracts 依赖。下载/复制能力要求显式的调用方/用户操作，文档预览不会自动触发。

独立声明闭包：`@types/node@24.13.3` 和 `@types/json-schema@7.0.15` 满足 AI SDK/提供商声明对 Buffer、`node:http` 和 JSON Schema 的引用。`type-fest@4.41.0` 满足 Mermaid 11.17.2 声明中对 `SetOptional`/`SetRequired` 的导入，这些依赖被其 manifest 遗漏。这些直接依赖仅属于 AI UI，不增加运行时权威；当修正后的上游 manifest 闭合依赖图，且严格的外部 NodeNext 验证无需这些依赖也能通过时，应退役这些依赖（retired when corrected upstream manifests）。Shiki 声明还要求调用方编译器支持 `ESNext.Disposable`（`Symbol.dispose`）；README 记录了 TypeScript/lib 要求。

## 文档与验证

十九个已移植接口在 UI System / AI Conversation 中使用站点所有的 ComponentPreview 和双语文档。生成示例必须包含完整导入、fixture 和本地状态处理器。源码与类型检查必不可少，但不能证明像素一致或所有浏览器状态。构建、测试和浏览器证据应与源码复制声明分开。

升级时，将所有源码函数、类型、状态、class 和导出与固定 commit 比较；保留已记录的适配，只有对应源码同步更新时才更新目录 URL。
