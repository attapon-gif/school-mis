const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('id="tab-student"');
console.log(content.substring(pos, pos + 2500));
