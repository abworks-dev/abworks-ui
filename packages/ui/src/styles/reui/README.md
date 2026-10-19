# ReUI Base Nova 源码基线

- Repository: https://github.com/keenthemes/reui
- Commit: `8a2c701eaf95729f238274d5ce2555a5a8bd23e7`
- 原语源码：`registry/bases/base/ui/`
- 样式源码：`registry/styles/style-nova.css`
- 许可证：MIT, Copyright (c) 2025 Keenthemes Inc. 参见 `LICENSE.md`。

`style-nova.css` 跟踪上游副本，并包含下文记录的、已审阅的原生 Command 标题选择器适配。保留其余所有规则作为比较基线；应用集成放在此文件之外。该样式表需要 `.style-nova` 祖先元素、Tailwind、`shadcn/tailwind.css`、`tw-animate-css`，以及其规则使用的完整语义主题 Token。只复制原语 TSX 而不包含这些依赖，无法复现 Nova。

## 入口

调用方通过包入口 `@aboard/ui/styles`（`packages/ui/src/styles/index.css`）加载此基线；该入口在 `layer(base)` 中导入 `style-nova.css`，并向 Tailwind 注册 `packages/ui/src/core`。调用方样式表不得通过相对路径将 `@source` 指向本包的 `src` 目录；主题 Token 和 `.style-nova` 作用域仍归调用方所有。`packages/ai-ui` 提供等价的 `@aboard/ai-ui/styles` 入口，用于注册其 Tailwind 源码。

## 当前落地范围

首批源码复制覆盖了原有的 25 个核心模块：badge、breadcrumb、button、card、checkbox、command、dialog、drawer、empty、field、input、item、kbd、label、popover、progress、select、separator、sidebar、skeleton、table、tabs、textarea、toast 和 tooltip。同时引入了作为上游依赖的 InputGroup、Sheet 和 useIsMobile。当前共享库还额外公开 16 个无需额外依赖的 Base UI 模块：Accordion、Alert、AlertDialog、Avatar、Combobox、ContextMenu、DirectionProvider、DropdownMenu、NativeSelect、Pagination、RadioGroup、ScrollArea、Slider、Spinner、Switch 和 Toggle。源码复制覆盖范围不等于穷尽的浏览器状态覆盖范围。

## 有意适配

- 通过包内相对导入解析上游注册表导入。
- 将 create-site 的 IconPlaceholder 解析为 Lucide 图标；不得把上游应用导入产品。
- 保留 Tabs 向 Base UI 转发 orientation 的行为。固定版本上游解构了 orientation，却只设置 data attribute；转发可避免键盘行为回退。
- 将 Checkbox 文档中的不确定状态 Minus 指示器保留为明确的 Aboard 扩展。固定版本上游只选择 CheckIcon。
- 保留导出的 InputProps 和 ButtonProps 兼容接口，以及本地 barrel 使用的 emptyMediaVariants。
- 暴露 tooltip 语义：固定版本上游渲染弹出层时没有 `role="tooltip"`，Base UI 1.7.0 也未设置该角色或触发器上的 `aria-describedby` 引用，因此 tooltip 会被播报为普通元素。Aboard 为 `Tooltip`/`TooltipTrigger`/`TooltipContent` 组合补充了两者。tooltip 关闭时仍保留触发器引用，因为弹出层只在打开时存在于 DOM 中；悬空的 IDREF 会被忽略，而镜像 Base UI 的打开状态会分叉原语的状态权威。
- Sidebar 持久化是明确且可选择退出的 Aboard 契约：`SidebarProvider` 将 `persistState` 默认为 `true`，并在 `sidebar_state` cookie 中记录桌面展开状态；`persistState={false}` 则不会修改 cookie，供只读文档预览使用。保留受控/非受控状态和上游交互。
- 将桌面 Sidebar 的固定定位限制在有界文档预览内，不改变核心布局 class。
- 在文档 body 上启用 Nova 作用域以支持 portal 内容，并在 Workbench 根节点上启用，以供其共享 Button 调用方使用。Workbench 保留现有语义主题值。
- 文档外壳拥有主题 Token 值。仅使用 Nova 几何样式表，不能证明与上游的颜色/字体完全一致。
- 将 Nova 的 `[[cmdk-group-heading]]` 后代选择器替换为 `[data-slot="command-group-heading"]`，因为 Aboard 的原生 Command 实现有意移除了 cmdk/Radix，同时保留相同的标题排版和间距。

## 验证证据

- `pnpm --filter @aboard/ui typecheck`：源码头修复后通过。
- 站点 `test:component-samples`：9 项测试通过，包括生成的独立 TSX 变体。
- 站点 `test:reui-source`：3 项测试通过，覆盖 27 个核心源码头/导入解析、未变化的 Nova SHA-256 和 Sidebar 持久化排除。
- 通过直接 Next Node 入口执行的站点生产构建：通过，376 个静态页面。
- 根 `pnpm run build`：通过，Workbench 52 个静态页面。
- 组件文档校验：两种语言均通过。
- Agent 发现 smoke：15 条发现路由和 35 个 Markdown 链接通过。
- 浏览器：已检查示例几何和键盘行为、Checkbox 混合状态图标、Field 错误内容、390px 窄屏示例边界、Dialog/Popover/Drawer portal 样式，以及有界 Sidebar 几何。
- 全仓 `check`：文档和架构检查通过；在 Workbench `semantic-primitives.test.tsx` 中五个既有未使用的 `@ts-expect-error` 指令处停止。未对后续完整测试/lint 阶段作出通过认证。
- 未执行截图像素差异基线或穷尽所有组件/所有主题的状态矩阵。几何/源码检查不表示各主题的排版和颜色已达到像素级一致。

## 验收边界

构建成功只能证明样式表可编译，不能证明视觉一致。每批复制都需要源码比较、类型检查、生成示例检查，以及按适用范围进行布局、焦点、状态、错误、禁用和混合状态的浏览器检查。在完整源码及其传递样式均经审阅前，不得将剩余组件标记为已对齐。
