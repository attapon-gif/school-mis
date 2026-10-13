const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const sIdx = content.indexOf('<tbody id="transfersTableBody"');
const eIdx = content.indexOf('<!-- MODAL: IMPORT STUDENTS FROM EXCEL');

console.log('sIdx:', sIdx, 'eIdx:', eIdx);
if (sIdx !== -1 && eIdx !== -1) {
  const chunk = content.substring(sIdx - 50, eIdx);
  console.log('Chunk length:', chunk.length);
  fs.writeFileSync('scratch/current_chunk.txt', chunk, 'utf8');
}
