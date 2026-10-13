const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Target 1: remStudentSelect (ยื่นคำร้องขอแก้ผลการเรียน 0, ร, มส)
const oldRem = `        <div>
          <label class="block font-bold text-slate-700 mb-1">นักเรียนที่ติด 0, ร, มส *</label>
          <select id="remStudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white"></select>
        </div>`;

const newRem = `        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block font-bold text-slate-700">นักเรียนที่ติด 0, ร, มส *</label>
            <span id="remStudentSelect_count" class="text-[10px] text-slate-400 font-bold">346 คนทั้งหมด</span>
          </div>
          <div class="relative mb-1.5">
            <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400"></i>
            <input type="text" id="remStudentSelect_search" oninput="filterStudentSelect('remStudentSelect', this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();document.getElementById('remStudentSelect').focus();}" placeholder="🔍 ค้นหาชื่อ-สกุล, รหัส 4 หลัก หรือพิมพ์ชั้น เช่น ม.1/1..." class="w-full pl-8 pr-8 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-normal shadow-2xs">
            <button type="button" onclick="document.getElementById('remStudentSelect_search').value=''; filterStudentSelect('remStudentSelect','');" class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs" title="ล้างคำค้น">✕</button>
          </div>
          <select id="remStudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-xs"></select>
        </div>`;

if (!html.includes(oldRem)) {
  console.error('ERROR: oldRem not found!');
  process.exit(1);
}
html = html.replace(oldRem, newRem);
console.log('Step 1: remStudentSelect updated with live search.');

// 2. Target 2: savStudentSelect (บันทึกการออมเงิน ฝาก-ถอน)
const oldSav = `        <div>
          <label class="block font-bold text-slate-700 mb-1">นักเรียน *</label>
          <select id="savStudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white"></select>
        </div>`;

const newSav = `        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block font-bold text-slate-700">นักเรียน *</label>
            <span id="savStudentSelect_count" class="text-[10px] text-slate-400 font-bold">346 คนทั้งหมด</span>
          </div>
          <div class="relative mb-1.5">
            <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400"></i>
            <input type="text" id="savStudentSelect_search" oninput="filterStudentSelect('savStudentSelect', this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();document.getElementById('savStudentSelect').focus();}" placeholder="🔍 ค้นหาชื่อ-สกุล, รหัส 4 หลัก หรือพิมพ์ชั้น เช่น ป.2/1..." class="w-full pl-8 pr-8 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-normal shadow-2xs">
            <button type="button" onclick="document.getElementById('savStudentSelect_search').value=''; filterStudentSelect('savStudentSelect','');" class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs" title="ล้างคำค้น">✕</button>
          </div>
          <select id="savStudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-xs"></select>
        </div>`;

if (!html.includes(oldSav)) {
  console.error('ERROR: oldSav not found!');
  process.exit(1);
}
html = html.replace(oldSav, newSav);
console.log('Step 2: savStudentSelect updated with live search.');

// 3. Target 3: behStudentSelect (บันทึกพฤติกรรม)
const oldBeh = `        <div>
          <label class="block font-bold text-slate-700 mb-1">นักเรียน *</label>
          <select id="behStudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white"></select>
        </div>`;

const newBeh = `        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block font-bold text-slate-700">นักเรียน *</label>
            <span id="behStudentSelect_count" class="text-[10px] text-slate-400 font-bold">346 คนทั้งหมด</span>
          </div>
          <div class="relative mb-1.5">
            <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400"></i>
            <input type="text" id="behStudentSelect_search" oninput="filterStudentSelect('behStudentSelect', this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();document.getElementById('behStudentSelect').focus();}" placeholder="🔍 ค้นหาชื่อ-สกุล, รหัส 4 หลัก หรือพิมพ์ชั้น เช่น ม.2/1..." class="w-full pl-8 pr-8 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-normal shadow-2xs">
            <button type="button" onclick="document.getElementById('behStudentSelect_search').value=''; filterStudentSelect('behStudentSelect','');" class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs" title="ล้างคำค้น">✕</button>
          </div>
          <select id="behStudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-xs"></select>
        </div>`;

if (!html.includes(oldBeh)) {
  console.error('ERROR: oldBeh not found!');
  process.exit(1);
}
html = html.replace(oldBeh, newBeh);
console.log('Step 3: behStudentSelect updated with live search.');

// 4. Target 4: pp5StudentSelect (บันทึก ปพ.5)
const oldPp5 = `          <div>
            <label class="block font-bold text-slate-700 mb-1">นักเรียน *</label>
            <select id="pp5StudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white"></select>
          </div>`;

