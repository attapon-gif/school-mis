function calculateDuration(start, end) {
  if (!start || !end) return '';
  const [h1, m1] = start.split(':').map(Number);
  const [h2, m2] = end.split(':').map(Number);
  let totalMin = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (totalMin <= 0) return 'เวลาไม่ถูกต้อง';
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  let res = '⏱️ ';
  if (hours > 0) res += `${hours} ชม. `;
  if (mins > 0) res += `${mins} นาที`;
  return res.trim();
}

function checkOverlap(s1, e1, s2, e2) {
  return (s1 < e2 && e1 > s2);
}

console.log('08:30 to 10:00 duration:', calculateDuration('08:30', '10:00'));
console.log('08:30 to 09:15 duration:', calculateDuration('08:30', '09:15'));
console.log('13:00 to 15:45 duration:', calculateDuration('13:00', '15:45'));

console.log('Overlap 08:30-10:00 with 09:30-11:00:', checkOverlap('08:30', '10:00', '09:30', '11:00')); // true
console.log('Overlap 08:30-10:00 with 10:00-11:30:', checkOverlap('08:30', '10:00', '10:00', '11:30')); // false
console.log('Overlap 08:30-10:00 with 10:15-11:45:', checkOverlap('08:30', '10:00', '10:15', '11:45')); // false
