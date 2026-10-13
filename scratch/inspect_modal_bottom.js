const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf("quickLogin('student')");
console.log(content.substring(pos, pos + 1000));
