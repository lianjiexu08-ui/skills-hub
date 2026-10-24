---
name: terraform-review
description: 审查基础设施变更计划。当需要判断一次 apply 会不会造成中断或数据丢失时使用。
category: operations
---

# Terraform 变更审查

审查基础设施变更计划。当需要判断一次 apply 会不会造成中断或数据丢失时使用。

## 何时使用

- 基础设施 PR 评审
- 生产变更前

## 步骤

1. 读取 plan，逐条看创建/修改/删除
2. 重点标记 replace 与 destroy
3. 确认资源依赖顺序
4. 检查是否有未预期的漂移

## 规则

- 删除与替换必须有备份或迁移方案
- 关注隐式依赖导致的连锁重建
- 计划与代码一致才可执行

## 红线

- 不忽略任何 destroy
- 不在未确认影响面时 apply 生产
