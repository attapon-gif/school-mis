const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

for (let i = 3465; i < 3550; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
