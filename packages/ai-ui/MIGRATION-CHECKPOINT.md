# AI Elements Base Nova 迁移检查点

## 意图
将完整的官方 AI Elements 业务源码复制到 packages/ai-ui，并使用 Aboard Base Nova 原语。不引入第二套 Radix UI 系统。补充规范性的双语 UI System 文档和有实际意义的共享预览。父任务的活动 goal：goal-689b2d39-6afe-4a70-a6fb-716159dec74c（暂不要完成）。

## 固定参考
- AI Elements：C:/Users/ASUS/.agent-reach/references/ai-elements-reference，commit 6a9d5b1822ffb10bba4bd97175f01edd7d8651cd。
- ReUI：C:/Users/ASUS/.agent-reach/references/reui-base-reference，commit 8a2c701eaf95729f238274d5ce2555a5a8bd23e7。
- 官方 AI Elements 当前是默认的 shadcn/Radix 源码，没有单独的 Base UI 目录。此前声称 AI Elements 中存在 registry-reui/bases/base 的叙述有误。用户已明确授权移植到 Base Nova。

## 已落地，仍为部分实现
- Conversation：完整的粘底滚动/Markdown 下载，官方 lucide 图标。
- Message：完整的官方业务组合、分支/操作/Streamdown；内部 Aboard RuntimeMessage 适配器；Base UI Tooltip 使用 render 而非 asChild。
- 新增 Shimmer、Image、Sources UI、Task 实现。
- 新增 Base Nova Collapsible 和 ButtonGroup 依赖；已修正准确的 ReUI 源码 commit 头。
- 已添加并告知用户的直接依赖：ai6.0.105、use-stick-to-bottom1.1.3、motion12.26.2、lucide-react1.33.0、streamdown2.4.0，插件 cjk1.0.2/code1.1.0/math1.0.2/mermaid1.0.2。
- 元数据 sources.ts 已重命名为 provenance.ts，以解决与 UI sources.tsx 的冲突。旧包子路径 ./sources 仍指向 provenance.ts 以保持兼容；./sources-ui 指向 sources.tsx。根入口同时导出元数据和 UI。
- 十份文档（两种语言）：重写 conversation；新增 sources/task/shimmer/image。仍需验证 sources-ui 导入和实际 API。
- 两份预览契约现在均区分 ReUI 基础源码与 AI Elements 源码。
- 注册表已有初步的 sources/task/shimmer/image 预览，但尚未达到验收要求：代码的导入/回调不完整，sources 生成代码缺少第二个来源，image 使用 1px fixture 和占位 alt，未强制执行时长控件的边界，尚无展开来源测试。

## 截至此时的验证
- @abworks-dev/ui 和 @abworks-dev/ai-ui 类型检查在最近一次 Sources props 适配前通过。
- 站点类型检查在 provenance 重命名后通过。最近修改后需重跑（SourcesProps 现在使用实际的 Collapsible Props，且已恢复实时受控状态）。
- 本批 AI 组件尚未进行生产构建/浏览器验收。此前的 ReUI 服务 pwsh-37（localhost4187）已过时。

## 接下来的立即步骤
1. 通过专用的 ai-elements-previews.tsx 修复有实际意义的预览/代码一致性；添加本地化 Image 资源/alt；不得使用占位图片。保留共享外壳。
2. 保留完整的官方状态 class 行为：sources/task 从 Radix 复制的 data-state 选择器必须映射到 Base UI data-open/closed 等。task 源码头的 hash 可能被截断，需检查。
3. 为新页面添加元数据/目录的包/源码映射，以及 locale meta.json 导航条目。现有校验器即使缺少映射也可能通过，不得将其视为完整性证据。
4. 按实际需要，从固定 ReUI 构建剩余原语依赖闭包：HoverCard/PreviewCard 等价物、ScrollArea、Alert、Spinner、DropdownMenu、Carousel、Accordion、Switch；现有 input-group/sheet 核心文件已经存在，但缺少公开导出。不得引入 Radix 导入。cmdk 已有传递 Radix 依赖，不得宣称整个依赖树不含 Radix。
5. 更广的已批准迁移范围包括官方展示/聊天/代码/工作流中有用的组件，不能在第一批后视为完成。优先处理 attachments、reasoning、chain-of-thought、plan、suggestion、code-block、tool、confirmation、prompt-input，再处理其他安全的本地展示组件。保留官方行为，不做简化替代；AI SDK 仅类型的视觉 props 不授权 Host 调用。有副作用的 API 仍由调用方触发，不得在文档中自动启用。
6. 添加完整双语文档，对应官方组件用途/示例/props，并补充本地包导入/差异/权威边界；更新现有 Message/Tool/Confirmation/Prompt 文档。
7. 添加包级业务测试和生成 TSX 检查、来源/无新增 Radix 检查，以及站点校验器/构建/浏览器检查。

## 约束
工作树中有大量此前无关任务的未提交改动，不得宽泛暂存/还原。尚未提交。已知此前根检查因 Workbench semantic-primitives 测试中五个未使用的 @ts-expect-error 而失败。站点构建可通过在 apps/site 中运行 node node_modules/next/dist/bin/next build 可靠完成。所有承诺范围和证据完成前，不得将目标标记为完成。当前批次的所有子 Agent 均已结束，无需继续子 Agent。
