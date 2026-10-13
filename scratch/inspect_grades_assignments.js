const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const matches = [...content.matchAll(/DEFAULT_MOCK_DATA\.grades\s*=/g)];
console.log('DEFAULT_MOCK_DATA.grades assignments:', matches.length);
matches.forEach(m => {
  console.log('--- At', m.index);
  console.log(content.substring(m.index, m.index + 300));
});
