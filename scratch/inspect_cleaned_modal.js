const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('id="modalEgaLogin"');
const endPos = content.indexOf('</div>\n    </div>\n  </div>', pos);
console.log(content.substring(pos, pos + 2500));
