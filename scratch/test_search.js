const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const match = content.match(/DONGSAWAN_346_STUDENTS_TUPLES\s*=\s*\[([\s\S]*?)\];/);
const tuples = JSON.parse('[' + match[1] + ']');
const students = tuples.map(t => {
  const [stuId, citId, title, fname, lname, gender, room, num] = t;
  const shortTitle = title === 'เด็กชาย' ? 'ด.ช.' : (title === 'เด็กหญิง' ? 'ด.ญ.' : title);
  return {
    studentId: stuId,
    name: shortTitle + fname + ' ' + lname,
    classroom: room
  };
});

function search(q) {
  q = q.trim().toLowerCase();
  return students.filter(s => {
    return s.studentId.includes(q) || s.name.toLowerCase().includes(q) || s.classroom.toLowerCase().includes(q);
  });
}

console.log('Search "จันทร์":', search('จันทร์').length, 'matches:', search('จันทร์').map(s => s.name));
console.log('Search "6588":', search('6588').length, 'matches:', search('6588').map(s => s.name));
console.log('Search "ม.1/1":', search('ม.1/1').length, 'students in class');
