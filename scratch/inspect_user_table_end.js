const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('function renderUserManagementTable');
console.log(content.substring(pos + 1500, pos + 3500));
