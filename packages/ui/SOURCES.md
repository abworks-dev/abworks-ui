# UI 来源

## Switch 文本缩放适配

- 现有 ReUI 源码：[Switch](https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/switch.tsx)。Commit：`8a2c701eaf95729f238274d5ce2555a5a8bd23e7`；MIT, Copyright (c) 2025 Keenthemes Inc. Base UI：`1.7.0`。
- `accessibility-fix` / `theme-adaptation`：Nova switch 轨道使用相对字体的尺寸，与现有基于 rem 的滑块匹配。根字体为 16px 时，默认尺寸仍为 32 × 18.4px，小尺寸仍为 24 × 14px；文本放大时，轨道与滑块一同缩放。RTL 下选中滑块向行内末端移动，而不是反向移出轨道。
- 修改的归属文件：`src/styles/reui/style-nova.css` 和 `src/core/switch.tsx` 中的过渡 class 名称。轨道只对颜色而非尺寸应用过渡；减少动态效果模式下，根元素与滑块停止过渡。保留项：Switch 导出、props、隐藏 input 关联、受控/非受控状态、键盘事件、禁用状态、点击区域和回调；React 组合与状态机未变。
- 验证记录和有界验收状态：[Workbench 设置设计审查](../../docs/reviews/2026-10-03-workbench-settings-design-audit.md)。原语浏览器 fixture 覆盖默认/小尺寸、选中/未选中和文本缩放；应用运行时与发布限制单独记录。

## Sidebar 与菜单主题适配

- 现有 ReUI 源码：[Sidebar](https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/sidebar.tsx)、[DropdownMenu](https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/dropdown-menu.tsx)、[ContextMenu](https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/context-menu.tsx) 和 [Menubar](https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/menubar.tsx)。Commit：`8a2c701eaf95729f238274d5ce2555a5a8bd23e7`；MIT, Copyright (c) 2025 Keenthemes Inc. Base UI：`1.7.0`。
- `bug-fix`：侧边栏子项匹配 `useRender` 输出的布尔 `data-active` 属性是否存在；活动前景工具类覆盖静止状态工具类，图标继承当前条目的前景色。Workbench 的 liquid、焦点和强制颜色选择器使用相同的状态契约。
- `theme-adaptation` / `accessibility-fix`：仅用于材质的半透明样式不再覆盖菜单交互颜色。菜单局部的 `--menu-destructive-foreground` 混合破坏性与 popover 前景 Token，供静止状态文本使用。获得焦点的破坏性条目使用完整的破坏性表面/前景配对。标题使用 popover 前景；快捷键与破坏性图标跟随条目前景。
- 已退役：`cn-menu-translucent` 中不匹配的前景/背景覆盖，以及未被消费的内部 `cn-menu-translucent-aria` 规则。保留项：公开导出/props、Base UI 导航和焦点返回、可获得焦点但不可激活的禁用条目、弹出层材质、全局调色板，以及调用方拥有的破坏性操作。
- 修改的归属文件：`src/core/sidebar.tsx`、`src/styles/reui/style-nova.css`；调用方适配：Workbench 视觉 CSS。回归验证界面：包源码契约、挂载后的 Workbench 侧边栏测试、菜单家族浏览器 fixture，以及覆盖九种浅色/深色调色板和 classic/liquid 表面的真实侧边栏/用户菜单浏览器路径。
- 验证边界：这些回归覆盖上述组件和状态，不覆盖每个应用页面、任意背景或桌面打包。更广的集成状态必须单独报告。

## NumberField

