const fs = require('fs');

let content = fs.readFileSync('google-apps-script/Index.html', 'utf8');
const rootIndex = fs.readFileSync('index.html', 'utf8');

const modalStartTarget = '<!-- MODAL: ADD EXAM PERIOD -->';
const modalEndTarget = '<!-- MODAL: SUBMIT RESEARCH (CAR) WITH GOOGLE DRIVE -->';

const rootModal = rootIndex.substring(rootIndex.indexOf(modalStartTarget), rootIndex.indexOf(modalEndTarget));
const gasModalStart = content.indexOf(modalStartTarget);
const gasModalEnd = content.indexOf(modalEndTarget);

if (gasModalStart !== -1 && gasModalEnd !== -1) {
  content = content.substring(0, gasModalStart) + rootModal + content.substring(gasModalEnd);
  console.log('1. Replaced modal in GAS Index.html');
}

const funcStartTarget = 'function openModalAddExamPeriod() {';
const funcEndTarget = 'function deleteExamPeriod(id) {';

const rootFunc = rootIndex.substring(rootIndex.indexOf(funcStartTarget), rootIndex.indexOf(funcEndTarget));
const gasFuncStart = content.indexOf(funcStartTarget);
const gasFuncEnd = content.indexOf(funcEndTarget);

if (gasFuncStart !== -1 && gasFuncEnd !== -1) {
  content = content.substring(0, gasFuncStart) + rootFunc + content.substring(gasFuncEnd);
  console.log('2. Replaced exam functions in GAS Index.html');
}

fs.writeFileSync('google-apps-script/Index.html', content, 'utf8');
console.log('Synced google-apps-script/Index.html successfully!');
