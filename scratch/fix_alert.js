const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const badAlert = `alert('❌ ตรวจพบความขัดแย้งในตารางสอบ!\n- ห้องสอบ ครูคุมสอบ หรือชั้นเรียนนี้มีตารางสอบซ้อนทับอยู่ในช่วงเวลาเดียวกัน');`;
const goodAlert = `alert('❌ ตรวจพบความขัดแย้งในตารางสอบ!\\n- ห้องสอบ ครูคุมสอบ หรือชั้นเรียนนี้มีตารางสอบซ้อนทับอยู่ในช่วงเวลาเดียวกัน');`;

if (content.includes(badAlert)) {
  content = content.replace(badAlert, goodAlert);
  fs.writeFileSync('index.html', content, 'utf8');
  console.log('Fixed alert newline syntax error in index.html');
} else {
  // Replace via regex
  content = content.replace(/alert\('❌ ตรวจพบความขัดแย้งในตารางสอบ!\r?\n- ห้องสอบ/g, "alert('❌ ตรวจพบความขัดแย้งในตารางสอบ!\\n- ห้องสอบ");
  fs.writeFileSync('index.html', content, 'utf8');
  console.log('Fixed alert newline via regex in index.html');
}
