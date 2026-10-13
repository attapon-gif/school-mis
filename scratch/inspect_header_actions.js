const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('สำรอง/กู้คืนข้อมูล');
console.log(content.substring(pos - 300, pos + 800));
