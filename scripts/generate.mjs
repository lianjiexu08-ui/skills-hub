#!/usr/bin/env node
/**
 * 从结构化数据生成 SKILL.md。
 *
 * 已存在的目录默认跳过（保护手写的深度 Skill），只有 --force 才覆盖。
 * 用法：node scripts/generate.mjs [--force] [--dry]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BATCH_A } from './data-a.mjs';
import { BATCH_B } from './data-b.mjs';
import { BATCH_C } from './data-c.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = path.join(root, 'skills');
const force = process.argv.includes('--force');
const dry = process.argv.includes('--dry');

const CATEGORY_LABELS = {
  writing: '文档与写作',
  data: '数据分析',
  product: '产品',
  design: '设计与前端',
  operations: '运维与云',
  security: '安全与合规',
  quality: '测试与质量',
  research: '研究与信息',
  business: '商业与运营',
  learning: '教学与学习',
  personal: '个人效率',
  content: '内容与媒体',
  automation: '自动化与集成',
  collaboration: '项目与协作',
  ai: '数据与 AI 工程',
  mobile: '移动与桌面',
  legal: '法务与行政',
  finance: '财务',
};

const bullet = (items) => items.map((item) => `- ${item}`).join('\n');
const numbered = (items) => items.map((item, index) => `${index + 1}. ${item}`).join('\n');

function render(skill) {
  return `---
name: ${skill.id}
description: ${skill.desc}
category: ${skill.cat}
---

# ${skill.title}

${skill.desc}

## 何时使用

${bullet(skill.use)}

## 步骤

${numbered(skill.steps)}

## 规则

${bullet(skill.rules)}

## 红线

${bullet(skill.red)}
`;
}

const all = [...BATCH_A, ...BATCH_B, ...BATCH_C];
const seen = new Set();
let created = 0, skipped = 0;

for (const skill of all) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skill.id)) throw new Error(`非法 id：${skill.id}`);
  if (seen.has(skill.id)) throw new Error(`重复 id：${skill.id}`);
  if (!CATEGORY_LABELS[skill.cat]) throw new Error(`未知分类：${skill.cat}（${skill.id}）`);
  seen.add(skill.id);
  const dir = path.join(skillsDir, skill.id);
  if (fs.existsSync(path.join(dir, 'SKILL.md')) && !force) { skipped += 1; continue; }
  if (!dry) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'SKILL.md'), render(skill));
  }
  created += 1;
}

console.log(`${dry ? '[dry] ' : ''}生成 ${created} 个，跳过 ${skipped} 个已存在，共 ${all.length} 条数据`);