- URL: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry-reui/bases/base/reui/number-field.tsx
- Commit: `8a2c701eaf95729f238274d5ce2555a5a8bd23e7`
- 许可证：MIT (ReUI; Copyright (c) 2025 Keenthemes Inc.)
- 源码路径：`registry-reui/bases/base/reui/number-field.tsx`
- 本地参考：`C:\Users\ASUS\.agent-reach\references\reui-base-reference\registry-reui\bases\base\reui\number-field.tsx`
- 适配：`primitive-adaptation` 使用 `@base-ui/react/number-field@1.7.0` 及已验证的 `Root`、`Group`、`Decrement`、`Increment`、`Input`、`ScrubArea` 和 `ScrubAreaCursor` part；`theme-adaptation` 使用 Aboard 语义 Token 和 Nova class；`accessibility-fix` 使用带有 `aria-hidden` 的 lucide 图标，并保留源码中 label 与 input 的关联。
- 修改文件：`src/core/number-field.tsx`、`src/core/index.ts`、`src/index.ts`、`package.json`、`src/styles/reui/style-nova.css`。
- 明确保留不动：包依赖和所有功能包调用方。
- 验证：合并后的 `tsc -p packages/ui/tsconfig.json --noEmit` 通过本地 TypeScript shim 运行并通过；Node 测试运行器无法启动子进程（`spawn EPERM`），因此本环境未执行 UI 包测试。
- 已知缺口：未添加浏览器 smoke 路由，因为此切片只负责共享原语包。

## DateRangePicker

- URL: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry-reui/bases/base/reui/date-selector.tsx
- Commit: `8a2c701eaf95729f238274d5ce2555a5a8bd23e7`
- 许可证：MIT (ReUI; Copyright (c) 2025 Keenthemes Inc.)
- 源码路径：`registry-reui/bases/base/reui/date-selector.tsx`
- 适配：`primitive-adaptation` 通过已验证的 Base UI Popover Trigger `render` 组合共享 Button，并复用共享 Calendar 范围模式；`theme-adaptation` 使用 Aboard 语义 Token；`unsupported-upstream-behavior` 省略大型 DateSelector 选择器矩阵，改用聚焦的范围选择器 API。
- 修改文件：`src/core/date-range-picker.tsx`、`src/core/index.ts`、`src/index.ts`、`package.json`、`tests/date-range-picker-contract.test.mjs`、`tests/public-exports.test.mjs`。
- 明确保留不动：包依赖和功能包调用方。
- 验证：合并后的 `tsc -p packages/ui/tsconfig.json --noEmit` 通过本地 TypeScript shim 运行并通过；Node 测试运行器无法启动子进程（`spawn EPERM`），因此未执行包测试文件。
- 已知缺口：此仅涉及包的切片没有浏览器交互、焦点恢复、浅色/深色和 RTL smoke 覆盖。

## Tree

- URL: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry-reui/bases/base/reui/tree.tsx
- Commit：`8a2c701eaf95729f238274d5ce2555a5a8bd23e7`；许可证：MIT, Copyright (c) 2025 Keenthemes Inc.（[LICENSE.md](https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/LICENSE.md)）。
- Base UI 源码复制保留 `Tree`、`TreeItem`、`TreeItemLabel`、`TreeDragLine`。Headless Tree Core/React `1.7.0` 负责由调用方配置的状态、键盘导航、选择、搜索、异步加载和拖放；包装层不会自动启用这些功能。
- `primitive-adaptation`：已验证的 Base UI mergeProps/useRender 及自有工具/图标。`theme-adaptation`：语义搜索高亮、Nova 圆角、逻辑内边距/拖动标记，以及镜像的 RTL chevron。
- `accessibility-fix`：叶节点省略 aria-expanded，显式指定按钮类型，隐藏装饰性图标。`bug-fix`：遵循条目缩进，组合引擎/调用方的事件与 ref，通过 nullish 回退保留空/零值标签子节点。
- 修改文件：核心源码、根/核心 barrel、manifest、引擎依赖/lock、真实引擎 fixture，以及挂载/浏览器测试。数据加载、变更、文件系统和放置操作的权威仍归调用方所有。
- `unsupported-upstream-behavior`：Headless Tree 1.7.0 的拖动几何/命中测试使用物理左侧坐标，默认 ArrowRight 展开/ArrowLeft 收起的映射固定不变。已适配 RTL 样式，但不宣称完全镜像的 RTL 拖动/重新挂接父节点几何。未 fork 引擎。
- 验证：UI/AI UI 和 Workbench 类型检查通过；真实引擎的挂载键盘/ref/缩进/多选/异步测试通过（3 项）。浏览器验收通过桌面浅色/深色、移动端浅色/深色 RTL，以及原生的调用方所有的放置操作（共 5 项矩阵测试，与 AI/DataTable 共享）。这些只证明所记录 fixture 的状态，不证明每项可选 Headless Tree 功能或 RTL 拖动几何。

