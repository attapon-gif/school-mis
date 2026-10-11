const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove #globalLoading HTML overlay completely
const globalLoadingRegex = /<!-- =+ -->\s*<!-- GLOBAL LOADING & ANTI-DOUBLE CLICK OVERLAY.*?-->\s*<div id="globalLoading"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

if (globalLoadingRegex.test(html)) {
  html = html.replace(globalLoadingRegex, '');
  console.log('1. Removed #globalLoading HTML overlay completely');
} else {
  // Fallback: match just the div id="globalLoading"
  const divRegex = /<div id="globalLoading"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  if (divRegex.test(html)) {
    html = html.replace(divRegex, '');
    console.log('1. Removed #globalLoading via fallback regex');
  } else {
    console.error('1. Could not find #globalLoading in HTML');
  }
}

// 2. Make showLoading a harmless no-op and lockButton a no-op so everything runs ultra fast without delay
const showLoadingBlockRegex = /\/\/ Global state to prevent duplicate parallel operations[\s\S]*?function showLoading\([\s\S]*?\}\s*\}\s*\}/;

const fastNoOpFunctions = `// Ultra-fast instant UI mode (Loading overlay removed for maximum speed)
    let isGlobalProcessing = false;
    function lockButton(btn, loadingText) { return () => {}; }
    function showLoading(show, text) { /* no-op for instant snappy response */ }`;

if (showLoadingBlockRegex.test(html)) {
  html = html.replace(showLoadingBlockRegex, fastNoOpFunctions);
  console.log('2. Replaced showLoading with fast no-op functions');
} else {
  console.error('2. showLoadingBlockRegex NOT MATCHED!');
}

