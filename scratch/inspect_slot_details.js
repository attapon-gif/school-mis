const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('if (pNum === 4 || (slot && slot.subject === \'พักกลางวัน\'))');
console.log(content.substring(pos, pos + 2500));
