const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

// Find all </div> after line 3470 up to the end of the file
for (let i = 3470; i < 4500; i++) {
  const lineNo = i + 1;
  const line = lines[i];
  if (line.includes('</main>') || line.includes('</body>')) {
    console.log(`${lineNo}: ${line}`);
  }
}

// Find total <div> and </div> in index.html
let openDivs = 0;
let closeDivs = 0;
lines.forEach(l => {
  openDivs += (l.match(/<div(\s|>)/g) || []).length;
  closeDivs += (l.match(/<\/div>/g) || []).length;
});
console.log(`Total <div: ${openDivs}, Total </div>: ${closeDivs}, Diff: ${openDivs - closeDivs}`);