const newPp5 = `          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block font-bold text-slate-700">นักเรียน *</label>
              <span id="pp5StudentSelect_count" class="text-[10px] text-slate-400 font-bold">346 คนทั้งหมด</span>
            </div>
            <div class="relative mb-1.5">
              <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400"></i>
              <input type="text" id="pp5StudentSelect_search" oninput="filterStudentSelect('pp5StudentSelect', this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();document.getElementById('pp5StudentSelect').focus();}" placeholder="🔍 ค้นหาชื่อ-สกุล, รหัส 4 หลัก หรือพิมพ์ชั้น..." class="w-full pl-8 pr-8 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-normal shadow-2xs">
              <button type="button" onclick="document.getElementById('pp5StudentSelect_search').value=''; filterStudentSelect('pp5StudentSelect','');" class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs" title="ล้างคำค้น">✕</button>
            </div>
            <select id="pp5StudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-xs"></select>
          </div>`;

if (!html.includes(oldPp5)) {
  console.error('ERROR: oldPp5 not found!');
  process.exit(1);
}
html = html.replace(oldPp5, newPp5);
console.log('Step 4: pp5StudentSelect updated with live search.');

// 5. Target 5: hvStudentSelect (บันทึกการเยี่ยมบ้าน)
const oldHv = `            <div class="sm:col-span-2">
              <label class="block font-bold text-slate-700 mb-1">เลือกนักเรียนในระบบ *</label>
              <select id="hvStudentSelect" onchange="onHomeVisitStudentChanged()" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white"></select>
            </div>`;

const newHv = `            <div class="sm:col-span-2">
              <div class="flex items-center justify-between mb-1">
                <label class="block font-bold text-slate-700">เลือกนักเรียนในระบบ *</label>
                <span id="hvStudentSelect_count" class="text-[10px] text-slate-400 font-bold">346 คนทั้งหมด</span>
              </div>
              <div class="relative mb-1.5">
                <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400"></i>
                <input type="text" id="hvStudentSelect_search" oninput="filterStudentSelect('hvStudentSelect', this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();document.getElementById('hvStudentSelect').focus();}" placeholder="🔍 ค้นหาชื่อ-สกุล, รหัส 4 หลัก หรือพิมพ์ชั้น..." class="w-full pl-8 pr-8 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-normal shadow-2xs">
                <button type="button" onclick="document.getElementById('hvStudentSelect_search').value=''; filterStudentSelect('hvStudentSelect','');" class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs" title="ล้างคำค้น">✕</button>
              </div>
              <select id="hvStudentSelect" onchange="onHomeVisitStudentChanged()" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-xs"></select>
            </div>`;

if (!html.includes(oldHv)) {
  console.error('ERROR: oldHv not found!');
  process.exit(1);
}
html = html.replace(oldHv, newHv);
console.log('Step 5: hvStudentSelect updated with live search.');

// 6. Target 6: iepStudentSelect (บันทึกนักเรียนเรียนรวม IEP)
const oldIep = `        <div>
          <label class="block font-bold text-slate-700 mb-1">นักเรียน *</label>
          <select id="iepStudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white"></select>
        </div>`;

const newIep = `        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block font-bold text-slate-700">นักเรียน *</label>
            <span id="iepStudentSelect_count" class="text-[10px] text-slate-400 font-bold">346 คนทั้งหมด</span>
          </div>
          <div class="relative mb-1.5">
            <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400"></i>
            <input type="text" id="iepStudentSelect_search" oninput="filterStudentSelect('iepStudentSelect', this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();document.getElementById('iepStudentSelect').focus();}" placeholder="🔍 ค้นหาชื่อ-สกุล, รหัส 4 หลัก หรือพิมพ์ชั้น..." class="w-full pl-8 pr-8 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-normal shadow-2xs">
            <button type="button" onclick="document.getElementById('iepStudentSelect_search').value=''; filterStudentSelect('iepStudentSelect','');" class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs" title="ล้างคำค้น">✕</button>
          </div>
          <select id="iepStudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-xs"></select>
        </div>`;

if (!html.includes(oldIep)) {
  console.error('ERROR: oldIep not found!');
  process.exit(1);
}
html = html.replace(oldIep, newIep);
console.log('Step 6: iepStudentSelect updated with live search.');

