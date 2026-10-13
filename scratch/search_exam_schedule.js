const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const matches = [...content.matchAll(/examPeriod|handleSaveExamPeriod|modalAddExamPeriod|renderExamSchedule/g)];
matches.forEach(m => {
  console.log('Match:', m[0], 'at', m.index);
  console.log(content.substring(m.index - 50, m.index + 250));
  console.log('---');
});
