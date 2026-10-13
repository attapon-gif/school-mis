const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('<section id="tab-attendance-daily"');
const endIdx = html.indexOf('<!-- MODULE 15: เยี่ยมบ้านนักเรียนออนไลน์');
console.log('tab-attendance-daily start:', startIdx, 'end:', endIdx);

const jsStart = html.indexOf('// 2. DAILY ATTENDANCE & 4-IN-1 ROUTINES (ข้อ 2)');
const jsEnd = html.indexOf('// 3. BMI & NUTRITION TRACKING (ข้อ 3)');
console.log('attendance JS start:', jsStart, 'end:', jsEnd);

const savingsHtmlStart = html.indexOf('<section id="tab-savings"');
const savingsHtmlEnd = html.indexOf('<!-- MODULE 19:');
console.log('savings HTML start:', savingsHtmlStart, 'end:', savingsHtmlEnd);

const savingsJsStart = html.indexOf('// 4. STUDENT SAVINGS SYSTEM (ข้อ 4)');
const savingsJsEnd = html.indexOf('// 5. DMC STUDENT DATABASE & STEEL LOCKER');
console.log('savings JS start:', savingsJsStart, 'end:', savingsJsEnd);
