const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Test extracting DONGSAWAN_346_STUDENTS_TUPLES
let pos = content.indexOf('DONGSAWAN_346_STUDENTS_TUPLES = [');
let endPos = content.indexOf('];', pos);
let tuples = eval('(' + content.substring(pos + 'DONGSAWAN_346_STUDENTS_TUPLES = '.length, endPos + 1) + ')');

console.log('Testing student users generation from', tuples.length, 'tuples');

const studentUsers = tuples.map(t => {
  const [stuId, citId, title, fname, lname, gender, room, num] = t;
  const shortTitle = title === 'เด็กชาย' ? 'ด.ช.' : (title === 'เด็กหญิง' ? 'ด.ญ.' : title);
  let classFullText = room;
  if (room.startsWith('ม.')) classFullText = 'ชั้นมัธยมศึกษาปีที่ ' + room.replace('ม.', '');
  else if (room.startsWith('ป.')) classFullText = 'ชั้นประถมศึกษาปีที่ ' + room.replace('ป.', '');
  else if (room.startsWith('อ.')) classFullText = 'ชั้นอนุบาล ' + room.replace('อ.', '');

  return {
    id: 'STU_' + stuId,
    username: String(stuId),
    password: String(stuId),
    name: `${shortTitle}${fname} ${lname}`,
    role: 'student',
    position: `นักเรียนชั้น ${room} เลขที่ ${num}`,
    dept: classFullText,
    phone: '',
    studentId: String(stuId),
    citizenId: String(citId),
    avatarIcon: 'user-check',
    status: 'active'
  };
});

console.log('Generated student users count:', studentUsers.length);
console.log('Sample 0:', studentUsers[0]);
console.log('Sample middle ( ม.3/1 ):', studentUsers.find(u => u.position.includes('ม.3/1')));
console.log('Sample last:', studentUsers[studentUsers.length - 1]);

// Check all usernames are 4-digit
const all4Digits = studentUsers.every(u => /^\d{4}$/.test(u.username) && u.password === u.username);
console.log('All usernames and passwords are valid 4 digits:', all4Digits);

// Check uniqueness
const uniqueUsernames = new Set(studentUsers.map(u => u.username));
console.log('Unique usernames count:', uniqueUsernames.size);
