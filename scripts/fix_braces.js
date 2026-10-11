const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /document\.body\.style\.overflow = '';\s*\}\s*\}\s*\}\s*\}\s*\}\s*function fileToBase64/;
const replacement = "document.body.style.overflow = '';\n        }\n      }\n    }\n\n    function fileToBase64";

if (regex.test(html)) {
  html = html.replace(regex, replacement);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Successfully fixed extra braces!');
} else {
  console.log('Regex did not match, let us check slice:');
  const idx = html.indexOf('function fileToBase64');
  console.log(JSON.stringify(html.substring(idx - 60, idx + 40)));
}
