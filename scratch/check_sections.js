const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

let depth = 0;
let mainStart = -1;
let mainEnd = -1;

lines.forEach((l, idx) => {
  const lineNo = idx + 1;
  const tabMatch = l.match(/<section id=["'](tab-[^"']+)["']/);
  if (tabMatch) {
    console.log(`${lineNo}: START ${tabMatch[1]}`);
  }
  if (l.includes('</section>')) {
    console.log(`${lineNo}: END section`);
  }
  if (l.includes('<main')) {
    mainStart = lineNo;
    console.log(`${lineNo}: START <main>`);
  }
  if (l.includes('</main>')) {
    mainEnd = lineNo;
    console.log(`${lineNo}: END </main>`);
  }
});
