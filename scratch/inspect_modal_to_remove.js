const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('id="modalEgaLogin"');
const endPos = content.indexOf('<!-- Footer Copyright & Developer Contact -->', pos);
console.log(content.substring(pos, endPos !== -1 ? endPos + 500 : pos + 3500));
