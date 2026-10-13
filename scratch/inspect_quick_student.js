const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf("quickLogin('student')");
console.log(content.substring(pos - 200, pos + 400));
