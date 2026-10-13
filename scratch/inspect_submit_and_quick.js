const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const pos = content.indexOf('<button type="submit" class="w-full btn-ega-primary');
console.log(content.substring(pos, pos + 2500));
