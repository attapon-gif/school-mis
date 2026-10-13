const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('id="userTableBody"');
console.log(content.substring(pos - 300, pos + 300));
