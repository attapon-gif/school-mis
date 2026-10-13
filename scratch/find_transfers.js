const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const lines = s.split('\n');
lines.forEach((l, i) => {
  if (l.includes('tab-transfers')) {
    console.log(i + 1, l);
  }
});
