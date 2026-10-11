const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update #globalLoading HTML to include a clean emergency dismiss button
const oldGlobalLoadingHtml = /<div id="globalLoading"[\s\S]*?<!-- PRINTABLE AREA \(FOR PDF\) -->/;

const newGlobalLoadingHtml = `<div id="globalLoading" class="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[99999] hidden flex flex-col items-center justify-center p-4 transition-all duration-300">
    <div class="card-3d bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <!-- Animated Spinner with Multi-layer Glow -->
      <div class="relative w-20 h-20 flex items-center justify-center">
        <!-- Outer Glowing Ring -->
        <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 opacity-25 blur-lg animate-pulse"></div>
        <!-- Spinning Ring -->
        <div class="w-16 h-16 rounded-full border-4 border-slate-200/80 border-t-blue-600 border-r-indigo-500 animate-spin"></div>
        <!-- Inner Center Pulse Icon -->
        <div class="absolute inset-0 flex items-center justify-center">
          <svg class="w-7 h-7 text-blue-600 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>
      </div>

      <!-- Text Messages -->
      <div class="space-y-1.5 w-full">
        <h4 id="globalLoadingText" class="text-base font-black text-slate-900 tracking-tight leading-snug">กำลังประมวลผลข้อมูล...</h4>
        <p id="globalLoadingSubtext" class="text-xs text-slate-500 font-medium">กรุณารอสักครู่ ระบบกำลังสื่อสารกับคลาวด์และบันทึกข้อมูล</p>
      </div>

      <!-- Anti-Double Click Protection Badge -->
      <div class="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200/80 rounded-xl text-[11px] font-bold text-blue-800">
        <span class="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
        <span>ระบบกำลังทำงาน (ล็อคการคลิกซ้ำ)</span>
      </div>

      <!-- Emergency Dismiss Button -->
      <div class="pt-1">
        <button type="button" onclick="showLoading(false)" class="text-[11px] text-slate-400 hover:text-slate-700 underline transition cursor-pointer">
          ✕ ปิดหน้าต่างนี้หากรอนานเกินไป
        </button>
      </div>
    </div>
  </div>

  <!-- PRINTABLE AREA (FOR PDF) -->`;

if (oldGlobalLoadingHtml.test(html)) {
  html = html.replace(oldGlobalLoadingHtml, newGlobalLoadingHtml);
  console.log('1. Added emergency dismiss button to #globalLoading');
} else {
  console.error('1. oldGlobalLoadingHtml NOT MATCHED!');
}

// 2. Update showLoading to add auto-timeout safeguard (max 8 seconds)
const showLoadingFuncPattern = /function showLoading\(show,\s*text\s*=\s*'[^']*',\s*subtext\s*=\s*'[^']*'\)\s*\{[\s\S]*?document\.body\.style\.overflow = '';\s*\}\s*\}\s*\}/;

const newShowLoadingFunc = `let globalLoadingTimeoutId = null;

    function showLoading(show, text = 'กำลังประมวลผลข้อมูล...', subtext = 'กรุณารอสักครู่ ระบบกำลังสื่อสารกับคลาวด์และบันทึกข้อมูล') {
      isGlobalProcessing = !!show;
      const el = document.getElementById('globalLoading');
      const textEl = document.getElementById('globalLoadingText');
      const subEl = document.getElementById('globalLoadingSubtext');

      if (globalLoadingTimeoutId) {
        clearTimeout(globalLoadingTimeoutId);
        globalLoadingTimeoutId = null;
      }

      if (el) {
        if (show) {
          if (textEl) textEl.textContent = text;
          if (subEl) subEl.textContent = subtext;
          el.classList.remove('hidden');
          document.body.style.overflow = 'hidden';

          // Safeguard: Automatically dismiss after 8 seconds so user is NEVER trapped
          globalLoadingTimeoutId = setTimeout(() => {
            el.classList.add('hidden');
            document.body.style.overflow = '';
            isGlobalProcessing = false;
          }, 8000);
        } else {
          el.classList.add('hidden');
          document.body.style.overflow = '';
          isGlobalProcessing = false;
        }
      }
    }`;

if (showLoadingFuncPattern.test(html)) {
  html = html.replace(showLoadingFuncPattern, newShowLoadingFunc);
  console.log('2. showLoading auto-timeout safeguard added');
} else {
  console.error('2. showLoadingFuncPattern NOT MATCHED!');
}

