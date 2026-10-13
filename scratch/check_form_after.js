const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const pos = content.indexOf('id="formEgaLogin"');
console.log(content.substring(pos + 1200, pos + 2500));
