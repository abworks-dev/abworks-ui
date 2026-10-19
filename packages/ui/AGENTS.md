# UI 包 Agent 指南

移植或实质修改共享原语前，先阅读 [`../UI-PORTING.md`](../UI-PORTING.md) 和 [`BASE-UI-MAPPING.md`](BASE-UI-MAPPING.md)。

`@abworks-dev/ui` 拥有 Base UI/Base Nova 原语接口、语义主题 Token 和公开导出。原语行为缺失时应在本包修复，不能在功能包中创建私有替代品。依据已安装包的类型和实际渲染 DOM 核实映射，不得推断通用的 Radix 到 Base UI 替换规则。
