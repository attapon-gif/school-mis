const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('id="modalAddExamPeriod"');
const endPos = content.indexOf('<!-- MODAL: SUBMIT RESEARCH', pos);
console.log(content.substring(pos - 50, endPos));
