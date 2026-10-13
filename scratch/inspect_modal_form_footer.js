const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('id="formEgaLogin"');
const endPos = content.indexOf('<!-- END EGA LOGIN MODAL -->', pos);
console.log(content.substring(pos, pos + 2000));
