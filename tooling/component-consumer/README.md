# 外部 React 归档消费验证

此 fixture 会复制到工作区外的操作系统临时目录。默认只安装 UI 归档，不使用仓库别名或源码导入。浏览器工具来自仓库测试设施，而非浏览器应用的依赖图。本地 HTTP 服务只为检查存在，并在 `finally` 关闭。

从仓库根目录运行（使用绝对目标路径，因为 pnpm pack 相对调用目录解析相对路径）：

```powershell
pnpm --filter @aboard/ui pack --pack-destination "$PWD/.data/component-library"
node tooling/component-consumer/verify.mjs "$PWD/.data/component-library/aboard-ui-0.1.0.tgz"
```

若同时验证可选 AI 包，先构建 UI，再打包 AI，并将 AI 归档作为第三个参数：

```powershell
pnpm --filter @aboard/ai-ui pack --pack-destination "$PWD/.data/component-library"
node tooling/component-consumer/verify.mjs "$PWD/.data/component-library/aboard-ui-0.1.0.tgz" "$PWD/.data/component-library/aboard-ai-ui-0.1.0.tgz"
```

此模式显式将 AI UI 中按版本声明的 `@aboard/ui` 依赖覆盖为同一 UI 归档，因为两个包均尚未发布到 registry。覆盖不指向仓库源码。检查声明时不使用 `skipLibCheck`，包含可选 Canvas 声明图，并显式启用 Shiki `Symbol.dispose` 类型所需的 `ESNext.Disposable`。Node/JSON Schema/Mermaid 声明依赖归 AI UI 所有，不由此使用方手动安装。检查会对本地展示消息执行类型检查、生产打包和浏览器渲染，不依赖 Nexus contracts 或服务。AI UI 保留自己的上游许可声明。

需要 Node 24、pnpm 11、仓库依赖，以及通过 `pnpm exec playwright install chromium` 安装的 Playwright Chromium 浏览器；不需要 Nexus/Workbench。脚本保留外部目录以便检查，并报告路径；不会发布内容或修改 registry。安装声明依赖时可能需要网络访问。

检查范围：归档导出目标；UI 不含工作区/Nexus/AI 依赖；Bundler 与 NodeNext 两种模式下以 `skipLibCheck: false` 解析 root/core/data-table/testing barrel 声明；生产 JS 与 Tailwind CSS 构建；Button 状态；原生必填字段校验/提交；Dialog 的真实 body Portal；Base UI guard 重定向后的焦点约束；Escape/焦点恢复；Tooltip；以及包含 Portal 在内的浅色/深色语义颜色。

这是浏览器客户端消费检查，不是 Next.js SSR/RSC、React 18、CommonJS、完整可访问性或所有组件认证。默认样式表仍是 Tailwind 4 构建输入，不是预编译 CSS。仓库内 fixture 有意不作为另一个工作区应用。
