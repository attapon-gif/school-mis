const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const targetRegex = /(font-family:\s*'Sarabun',\s*'TH Sarabun New',\s*'TH Sarabun PSK',\s*sans-serif\s*!important;\s*\}\s*)(\}\s*\.fade-in)/;

if (targetRegex.test(html)) {
  html = html.replace(targetRegex, `$1      table, tr, td, th {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      .no-break {
        page-break-inside: avoid !important;
        page-break-before: avoid !important;
        page-break-after: avoid !important;
        break-inside: avoid !important;
      }
    $2`);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Successfully updated print CSS in index.html');
} else {
  console.log('Regex did not match');
}
