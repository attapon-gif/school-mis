const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const matches = [...content.matchAll(/periodsData/g)];
console.log('periodsData occurrences:', matches.length);
matches.forEach(m => {
  console.log('Match at', m.index);
  console.log(content.substring(m.index - 50, m.index + 200));
});
