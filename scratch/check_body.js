const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Let's trace from line 3370 to 3480
const lines = content.split('\n');
console.log('Lines 3470-3480:');
for (let i = 3470; i < 3485; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}

// Where is </body>?
lines.forEach((l, idx) => {
  if (l.includes('</body>')) console.log(`</body> at line ${idx+1}`);
});
