const fs = require('fs');
const vm = require('vm');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add guard to initExtendedState
html = html.replace(
  'function initExtendedState() {',
  'let _inInitExtendedState = false;\n    function initExtendedState() {\n      if (_inInitExtendedState) return;\n      _inInitExtendedState = true;\n      try {'
);

html = html.replace(
  `      if (!state.ext.lineConfig || !state.ext.lineConfig.token || state.ext.lineConfig.token === 'LINE_NOTIFY_DEMO_TOKEN_FM_STUDIO') {
        state.ext.lineConfig = {
          token: '9byuGbRAT8DnHw/T9+z9uZ3c9k/YLMAhpu8tQRkVgZ2EhIMir6qXDJCB94fHjC7Vj/05jRIaWafSLVhyYyKnoiBBOtu+BG2VSLRdidZ+bX09yY07xihqLpAU6MvBSivn8GTPxfxeFRSkwxHECt19MQdB04t89/1O/w1cDnyilFU=',
          webhookUrl: 'https://api.line.me/v2/bot/message/broadcast',
          channelName: 'งานวิชาการโรงเรียน',
          status: 'connected',
          lastSent: ''
        };
        saveExtendedState();
      }
    }`,
  `      if (!state.ext.lineConfig || !state.ext.lineConfig.token || state.ext.lineConfig.token === 'LINE_NOTIFY_DEMO_TOKEN_FM_STUDIO') {
        state.ext.lineConfig = {
          token: '9byuGbRAT8DnHw/T9+z9uZ3c9k/YLMAhpu8tQRkVgZ2EhIMir6qXDJCB94fHjC7Vj/05jRIaWafSLVhyYyKnoiBBOtu+BG2VSLRdidZ+bX09yY07xihqLpAU6MvBSivn8GTPxfxeFRSkwxHECt19MQdB04t89/1O/w1cDnyilFU=',
          webhookUrl: 'https://api.line.me/v2/bot/message/broadcast',
          channelName: 'งานวิชาการโรงเรียน',
          status: 'connected',
          lastSent: ''
        };
        saveExtendedState();
      }
      } finally {
        _inInitExtendedState = false;
      }
    }`
);

// 2. In initDongsawanData, remove circular calls
html = html.replace(
  `      // Populate dailyAttendance and savingsRecords for all students
      if (typeof ensureAttendanceRecordsForClassAndDate === 'function') {
        const defaultAttClass = state.ext?.dailyAttendance?.currentClass || 'ป.6/1';
        ensureAttendanceRecordsForClassAndDate('2026-10-10', defaultAttClass);
      }
      if (typeof ensureSavingsRecordsLoaded === 'function') {
        ensureSavingsRecordsLoaded();
      }`,
  `      // Ensure dailyAttendance structures ready
      if (!state.ext.dailyAttendance) {
        state.ext.dailyAttendance = { currentDate: '2026-10-10', currentClass: 'ป.6/1', records: [], byDateAndClass: {} };
      }
      if (!state.ext.dailyAttendance.byDateAndClass) {
        state.ext.dailyAttendance.byDateAndClass = {};
      }`
);

// 3. In helper functions, check if (!state.ext) initExtendedState()
html = html.replace(
  'function ensureAttendanceRecordsForClassAndDate(date, cls) {\n      initExtendedState();',
  'function ensureAttendanceRecordsForClassAndDate(date, cls) {\n      if (!state.ext) initExtendedState();'
);

html = html.replace(
  'function ensureBmiRecordsLoaded() {\n      initExtendedState();',
  'function ensureBmiRecordsLoaded() {\n      if (!state.ext) initExtendedState();'
);

html = html.replace(
  'function ensureSavingsRecordsLoaded() {\n      initExtendedState();',
  'function ensureSavingsRecordsLoaded() {\n      if (!state.ext) initExtendedState();'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Applied recursion fix to index.html successfully!');
