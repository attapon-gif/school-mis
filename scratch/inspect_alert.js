const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('ตรวจพบความขัดแย้งในตารางสอบ');
console.log(content.substring(pos - 100, pos + 300));
