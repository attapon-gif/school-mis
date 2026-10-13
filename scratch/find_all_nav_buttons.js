const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Find all buttons inside the sidebar nav
const navMatch = content.match(/<nav class="space-y-3">([\s\S]*?)<\/nav>/);
if (navMatch) {
  const navHtml = navMatch[1];
  const btnMatches = [...navHtml.matchAll(/id="(nav-[^"]+)"/g)];
  console.log('Total nav buttons in sidebar:', btnMatches.length);
  btnMatches.forEach((m, idx) => console.log(idx + 1, m[1]));
} else {
  console.log('nav not found');
}
