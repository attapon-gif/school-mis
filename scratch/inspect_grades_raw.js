const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const matches = [...content.matchAll(/allGradesRaw/g)];
console.log('allGradesRaw occurrences:', matches.length);
matches.forEach(m => {
  console.log('--- At', m.index);
  console.log(content.substring(m.index - 50, m.index + 200));
});
