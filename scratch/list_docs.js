const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Extract PRINT_CENTER_DOCS definition
const startIdx = content.indexOf('const PRINT_CENTER_DOCS = [');
const endIdx = content.indexOf('function syncPrintCenterClass');

const chunk = content.substring(startIdx, endIdx);
console.log('Chunk length:', chunk.length);

// Let's count docs
const matches = [...chunk.matchAll(/id:\s*['"]([^'"]+)['"],\s*category:\s*['"]([^'"]+)['"],/g)];
console.log(`Total documents found: ${matches.length}`);
matches.forEach((m, i) => {
  console.log(`${i+1}. [${m[2]}] ${m[1]}`);
});
