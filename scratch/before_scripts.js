const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

// Check lines after the last modal
// Where does the script start?
let firstScriptLine = -1;
lines.forEach((l, idx) => {
  if (l.includes('<script') && firstScriptLine === -1) {
    firstScriptLine = idx + 1;
  }
});
console.log(`First script tag starts at line ${firstScriptLine}`);

for (let i = firstScriptLine - 25; i < firstScriptLine; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
