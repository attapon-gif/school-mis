const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('id="modalEgaLogin"');
const endPos = content.indexOf('</form>', pos);
console.log(content.substring(pos + 1200, endPos + 500));
