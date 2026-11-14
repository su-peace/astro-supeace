import assert from 'node:assert/strict';
import test from 'node:test';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { remarkShokaPreprocess } from './remark-shoka-preprocess';
import { preprocessShokaSyntax } from './shoka-preprocessor';

async function renderMarkdown(source: string) {
  const processor = await createMarkdownProcessor({
    syntaxHighlight: false,
    smartypants: false,
    remarkPlugins: [[remarkShokaPreprocess, { enableContainers: true, enableMath: true }], remarkMath],
    rehypePlugins: [rehypeKatex],
  });
  return (await processor.render(source)).code;
}

test('renders untitled Obsidian callout as Shoka note-block', async () => {
  const md = ['>[!note] ', '>已有数据关系 -> 元路径构造特征 -> 随机森林集成 -> 预测潜在关联'].join('\n');
  const html = await renderMarkdown(md);
  assert.match(html, /<div class="note-block note-info">/);
  assert.doesNotMatch(html, /class="note-title"/);
  assert.match(html, /<p>已有数据关系 -> 元路径构造特征 -> 随机森林集成 -> 预测潜在关联<\/p>/);
});

test('renders titled Obsidian callout with nested list and math', async () => {
  const md = [
    '>[!note]  $SVD$ 的作用',
    '>1. 假设存在两个路径：`D1 -> P1 -> S1`',
    '>2. 计数 $$X_2(D1,S1) = 1 + 1 = 2$$',
    '>3. 采用公式',
    '>\t- 关联矩阵依次相乘 $X(i,j)$',
  ].join('\n');
  const html = await renderMarkdown(md);
  assert.match(html, /<div class="note-block note-info">/);
  assert.match(html, /<div class="note-title">\s*<p><span class="katex">/);
  assert.match(html, /的作用<\/p>\s*<\/div>/);
  assert.match(html, /<ol>/);
  assert.match(html, /<ul>/);
  assert.match(html, /class="katex"/);
});

test('maps collapsible Obsidian callouts (+/-) to details.collapse-block', async () => {
  const md = ['> [!warning]- 注意事项', '> 1. 第一条', '', '> [!tip]+', '> 默认展开内容'].join('\n');
  const html = await renderMarkdown(md);
  assert.match(html, /<details class="collapse-block collapse-warning">\s*<summary>注意事项<\/summary>/);
  assert.match(html, /<details class="collapse-block collapse-primary" open>\s*<summary>Tip<\/summary>/);
});

test('leaves Obsidian callout syntax inside code fences untouched', () => {
  const md = ['```markdown', '> [!danger] 不会解析', '> 内容', '```'].join('\n');
  assert.equal(preprocessShokaSyntax(md), md);
});
