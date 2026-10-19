# AI UI 包 Agent 指南

移植或实质修改 AI 界面前，先阅读 [`../UI-PORTING.md`](../UI-PORTING.md) 和 [`../ui/BASE-UI-MAPPING.md`](../ui/BASE-UI-MAPPING.md)。

`SOURCES.md` 是 `@aboard/ai-ui` 的来源索引：在其中保留上游 URL、不可变版本、许可证、源码路径和组件级适配摘要。`MIGRATION-CHECKPOINT.md` 跟踪当前迁移批次，不得把它当成所有计划组件均已完成的证据。

AI UI 组件可以拥有本地展示状态，但模型调用、传输、持久化、凭据、文件系统访问、插件执行、工具执行和权限审批仍归调用方所有。除非记录了有意的差异，否则保留公开的复合组件导出和已文档化的行为。
