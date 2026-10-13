const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

console.log(content.substring(158176, 163000));
