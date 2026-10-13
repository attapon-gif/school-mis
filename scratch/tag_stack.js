const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Parse tags from line 600 to 3500
const lines = content.split('\n');

const stack = [];
for (let i = 0; i < 3500; i++) {
  const lineNo = i + 1;
  const line = lines[i];
  // Simple regex for tags
  const tagRegex = /<\/?([a-zA-Z0-9]+)(?:\s+[^>]*)?>/g;
  let match;
  while ((match = tagRegex.exec(line)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    const isClosing = fullTag.startsWith('</');
    const isSelfClosing = fullTag.endsWith('/>') || ['img', 'input', 'br', 'hr', 'meta', 'link'].includes(tagName);

    if (isSelfClosing) continue;

    if (isClosing) {
      if (stack.length > 0) {
        const top = stack.pop();
        if (lineNo >= 3375 && lineNo <= 3400) {
          console.log(`Line ${lineNo}: Closed </${tagName}> (matched <${top.tag}> from line ${top.line})`);
        }
      }
    } else {
      stack.push({ tag: tagName, line: lineNo, text: fullTag.slice(0, 40) });
      if (lineNo >= 3375 && lineNo <= 3400) {
        console.log(`Line ${lineNo}: Opened <${tagName}> (${fullTag.slice(0, 40)})`);
      }
    }
  }
}

console.log('Stack state at line 3400:');
stack.forEach(s => console.log(`  Line ${s.line}: <${s.tag}>`));
