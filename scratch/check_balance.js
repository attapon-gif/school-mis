const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

// Check lines 3370 to 3480
console.log('--- Lines 3380-3395 ---');
for (let i = 3380; i <= 3395; i++) {
  console.log(`${i}: ${lines[i-1]}`);
}

// Check tag balance inside tab-print-center
let printCenterLines = [];
let inPrint = false;
lines.forEach((l, idx) => {
  if (l.includes('id="tab-print-center"')) inPrint = true;
  if (inPrint) {
    printCenterLines.push({ line: idx + 1, text: l });
    if (l.includes('</section>')) inPrint = false;
  }
});

console.log(`Print center lines count: ${printCenterLines.length}`);
let divCount = 0;
printCenterLines.forEach(item => {
  const opens = (item.text.match(/<div(\s|>)/g) || []).length;
  const closes = (item.text.match(/<\/div>/g) || []).length;
  divCount += opens - closes;
});
console.log(`Div balance in tab-print-center: ${divCount}`);