// 3. Remove isMutatingAction and showLoading from callBackend
const callBackendStartRegex = /function callBackend\(action,\s*payload\s*=\s*\{\}\)\s*\{[\s\S]*?return new Promise\(\(resolve,\s*reject\)\s*=>\s*\{/;

const cleanCallBackend = `function callBackend(action, payload = {}) {
      return new Promise((resolve, reject) => {`;

if (callBackendStartRegex.test(html)) {
  html = html.replace(callBackendStartRegex, cleanCallBackend);
  console.log('3. Cleaned callBackend (no loading delay)');
} else {
  console.error('3. callBackendStartRegex NOT MATCHED!');
}

// 4. Remove setTimeout delays from handleSavePp5Score
const pp5DelayRegex = /setTimeout\(\(\)\s*=>\s*\{\s*unlock\(\);\s*showLoading\(false\);\s*closeModal\('modalAddPp5Score'\);\s*renderPp5Table\(\);\s*showToast\('บันทึกคะแนนและตัดเกรด ปพ\.5 สำเร็จ'\);\s*\},\s*200\);/;

const cleanPp5Save = `closeModal('modalAddPp5Score');
      renderPp5Table();
      showToast('บันทึกคะแนนและตัดเกรด ปพ.5 สำเร็จ');`;

if (pp5DelayRegex.test(html)) {
  html = html.replace(pp5DelayRegex, cleanPp5Save);
  console.log('4. Removed delay from handleSavePp5Score');
} else {
  console.error('4. pp5DelayRegex NOT MATCHED!');
}

// 5. Remove setTimeout delays from toggleApproveResearch
const approveDelayRegex = /showLoading\(true,[\s\S]*?setTimeout\(\(\)\s*=>\s*\{\s*const r = state\.ext\.researchItems\.find[\s\S]*?renderResearchCards\(\);\s*\}\s*showLoading\(false\);\s*\}, 200\);/;

const cleanApprove = `const r = state.ext.researchItems.find(x => x.id === resId);
      if (r) {
        r.status = targetStatus;
        if (targetStatus === 'approved') {
          const approver = state.schoolInfo?.directorName || 'นายอรรถพล ฉาไธสง (ผอ.)';
          r.approvedBy = approver;
          r.approvedDate = new Date().toISOString().split('T')[0];
          showToast('อนุมัติงานวิจัยในชั้นเรียนเรียบร้อยแล้ว');
        } else if (targetStatus === 'rejected') {
          r.approvedBy = '-';
          showToast('ส่งกลับงานวิจัยเพื่อให้ครูผู้สอนปรับปรุงแก้ไข');
        } else {
          r.approvedBy = '-';
          showToast('ปรับสถานะเป็น "รอการตรวจ"');
        }
        saveExtendedState();
        renderResearchCards();
      }`;

if (approveDelayRegex.test(html)) {
  html = html.replace(approveDelayRegex, cleanApprove);
  console.log('5. Removed delay from toggleApproveResearch');
} else {
  console.error('5. approveDelayRegex NOT MATCHED!');
}

// 6. Remove setTimeout delays from deleteResearchItem
const deleteDelayRegex = /showLoading\(true, 'กำลังลบงานวิจัยในชั้นเรียน\.\.\.', 'กำลังนำรายการออกจากระบบ'\);\s*setTimeout\(\(\)\s*=>\s*\{\s*state\.ext\.researchItems = state\.ext\.researchItems\.filter\(x => x\.id !== resId\);\s*saveExtendedState\(\);\s*renderResearchCards\(\);\s*showLoading\(false\);\s*showToast\('ลบงานวิจัยเรียบร้อยแล้ว'\);\s*\}, 200\);/;

const cleanDelete = `state.ext.researchItems = state.ext.researchItems.filter(x => x.id !== resId);
      saveExtendedState();
      renderResearchCards();
      showToast('ลบงานวิจัยเรียบร้อยแล้ว');`;

if (deleteDelayRegex.test(html)) {
  html = html.replace(deleteDelayRegex, cleanDelete);
  console.log('6. Removed delay from deleteResearchItem');
} else {
  console.error('6. deleteDelayRegex NOT MATCHED!');
}

// 7. Clean up handleSaveResearch to run instantly
const handleSaveResStartPattern = /const submitBtn = e\.target\.querySelector\('button\[type="submit"\]'\);\s*const unlockBtn = lockButton\(submitBtn, 'กำลังบันทึกและส่ง Drive\.\.\.'\);\s*showLoading\(true, 'กำลังบันทึกงานวิจัยในชั้นเรียน\.\.\.', 'กำลังเตรียมข้อมูลและจัดเก็บไฟล์ขึ้น Google Drive'\);/;

if (handleSaveResStartPattern.test(html)) {
  html = html.replace(handleSaveResStartPattern, '');
  console.log('7. Cleaned handleSaveResearch start');
} else {
  console.error('7. handleSaveResStartPattern NOT MATCHED!');
}

const handleSaveResEndPattern = /unlockBtn\(\);\s*showLoading\(false\);/;
if (handleSaveResEndPattern.test(html)) {
  html = html.replace(handleSaveResEndPattern, '');
  console.log('8. Cleaned handleSaveResearch end');
} else {
  console.error('8. handleSaveResEndPattern NOT MATCHED!');
}

// Also remove unlockBtn() and showLoading(false) from handleSaveAttachDrive
const attachDriveCleanPattern = /const submitBtn = e\.target\.querySelector\('button\[type="submit"\]'\);\s*const unlockBtn = lockButton\(submitBtn, 'กำลังเชื่อมต่อ Drive\.\.\.'\);\s*showLoading\(true, 'กำลังเชื่อมโยงไฟล์ Google Drive\.\.\.', 'กำลังตรวจสอบไฟล์และสิทธิ์การเข้าถึง'\);/;
if (attachDriveCleanPattern.test(html)) {
  html = html.replace(attachDriveCleanPattern, '');
  console.log('9. Cleaned handleSaveAttachDrive start');
}

const attachDriveEndCleanPattern = /unlockBtn\(\);\s*showLoading\(false\);/;
if (attachDriveEndCleanPattern.test(html)) {
  html = html.replace(attachDriveEndCleanPattern, '');
  console.log('10. Cleaned handleSaveAttachDrive end');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done stripping loading overlay!');
