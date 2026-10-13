const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const posTable = content.indexOf('id="userTableBody"');
console.log(content.substring(posTable, posTable + 1200));
