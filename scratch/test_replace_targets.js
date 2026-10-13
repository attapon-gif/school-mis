const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Check navigation start
const navPos = content.indexOf('<nav class="space-y-3">');
console.log('navPos found:', navPos !== -1);
console.log(content.substring(navPos, navPos + 500));

// Check teacher bar
const teachBarPos = content.indexOf('<!-- HOMEROOM TEACHER BAR: พิมพ์ ปพ.6 รายห้องเรียน (ข้อ 3) -->');
console.log('teachBarPos found:', teachBarPos !== -1);
console.log(content.substring(teachBarPos, teachBarPos + 250));

// Check toolbar
const toolBarPos = content.indexOf('<!-- Quick Action Toolbar on Header -->');
console.log('toolBarPos found:', toolBarPos !== -1);
console.log(content.substring(toolBarPos, toolBarPos + 250));
