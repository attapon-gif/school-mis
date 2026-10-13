const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const target1 = `<span class="text-[10px] text-blue-600">นักเรียน: เลข 4 หลัก / บุคลากร: 1234</span>`;
console.log('Target 1 found:', content.includes(target1));

const target2_start = `<!-- 1-Click Quick Demo Accounts -->`;
const target2_end = `<!-- Footer Info -->`;
const idx2_start = content.indexOf(target2_start);
const idx2_end = content.indexOf(target2_end);
console.log('Target 2 found:', idx2_start !== -1 && idx2_end !== -1);
if (idx2_start !== -1 && idx2_end !== -1) {
  console.log('Target 2 snippet:');
  console.log(content.substring(idx2_start, idx2_end));
}
