const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');

// Mock browser environment
const dom = {
  getElementById: (id) => ({
    value: id === 'attendanceClassSelect' ? 'ป.6/1' : (id === 'attendanceDateInput' ? '2026-10-10' : ''),
    textContent: '',
    innerHTML: '',
    classList: { add: () => {}, remove: () => {} },
    addEventListener: () => {}
  }),
  addEventListener: () => {}
};

const sandbox = {
  window: { addEventListener: () => {} },
  document: dom,
  console: console,
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  },
  tailwind: { config: {} },
  state: {
    currentUser: { id: 'admin', role: 'admin' },
    students: [],
    ext: {}
  }
};

const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
scripts.forEach(s => {
  vm.runInNewContext(s[1], sandbox);
});

console.log('Testing ensureAttendanceRecordsForClassAndDate with ป.6/1:');
const p61Recs = sandbox.ensureAttendanceRecordsForClassAndDate('2026-10-10', 'ป.6/1');
console.log('ป.6/1 student count:', p61Recs.length);
console.log('First student in ป.6/1:', p61Recs[0]);
console.log('Last student in ป.6/1:', p61Recs[p61Recs.length - 1]);

console.log('\nTesting ensureAttendanceRecordsForClassAndDate with ม.3/1:');
const m31Recs = sandbox.ensureAttendanceRecordsForClassAndDate('2026-10-10', 'ม.3/1');
console.log('ม.3/1 student count:', m31Recs.length);
console.log('First student in ม.3/1:', m31Recs[0]);

console.log('\nTesting ensureAttendanceRecordsForClassAndDate with อ.2/1:');
const k21Recs = sandbox.ensureAttendanceRecordsForClassAndDate('2026-10-10', 'อ.2/1');
console.log('อ.2/1 student count:', k21Recs.length);
console.log('First student in อ.2/1:', k21Recs[0]);

console.log('\nTesting ensureSavingsRecordsLoaded:');
sandbox.ensureSavingsRecordsLoaded();
console.log('Total savings records:', sandbox.state.ext.savingsRecords.length);
