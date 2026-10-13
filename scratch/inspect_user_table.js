const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const posTable = content.indexOf('userTableBody');
console.log('--- HTML around userTableBody ---');
console.log(content.substring(posTable - 500, posTable + 600));

const posFunc = content.indexOf('function renderUserManagementTable');
console.log('--- function renderUserManagementTable ---');
console.log(content.substring(posFunc, posFunc + 1500));