// 7. Update populateStudentSelect and add filterStudentSelect in JS
const oldPopulateStudentSelect = `    // Populate student select dropdowns across modals
    function populateStudentSelect(selectId, defaultStudentId = null) {
      const el = document.getElementById(selectId);
      if (!el) return;
      initExtendedState();
      const list = (state.ext.dmcStudents && state.ext.dmcStudents.length > 0) 
        ? state.ext.dmcStudents 
        : (state.students || []);
      el.innerHTML = list.map(s => {
        const id = s.studentId || s.id;
        const name = s.name || (s.title + s.firstName + ' ' + s.lastName);
        const cls = s.classroom || s.class || '';
        const selected = (id === defaultStudentId) ? 'selected' : '';
        return \`<option value="\${id}" \${selected}>\${name} (\${cls})</option>\`;
      }).join('');
    }`;

const newPopulateStudentSelect = `    // Populate student select dropdowns across modals with Search Support
    function populateStudentSelect(selectId, defaultStudentId = null) {
      const el = document.getElementById(selectId);
      if (!el) return;
      initExtendedState();
      const list = (state.ext.dmcStudents && state.ext.dmcStudents.length > 0) 
        ? state.ext.dmcStudents 
        : (state.students || []);

      const searchInput = document.getElementById(selectId + '_search');
      if (searchInput) searchInput.value = '';

      const countEl = document.getElementById(selectId + '_count');
      if (countEl) {
        countEl.textContent = \`\${list.length} คนทั้งหมด\`;
        countEl.className = 'text-[10px] text-slate-400 font-bold';
      }

      el.innerHTML = list.map(s => {
        const id = s.studentId || s.id;
        const name = s.name || (s.title + s.firstName + ' ' + s.lastName);
        const cls = s.classroom || s.class || '';
        const selected = (id === defaultStudentId) ? 'selected' : '';
        return \`<option value="\${id}" \${selected}>[\${id}] \${name} (\${cls})</option>\`;
      }).join('');

      if (defaultStudentId) {
        el.value = defaultStudentId;
      }
      if (window.lucide) lucide.createIcons();
    }

    // Live search filter for student select dropdowns
    function filterStudentSelect(selectId, query = '') {
      const el = document.getElementById(selectId);
      const countEl = document.getElementById(selectId + '_count');
      if (!el) return;
      initExtendedState();
      const list = (state.ext.dmcStudents && state.ext.dmcStudents.length > 0) 
        ? state.ext.dmcStudents 
        : (state.students || []);

      const q = (query || '').trim().toLowerCase();
      const filtered = q ? list.filter(s => {
        const id = String(s.studentId || s.id || '').toLowerCase();
        const cit = String(s.citizenId || '').toLowerCase();
        const name = (s.name || (s.title + s.firstName + ' ' + s.lastName) || '').toLowerCase();
        const fname = String(s.firstName || '').toLowerCase();
        const lname = String(s.lastName || '').toLowerCase();
        const cls = String(s.classroom || s.class || '').toLowerCase();
        return id.includes(q) || name.includes(q) || fname.includes(q) || lname.includes(q) || cls.includes(q) || cit.includes(q);
      }) : list;

      if (countEl) {
        countEl.textContent = q ? \`พบ \${filtered.length} จาก \${list.length} คน\` : \`\${list.length} คนทั้งหมด\`;
        if (q && filtered.length === 0) {
          countEl.className = 'text-[10px] text-rose-500 font-bold';
        } else if (q) {
          countEl.className = 'text-[10px] text-blue-600 font-bold';
        } else {
          countEl.className = 'text-[10px] text-slate-400 font-bold';
        }
      }

      if (filtered.length === 0) {
        el.innerHTML = '<option value="" disabled selected>-- ไม่พบรายชื่อนักเรียนที่ค้นหา --</option>';
        return;
      }

      const curVal = el.value;
      el.innerHTML = filtered.map(s => {
        const id = s.studentId || s.id;
        const name = s.name || (s.title + s.firstName + ' ' + s.lastName);
        const cls = s.classroom || s.class || '';
        const selected = (id === curVal) ? 'selected' : '';
        return \`<option value="\${id}" \${selected}>[\${id}] \${name} (\${cls})</option>\`;
      }).join('');

      if (!filtered.some(s => (s.studentId || s.id) === curVal)) {
        el.selectedIndex = 0;
      }
      if (typeof el.onchange === 'function') {
        el.onchange();
      }
    }`;

if (!html.includes(oldPopulateStudentSelect)) {
  console.error('ERROR: oldPopulateStudentSelect not found!');
  process.exit(1);
}
html = html.replace(oldPopulateStudentSelect, newPopulateStudentSelect);
console.log('Step 7: JS populateStudentSelect and filterStudentSelect updated.');

fs.writeFileSync('index.html', html, 'utf8');
console.log('SUCCESS: index.html has been updated with Student Search capability!');
