const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('function renderTimetableGrid');
console.log(content.substring(pos + 2000, pos + 4500));
