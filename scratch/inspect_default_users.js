const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('const DEFAULT_SYSTEM_USERS = [');
console.log(content.substring(pos, pos + 1000));
