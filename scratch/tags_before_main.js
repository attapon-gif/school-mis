const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

const stack = [];
for (let i = 350; i < 670; i++) {
  const lineNo = i + 1;
  const line = lines[i];
  const tagRegex = /<\/?([a-zA-Z0-9]+)(?:\s+[^>]*)?>/g;
  let match;
  while ((match = tagRegex.exec(line)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    const isClosing = fullTag.startsWith('</');
    const isSelfClosing = fullTag.endsWith('/>') || ['img', 'input', 'br', 'hr', 'meta', 'link'].includes(tagName);
    if (isSelfClosing) continue;

    if (isClosing) {
      if (stack.length > 0) stack.pop();
    } else {
      stack.push({ tag: tagName, line: lineNo, text: fullTag.slice(0, 50) });
    }
  }
}

console.log('Open tags right before <main>:');
stack.forEach(s => console.log(`  Line ${s.line}: <${s.tag}>  --> ${s.text}`));