// 3. Update callBackend: DO NOT show full-screen blocking overlay on background read actions (getInfo, getGrades, getPlans, etc.)
// And add 6-second AbortController timeout to fetch(gasUrl)
const callBackendFuncPattern = /function callBackend\(action,\s*payload\s*=\s*\{\}\)\s*\{[\s\S]*?return new Promise\(\(resolve,\s*reject\)\s*=>\s*\{[\s\S]*?\/\/ Mode 1: Running natively inside Google Apps Script iframe/;

const newCallBackendFunc = `function callBackend(action, payload = {}) {
      // Determine if this is a heavy mutating action (Upload, Save, Delete, Import)
      // Read-only actions (getInfo, getGrades, getPlans, etc.) DO NOT block the screen on page load!
      const isMutatingAction = ['uploadFile', 'saveGrade', 'saveGradeRecord', 'savePlan', 'reviewPlan', 
                                'saveSupervision', 'evaluateSupervision', 'saveTimetable', 'deleteTimetable', 
                                'saveSubstitute', 'importStudents', 'updateInfo', 'saveResearch', 'deleteResearch'].includes(action);

      if (isMutatingAction) {
        let loadingMsg = 'กำลังประมวลผลข้อมูล...';
        let loadingSub = 'กรุณารอสักครู่ ระบบกำลังสื่อสารกับคลาวด์';
        if (action === 'uploadFile') {
          loadingMsg = 'กำลังอัปโหลดไฟล์ขึ้น Google Drive...';
          loadingSub = 'กำลังจัดเก็บไฟล์ในโฟลเดอร์ของโรงเรียนบน Google Drive';
        } else if (action.includes('Grade')) {
          loadingMsg = 'กำลังบันทึกและคำนวณเกรด...';
        } else if (action.includes('Plan')) {
          loadingMsg = 'กำลังบันทึกข้อมูลแผนการจัดการเรียนรู้...';
        } else if (action.includes('Supervision')) {
          loadingMsg = 'กำลังบันทึกผลการนิเทศการสอน...';
        } else if (action.includes('Timetable')) {
          loadingMsg = 'กำลังตรวจสอบและบันทึกตารางสอน...';
        } else if (action === 'importStudents') {
          loadingMsg = 'กำลังนำเข้ารายชื่อนักเรียน...';
          loadingSub = 'กำลังตรวจสอบรหัสประจำตัวและจัดเก็บข้อมูล';
        }
        showLoading(true, loadingMsg, loadingSub);
      }

      return new Promise((resolve, reject) => {
        // Mode 1: Running natively inside Google Apps Script iframe`;

if (callBackendFuncPattern.test(html)) {
  html = html.replace(callBackendFuncPattern, newCallBackendFunc);
  console.log('3. callBackend read/write distinction added (read actions no longer block screen!)');
} else {
  console.error('3. callBackendFuncPattern NOT MATCHED!');
}

// 4. Add AbortController / Timeout to Mode 2 fetch(gasUrl) so slow network doesn't hang
const fetchGasPattern = /const gasUrl = \(typeof getGasWebAppUrl === 'function'\) \? getGasWebAppUrl\(\) : '';\s*if \(gasUrl && gasUrl\.startsWith\('https:\/\/script\.google\.com'\)\) \{\s*fetch\(gasUrl,\s*\{[\s\S]*?body: JSON\.stringify\(\{ action, payload \}\)\s*\}\)/;

const newFetchGas = `const gasUrl = (typeof getGasWebAppUrl === 'function') ? getGasWebAppUrl() : '';
        if (gasUrl && gasUrl.startsWith('https://script.google.com')) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6500); // 6.5s timeout for network resilience

          fetch(gasUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action, payload }),
            signal: controller.signal
          })
          .then(r => {
            clearTimeout(timeoutId);
            return r.json();
          })`;

if (fetchGasPattern.test(html)) {
  html = html.replace(fetchGasPattern, newFetchGas);
  console.log('4. Added 6.5s network timeout to Google Apps Script fetch');
} else {
  console.error('4. fetchGasPattern NOT MATCHED!');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done optimizing callBackend and loading overlay!');
