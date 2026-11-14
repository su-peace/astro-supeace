import assert from 'node:assert/strict';
import test from 'node:test';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { rehypeShokaAttrs } from './rehype-shoka-attrs';

async function render(source: string) {
  const processor = await createMarkdownProcessor({
    syntaxHighlight: false,
    smartypants: false,
    rehypePlugins: [rehypeShokaAttrs],
  });
  return (await processor.render(source)).code;
}

test('inline attributes at the end of a list item render as span, not li class', async () => {
  const html = await render('- [这段文字呈现流动的彩虹渐变视觉效果]{.rainbow}');
  assert.match(html, /<li><span class="rainbow">这段文字呈现流动的彩虹渐变视觉效果<\/span><\/li>/);
  assert.doesNotMatch(html, /<li class="rainbow">/);
  assert.doesNotMatch(html, /\[这段文字/);
});

test('multiple inline attributes in a list item all parse correctly, including the last one', async () => {
  const html = await render('- [红色]{.red} [蓝色]{.blue} [灰色]{.grey}');
  assert.match(
    html,
    /<li><span class="red">红色<\/span> <span class="blue">蓝色<\/span> <span class="grey">灰色<\/span><\/li>/,
  );
  assert.doesNotMatch(html, /<li class="grey">/);
  assert.doesNotMatch(html, /\[灰色\]/);
});

test('list item trailing attributes are correctly applied to li', async () => {
  const html = await render('- Astro 默认采用什么架构渲染页面？{.quiz}');
  assert.match(html, /<li class="quiz">Astro 默认采用什么架构渲染页面？<\/li>/);
});

test('list item with both inline attributes and trailing li attributes', async () => {
  const html = await render('- 答案是 [object]{.gap} {.quiz .fill}');
  assert.match(html, /<li class="quiz fill">答案是 <span class="gap">object<\/span><\/li>/);
});
