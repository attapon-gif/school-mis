const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

const regex = /function\s+([a-zA-Z0-9_]*[pP]rint[a-zA-Z0-9_]*)\s*\(([^)]*)\)/g;
let m;
const funcs = [];
while ((m = regex.exec(s)) !== null) {
  funcs.push({ name: m[1], args: m[2] });
}

console.log('Total print functions:', funcs.length);
funcs.forEach(f => console.log(`- ${f.name}(${f.args})`));

const onclicks = [];
const oRegex = /onclick="([^"]*[pP]rint[^"]*)"/g;
while ((m = oRegex.exec(s)) !== null) {
  onclicks.push(m[1]);
}
console.log('\nTotal onclick prints:', onclicks.length);
const uniqueOnclicks = [...new Set(onclicks)];
uniqueOnclicks.forEach(o => console.log(`* ${o}`));
