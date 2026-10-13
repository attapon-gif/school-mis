const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

let currentSection = null;
lines.forEach((l, idx) => {
  const lineNo = idx + 1;
  const match = l.match(/<section(?:\s+id=["']([^"']+)["'])?[^>]*>/);
  if (match) {
    if (currentSection) {
      console.log(`WARNING: Nested or unclosed section! ${currentSection.id} (line ${currentSection.line}) when opening line ${lineNo}`);
    }
    currentSection = { id: match[1] || 'no-id', line: lineNo };
  }
  if (l.includes('</section>')) {
    if (!currentSection) {
      console.log(`EXTRA </section> at line ${lineNo}!`);
    } else {
      currentSection = null;
    }
  }
});
