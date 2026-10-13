const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('เพิ่มคาบสอบในตารางสอบ');
console.log(content.substring(pos - 300, pos + 2500));