## DataTable

- 起源：仓库自有的 Workbench data-table 机制，并非新引入的 ReUI DataGrid/TanStack 移植。历史外壳创建：`d48b5119f784d75b0ae1b2771b6f17a005b9955c`；共享控件：`53626739131a2458fc00897d3eb14512814728b7`。实际提取保留当前源码及既有分页修改；历史 commit 不是逐字节一致的基线。
- 外部来源：不可用/不作声明。包拥有 `src/data-table` 下的外壳、工具栏、分页、批量操作、排序/列控件、过滤器、可见性和选择；Workbench 路径仍是轻量的 locale 适配器/重新导出。领域列/操作/变更和 ResourceViewToggle 仍归应用所有。
- `authority-boundary`：标签/格式化器、状态和操作回调归调用方所有；包内没有应用 i18n、路由、传输或持久化。`primitive-adaptation`：保留现有 Base UI 滚动条组合和 Aboard 控件；Tailwind 注册提取后的源码目录。
- 入口：`@aboard/ui/data-table` 和根导出。不宣称新增表格引擎、虚拟滚动、单元格编辑或高级网格能力。
- `bug-fix`：共享批量工具栏现在使用 React useId 建立唯一的 aria-describedby 关联；分面显示有效的零计数，同时省略缺失值。直接挂载回归测试可复现两项缺陷，并在修复后通过。
- 验证：最终修复后 UI/AI UI 类型检查通过；Workbench 类型检查在较早的集成阶段通过。共享/直接包提取测试 14 项通过；最终集成的 Tree/AI/DataTable/Users/Tasks 测试运行在 5 个套件中通过 23 项测试。最终共享浏览器矩阵通过 5 个用例，覆盖选择、分页、搜索/空状态、响应式浅色/深色和 RTL。jsdom 调用方测试中仍有既有 ScrollArea act 警告；准确匹配的既有浏览器 DevTools shim 警告以注解记录，而非视为组件失败。

## 集成门禁

- `pnpm run build`：最初的 Workbench 生产构建通过；两项 DataTable 修复后的最终重跑编译成功，但应用类型检查因 `features/control-center/components/plugin-discovery-list.tsx` 中未定义的 PluginReferenceExamples 而失败。该无关文件在验证期间仍持续变化；不宣称最终全局构建成功。
- 任务所属的 Workbench 适配器/测试/测试路由的聚焦 lint 通过。全局 lint 因生成的 `.next-menu-check` 产物和无关源码错误而失败。`i18n:check` 通过，带有 181 条不阻断的英文词条警告。
- `pnpm run check`：文档覆盖率/链接/结构/组件检查、架构、卫生检查和所有工作区类型检查通过。门禁在 Host 测试处停止：无效 manifest/contribution 身份错误回显了调用方输入（`apps/host/tests/plugin-runtime.test.ts`，第 231 和 240 行）。这些问题不属于本组件库切片；不宣称全仓已就绪。
- 文档站点和新的产品/Catalog 集成已明确延期。仅供开发的 library-additions 测试页是验收 fixture，不是产品功能。

## ReUI MIT 声明

Copyright (c) 2025 Keenthemes Inc.

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
