const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('สำหรับครูประจำชั้น: พิมพ์สมุดรายงานผลการเรียน');
console.log(content.substring(pos - 200, pos + 400));
