#!/usr/bin/env node
/**
 * 校验 skills/ 下所有 SKILL.md，并生成 catalog.json。
 *
 * 用法：
 *   node scripts/validate.mjs            校验并写入 catalog.json
 *   node scripts/validate.mjs --check    只校验，不写文件（CI 用）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = path.join(root, 'skills');
const catalogFile = path.join(root, 'catalog.json');
const checkOnly = process.argv.includes('--check');

const CATEGORY_LABELS = {
  engineering: '工程开发', quality: '测试与质量', security: '安全与合规', operations: '运维与云',
  data: '数据分析', ai: '数据与 AI 工程', design: '设计与前端', product: '产品', writing: '文档与写作',
  research: '研究与信息', content: '内容与媒体', business: '商业与运营', finance: '财务',
  legal: '法务与行政', collaboration: '项目与协作', personal: '个人效率', learning: '教学与学习',
  automation: '自动化与集成', mobile: '移动与桌面', general: '其他',
};
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FORBIDDEN_TERMS = ['devagent'];

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return null;
  const data = {};
  let key = null;
  for (const raw of match[1].split(/\r?\n/)) {
    if (!raw.trim()) continue;
    // 支持 `key: value` 与折叠块 `key: >`
    const folded = raw.match(/^([A-Za-z0-9_-]+):\s*[>|]\s*$/);
    if (folded) {
      key = folded[1];
      data[key] = '';
      continue;
    }
    const pair = raw.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (pair) {
      key = pair[1];
      data[key] = pair[2].trim().replace(/^['"]|['"]$/g, '');
      continue;
    }
    if (key && /^\s+/.test(raw)) {
      data[key] = `${data[key]} ${raw.trim()}`.trim();
    }
  }
  return { data, body: text.slice(match[0].length) };
}

if (!fs.existsSync(skillsDir)) {
  fail('缺少 skills/ 目录');
  process.exit(1);
}

const entries = [];
const ids = new Set();

for (const name of fs.readdirSync(skillsDir).sort()) {
  const dir = path.join(skillsDir, name);
  if (!fs.statSync(dir).isDirectory()) continue;
  const file = path.join(dir, 'SKILL.md');
  if (!fs.existsSync(file)) {
    fail(`${name}: 缺少 SKILL.md`);
    continue;
  }
  if (!ID_PATTERN.test(name)) {
    fail(`${name}: 目录名必须是小写字母/数字/连字符`);
  }
  const text = fs.readFileSync(file, 'utf8');
  const parsed = parseFrontmatter(text);
  if (!parsed) {
    fail(`${name}: 缺少 YAML frontmatter`);
    continue;
  }
  const { data, body } = parsed;
  if (data.name !== name) {
    fail(`${name}: frontmatter name 为 "${data.name}"，必须与目录名一致`);
  }
  if (!data.description || data.description.length < 10) {
    fail(`${name}: description 缺失或过短`);
  }
  if (body.trim().length < 100) {
    fail(`${name}: 正文过短（少于 100 字符）`);
  }
  for (const term of FORBIDDEN_TERMS) {
    if (text.toLowerCase().includes(term)) {
      fail(`${name}: 包含需脱敏的术语 "${term}"`);
    }
  }
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(text)) {
    fail(`${name}: 疑似包含私钥`);
  }
  if (ids.has(name)) fail(`${name}: skill id 重复`);
  ids.add(name);

  // 从正文首个非空行提取标题
  const heading = body.split(/\r?\n/).find(line => /^#\s+/.test(line.trim()));
  entries.push({
    id: name,
    name: data.name,
    title: heading ? heading.replace(/^#\s+/, '').trim() : name,
    description: String(data.description).replace(/\s+/g, ' ').trim(),
    category: typeof data.category === 'string' && data.category.trim() ? data.category.trim() : 'general',
    categoryLabel: CATEGORY_LABELS[typeof data.category === 'string' ? data.category.trim() : 'general'] || '其他',
    path: `skills/${name}/SKILL.md`,
    installUrl: `https://github.com/lianjiexu08-ui/skills-hub/tree/main/skills/${name}`,
  });
}

if (entries.length === 0) fail('skills/ 下没有任何可用 Skill');

const categories = {};
for (const entry of entries) categories[entry.category] = (categories[entry.category] || 0) + 1;
const catalog = {
  schemaVersion: 2,
  generatedBy: 'scripts/validate.mjs',
  installUrlTemplate: 'https://github.com/lianjiexu08-ui/skills-hub/tree/main/skills/<id>',
  total: entries.length,
  categories,
  skills: entries,
};

if (checkOnly) {
  const existing = fs.existsSync(catalogFile) ? fs.readFileSync(catalogFile, 'utf8') : '';
  const next = `${JSON.stringify(catalog, null, 2)}\n`;
  if (existing !== next) {
    fail('catalog.json 与 skills/ 不一致，请运行 npm run validate 后提交');
  }
} else {
  fs.writeFileSync(catalogFile, `${JSON.stringify(catalog, null, 2)}\n`);
}

if (process.exitCode) {
  console.error(`\n校验失败：${entries.length} 个 Skill 通过，但存在错误。`);
} else {
  console.log(`✓ ${entries.length} 个 Skill 校验通过${checkOnly ? '' : '，catalog.json 已更新'}`);
  for (const entry of entries) console.log(`  - ${entry.id}  ${entry.title}`);
}
