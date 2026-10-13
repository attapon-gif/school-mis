const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('id="modalEgaLogin"');
if (pos !== -1) {
  console.log(content.substring(pos, pos + 2500));
} else {
  console.log('modalEgaLogin not found');
}
