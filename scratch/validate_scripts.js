const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Check script tags in index.html
const scriptMatches = [...content.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
console.log(`Found ${scriptMatches.length} script tags`);

const vm = require('vm');

scriptMatches.forEach((s, idx) => {
  try {
    new vm.Script(s[1]);
    console.log(`Script ${idx + 1}: Valid syntax (${s[1].length} chars)`);
  } catch (err) {
    console.error(`Script ${idx + 1} syntax error:`, err.message);
  }
});
