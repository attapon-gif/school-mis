const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Test that all variables in PRINT_CENTER_DOCS can be evaluated
const vm = require('vm');
const scriptChunk = content.substring(
  content.indexOf('const PRINT_CENTER_DOCS = ['),
  content.indexOf('function syncPrintCenterClass')
);

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(scriptChunk, sandbox);

console.log('PRINT_CENTER_DOCS loaded:', sandbox.PRINT_CENTER_DOCS.length);
