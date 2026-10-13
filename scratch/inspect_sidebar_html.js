const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('เมนูหลัก (NAVIGATION)');
console.log(content.substring(pos - 200, pos + 3000));
