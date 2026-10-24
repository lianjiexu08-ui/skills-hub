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

### 流程主线

| ID | 名称 | 用途 |
| --- | --- | --- |
| `engineering-workflow` | 工程交付流程 | 需求理解 → 方案设计 → 实现 → 审查 → 修复的五步主流程 |

### 需求与设计

| ID | 名称 | 用途 |
| --- | --- | --- |
| `requirement-analysis` | 需求澄清 | 把模糊想法变成可验收的需求与范围边界 |
| `technical-design` | 技术方案设计 | 模块划分、数据流、接口契约与关键权衡 |
| `api-contract` | 接口契约 | 输入输出约定、错误码与向后兼容策略 |
| `adr` | 架构决策记录 | 记录影响长期结构的选择与代价 |
| `change-impact` | 变更影响分析 | 改动前评估影响面与回归范围 |

### 实现与质量

| ID | 名称 | 用途 |
| --- | --- | --- |
| `code-review` | 代码审查 | 取证、预检门禁、分级审查报告 |
| `bug-fix` | 缺陷修复 | 复现定位、多方案排序、逐个尝试成功即停 |
| `refactor-safely` | 安全重构 | 行为不变前提下的小步重构 |
| `test-design` | 测试设计 | 覆盖正常、边界、错误与回归点 |
| `verification-gate` | 验证门禁 | 探测项目类型并自动跑测试/类型检查/lint/构建 |
| `dependency-audit` | 依赖评估 | 引入、升级、移除依赖的判断依据 |

### 安全与性能

| ID | 名称 | 用途 |
| --- | --- | --- |
| `security-review` | 安全审查 | 输入、执行、授权、凭据、网络风险 |
| `performance-review` | 性能审查 | 先测量再优化，定位 N+1、内存、并发问题 |
| `data-migration` | 数据迁移 | 分阶段、幂等、可回滚的数据结构变更 |

### 交付与协作

| ID | 名称 | 用途 |
| --- | --- | --- |
| `release-readiness` | 发布就绪检查 | 变更、证据、兼容、回滚的发布前核对 |
| `pr-description` | 变更说明 | 让审查者快速理解改了什么与为什么 |
| `handoff-note` | 交接说明 | 让下一个人无需追问就能接着干 |
| `task-orchestration` | 任务编排 | 交接 vs 受控分派、依赖、决策门、升级 |
| `project-map` | 项目地图 | 三步阅读法建立可共享的项目认知 |
| `issue-tracker-workflow` | 工单驱动的工作流 | 读工单、状态流转、完成说明、未确认写入 |
| `skill-authoring` | 编写 Skill | 新增或重构 Skill 的规范与自检 |

### 环境与界面自动化

| ID | 名称 | 用途 |
| --- | --- | --- |
| `disposable-workspace` | 一次性执行环境 | 三阶段快照、认证隔离、用完即弃 |
| `ui-automation` | 界面自动化 | 可访问性树、语义动作、状态确认 |
| `device-automation` | 设备自动化 | 归一化坐标、点按优先、设备清理 |

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
