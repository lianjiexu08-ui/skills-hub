# skills-hub

团队自维护的 Agent Skill 库，供 Goal-Guided Brain（GGB）能力中心按需安装。

## 这是什么

一个**免费、可版本固定、可审计**的 Skill 源。每个 Skill 是一个目录，包含一份 `SKILL.md`（带 YAML frontmatter）。
GGB 能力中心可以直接从这个仓库安装单个 Skill：

```text
https://github.com/lianjiexu08-ui/skills-hub/tree/main/skills/<skill-id>
```

安装时会自动：拉取内容 → 计算摘要 → 固定版本 → 风险评估 → 由你确认后才绑定到角色。
不自动启用，不影响正在运行的任务。

## 目录

```text
skills/<skill-id>/SKILL.md   单个 Skill
catalog.json                 机器可读索引（GGB 搜索源读取）
scripts/validate.mjs         校验元数据并重新生成 catalog.json
docs/skill-schema.md         SKILL.md 编写规范
```

## 已有 Skill

| ID | 名称 | 用途 |
| --- | --- | --- |
| `engineering-workflow` | 工程交付流程 | 需求理解 → 方案设计 → 实现 → 审查 → 修复的五步主流程 |
| `code-review` | 代码审查 | 取证、预检门禁、分级审查报告 |
| `bug-fix` | 缺陷修复 | 复现定位、多方案排序、逐个尝试成功即停 |
| `project-map` | 项目地图 | 三步阅读法建立可共享的项目认知 |
| `verification-gate` | 验证门禁 | 探测项目类型并自动跑测试/类型检查/lint/构建 |
| `change-impact` | 变更影响分析 | 改动前评估影响面与回归范围 |
| `task-orchestration` | 任务编排 | 结构化多智能体协调：消息、依赖、检查点、升级 |

## 维护方式

```bash
npm run validate     # 校验所有 SKILL.md 并更新 catalog.json
npm run validate -- --check   # 只校验，不写文件（CI 用）
```

新增 Skill：

1. 在 `skills/<skill-id>/` 下写 `SKILL.md`（规范见 `docs/skill-schema.md`）。
2. `skill-id` 只用小写字母、数字和连字符，且与 frontmatter 的 `name` 一致。
3. 运行 `npm run validate` 生成索引。
4. 提交并推送。

## 约定

- **不绑定特定平台命令**：Skill 描述"怎么做"，不写死某个产品的 CLI；具体工具由执行环境提供。
- **不编造**：只写可验证的步骤；不确定的内容标注"待确认"。
- **无凭据**：仓库内不出现任何密钥、令牌、内部地址。
- **单一职责**：一个 Skill 解决一类问题，能被独立绑定和评估。
