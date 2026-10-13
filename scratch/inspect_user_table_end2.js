const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('function renderUserManagementTable');
console.log(content.substring(pos + 3300, pos + 4800));
