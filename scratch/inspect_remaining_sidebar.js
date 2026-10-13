const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

console.log(content.substring(163000, 172000));
