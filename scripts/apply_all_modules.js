// scripts/apply_all_modules.js
// Assembles all 16 new modules into index.html and synchronizes across all 4 files

const fs = require('fs');
const path = require('path');

const { getNavHtml } = require('./nav_templates');
const { getDataJs } = require('./data_templates');
const { getSectionsHtml } = require('./sections_templates');
const { getModalsHtml } = require('./modals_templates');
const { getLogicJs } = require('./logic_templates');

const targetFiles = [
  'index.html',
  'public/index.html',
  'เปิดระบบทันที_Double_Click.html',
  'google-apps-script/Index.html'
];

function applyModules() {
  console.log('Reading index.html base file...');
  let content = fs.readFileSync('index.html', 'utf8');

  // 1. UPDATE NAVIGATION
  console.log('1. Updating Sidebar Navigation...');
  const navStartMarker = '<nav class="space-y-1">';
  const navEndMarker = '</nav>';
  const navStartIdx = content.indexOf(navStartMarker);
  const navEndIdx = content.indexOf(navEndMarker, navStartIdx);

  if (navStartIdx !== -1 && navEndIdx !== -1) {
    const updatedNav = getNavHtml().trim();
    content = content.substring(0, navStartIdx) + updatedNav + content.substring(navEndIdx + navEndMarker.length);
    console.log('   Navigation updated successfully.');
  } else {
    console.warn('   Could not find nav markers!');
  }

  // 2. INSERT HTML SECTIONS
  console.log('2. Inserting HTML Sections for 16 new modules...');
  const usersTabEndMarker = '</section>';
  const usersTabIdx = content.indexOf('id="tab-users"');
  if (usersTabIdx !== -1) {
    const usersTabEndIdx = content.indexOf(usersTabEndMarker, usersTabIdx);
    if (usersTabEndIdx !== -1) {
      const insertIdx = usersTabEndIdx + usersTabEndMarker.length;
      const sectionsHtml = getSectionsHtml();
      content = content.substring(0, insertIdx) + '\n' + sectionsHtml + '\n' + content.substring(insertIdx);
      console.log('   HTML Sections inserted successfully.');
    }
  } else {
    console.warn('   Could not find tab-users section!');
  }

  // 3. INSERT MODALS
  console.log('3. Inserting Modals for 16 new modules...');
  const printableAreaMarker = '<!-- PRINTABLE AREA (FOR PDF) -->';
  const printAreaIdx = content.indexOf(printableAreaMarker);
  if (printAreaIdx !== -1) {
    const modalsHtml = getModalsHtml();
    content = content.substring(0, printAreaIdx) + modalsHtml + '\n\n  ' + content.substring(printAreaIdx);
    console.log('   Modals inserted successfully.');
  } else {
    console.warn('   Could not find printableAreaMarker!');
  }

  // 4. INSERT JAVASCRIPT STATE & LOGIC
  console.log('4. Inserting JS State & Logic for 16 new modules...');
  const scriptTagMarker = '<script>';
  const mainScriptIdx = content.indexOf(scriptTagMarker, content.indexOf('<!-- FRONTEND SCRIPT (GAS CLIENT) -->'));
  if (mainScriptIdx !== -1) {
    const insertIdx = mainScriptIdx + scriptTagMarker.length;
    const combinedJs = '\n' + getDataJs() + '\n' + getLogicJs() + '\n';
    content = content.substring(0, insertIdx) + combinedJs + content.substring(insertIdx);
    console.log('   JS State & Logic inserted successfully.');
  } else {
    console.warn('   Could not find main script tag!');
  }

  // 5. UPDATE switchTab() TO CALL RENDERERS
  console.log('5. Updating switchTab function with renderer triggers...');
  const switchTabTarget = "if (tabId === 'tab-dashboard' || tabId === 'tab-grades') loadGrades();";
  const switchTabReplacement = `if (tabId === 'tab-dashboard' || tabId === 'tab-grades') loadGrades();
      // Extended tab renderers
      if (tabId === 'tab-pp5') renderPp5Table();
      else if (tabId === 'tab-remedial') renderRemedialTable();
      else if (tabId === 'tab-exam-schedule') renderExamScheduleTable();
      else if (tabId === 'tab-research') renderResearchCards();
      else if (tabId === 'tab-downloads') renderDownloadsGrid();
      else if (tabId === 'tab-academic-calendar') renderAcademicCalendarList();
      else if (tabId === 'tab-attendance-daily') renderDailyAttendanceTable();
      else if (tabId === 'tab-homevisit') renderHomeVisitsGrid();
      else if (tabId === 'tab-behavior') renderBehaviorTable();
      else if (tabId === 'tab-bmi') renderBmiTable();
      else if (tabId === 'tab-savings') renderSavingsTable();
      else if (tabId === 'tab-clubs') renderClubsGrid();
      else if (tabId === 'tab-scouts') renderScoutsGrid();
      else if (tabId === 'tab-dmc-students') renderDmcStudentsTable();
      else if (tabId === 'tab-iep') renderIepTable();
      else if (tabId === 'tab-transfers') renderTransfersTable();`;

  if (content.includes(switchTabTarget)) {
    content = content.replace(switchTabTarget, switchTabReplacement);
    console.log('   switchTab updated with all 16 module renderers.');
  }

  // 6. UPDATE DOMContentLoaded / init() TO INITIALIZE EXTENDED TAB RENDERERS
  console.log('6. Adding initExtendedTabRenderers to window onload / ready...');
  const initTarget = 'lucide.createIcons();';
  // Replace the first occurrence inside init/ready or add to window.addEventListener('DOMContentLoaded'
  const initCall = '\n      if (typeof initExtendedTabRenderers === "function") initExtendedTabRenderers();\n';
  const loadTarget = "window.addEventListener('DOMContentLoaded', () => {";
  if (content.includes(loadTarget)) {
    content = content.replace(loadTarget, loadTarget + initCall);
    console.log('   initExtendedTabRenderers hooked into DOMContentLoaded.');
  }

  // 7. WRITE TO ALL 4 FILES
  console.log('7. Synchronizing updated system across all 4 files...');
  targetFiles.forEach(file => {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`   ✓ Successfully updated ${file} (${content.length.toLocaleString()} bytes)`);
  });

  console.log('\n🎉 ALL 16 NEW MODULES HAVE BEEN SUCCESSFULLY APPLIED & SYNCHRONIZED!');
}

applyModules();
