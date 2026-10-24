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

共 **200** 个，覆盖 19 个领域。完整清单见 [`catalog.json`](./catalog.json)（含每个 Skill 的 ID、标题、描述、分类与直装地址）。

| 领域 | 分类键 | 数量 |
| --- | --- | --- |
| 运维与云 | `operations` | 17 |
| 工程开发 | `engineering` | 14 |
| 数据分析 | `data` | 13 |
| 设计与前端 | `design` | 13 |
| 项目与协作 | `collaboration` | 13 |
| 数据与 AI 工程 | `ai` | 12 |
| 文档与写作 | `writing` | 12 |
| 内容与媒体 | `content` | 12 |
| 测试与质量 | `quality` | 11 |
| 产品 | `product` | 11 |
| 安全与合规 | `security` | 10 |
| 研究与信息 | `research` | 10 |
| 个人效率 | `personal` | 10 |
| 自动化与集成 | `automation` | 8 |
| 教学与学习 | `learning` | 8 |
| 商业与运营 | `business` | 8 |
| 移动与桌面 | `mobile` | 7 |
| 财务 | `finance` | 6 |
| 法务与行政 | `legal` | 5 |

### 按需查找

```bash
# 本地查看全部
node -e "const c=require('./catalog.json');for(const s of c.skills)console.log(s.category.padEnd(15),s.id.padEnd(28),s.title)"

# 按分类过滤
node -e "const c=require('./catalog.json');for(const s of c.skills.filter(x=>x.category==='data'))console.log(s.id,s.title)"
```

安装任意一个：

```text
https://github.com/lianjiexu08-ui/skills-hub/tree/main/skills/<id>
```

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
