const fs = require('fs');
const vm = require('vm');

const content = fs.readFileSync('index.html', 'utf8');

// 1. Extract and syntax-check scripts
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIdx = 0;
while ((match = scriptRegex.exec(content)) !== null) {
  const code = match[1];
  if (!code.trim()) continue;
  try {
    new vm.Script(code);
    console.log(`Script tag #${++scriptIdx} parsed without syntax errors (length: ${code.length})`);
  } catch (err) {
    console.error(`Syntax error in script tag #${scriptIdx + 1}:`, err);
    process.exit(1);
  }
}

// 2. Evaluate DEFAULT_SYSTEM_USERS in sandbox
const sandbox = {};
vm.createContext(sandbox);

const tuplesCode = content.match(/const DONGSAWAN_346_STUDENTS_TUPLES\s*=\s*\[[\s\S]*?\];/)[0].replace('const DONGSAWAN_346_STUDENTS_TUPLES', 'this.DONGSAWAN_346_STUDENTS_TUPLES');
const usersCode = content.match(/const DONGSAWAN_STUDENT_USERS\s*=\s*[\s\S]*?const DEFAULT_SYSTEM_USERS\s*=\s*\[[\s\S]*?\];/)[0]
  .replace('const DONGSAWAN_STUDENT_USERS', 'this.DONGSAWAN_STUDENT_USERS')
  .replace('const DEFAULT_STAFF_USERS', 'this.DEFAULT_STAFF_USERS')
  .replace('const DEFAULT_SYSTEM_USERS', 'this.DEFAULT_SYSTEM_USERS');

vm.runInContext(tuplesCode + '\n' + usersCode, sandbox);

console.log('--- DEFAULT_SYSTEM_USERS verification ---');
console.log('Total DEFAULT_SYSTEM_USERS:', sandbox.DEFAULT_SYSTEM_USERS.length);

const staffCount = sandbox.DEFAULT_STAFF_USERS.length;
const studentCount = sandbox.DONGSAWAN_STUDENT_USERS.length;
console.log(`Breakdown: ${staffCount} staff accounts + ${studentCount} student accounts = ${sandbox.DEFAULT_SYSTEM_USERS.length}`);

// Check student accounts
const invalidStudents = sandbox.DONGSAWAN_STUDENT_USERS.filter(u => {
  return !/^\d{4}$/.test(u.username) || u.username !== u.password || u.role !== 'student' || !u.name || !u.studentId;
});

if (invalidStudents.length > 0) {
  console.error('Found invalid student accounts:', invalidStudents);
  process.exit(1);
}
console.log('ALL 346 students have valid 4-digit username and matching 4-digit password: YES!');

// Check sample students from different levels
const sampleU2 = sandbox.DONGSAWAN_STUDENT_USERS.find(u => u.position.includes('อ.2/1'));
const sampleP1 = sandbox.DONGSAWAN_STUDENT_USERS.find(u => u.position.includes('ป.1/1'));
const sampleP6 = sandbox.DONGSAWAN_STUDENT_USERS.find(u => u.position.includes('ป.6/1'));
const sampleM3 = sandbox.DONGSAWAN_STUDENT_USERS.find(u => u.position.includes('ม.3/1'));

console.log('Sample อ.2/1:', sampleU2);
console.log('Sample ป.1/1:', sampleP1);
console.log('Sample ป.6/1:', sampleP6);
console.log('Sample ม.3/1:', sampleM3);
console.log('\nAll checks PASSED with flying colors!');
