const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// 1. Check DEFAULT_GAS_URL
console.log('DEFAULT_GAS_URL line exists?', content.includes('const DEFAULT_GAS_URL ='));

// 2. Check getGasWebAppUrl
console.log('getGasWebAppUrl exists?', content.includes('function getGasWebAppUrl()'));

// 3. Check simulateLinePush
console.log('simulateLinePush exists?', content.includes('async function simulateLinePush('));
