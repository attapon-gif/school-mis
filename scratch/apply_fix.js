const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');
const isCrlf = content.includes('\r\n');
console.log('Line endings:', isCrlf ? 'CRLF' : 'LF');

// Normalize to LF for easy replacement, then restore CRLF if needed
let normalized = content.replace(/\r\n/g, '\n');

// 1. Fix line 1418 </section></section> -> </section>
if (normalized.includes('</section></section>')) {
  normalized = normalized.replace('</section></section>', '</section>');
  console.log('Fixed line 1418: OK');
} else {
  console.log('Line 1418 already fixed');
}

// 2. Identify the exact chunk from transfersTableBody to </main>
const sTag = '<tbody id="transfersTableBody" class="divide-y divide-slate-200 bg-white">';
const eTag = '<!-- ================================================================= -->\n  <!-- MODAL: IMPORT STUDENTS FROM EXCEL';

const sIdx = normalized.indexOf(sTag);
const eIdx = normalized.indexOf(eTag);

console.log('sIdx:', sIdx, 'eIdx:', eIdx);
if (sIdx === -1 || eIdx === -1) {
  console.error('Could not locate section bounds');
  process.exit(1);
}

const beforeChunk = normalized.substring(sIdx, eIdx);

const newChunk = `<tbody id="transfersTableBody" class="divide-y divide-slate-200 bg-white">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- MODULE 24: ศูนย์รวมดาวน์โหลด & สั่งพิมพ์เอกสารวิชาการ (TAB-PRINT-CENTER) -->
    <!-- ================================================================= -->
    <section id="tab-print-center" class="tab-content hidden space-y-6">
      <!-- Header Banner -->
      <div class="card-3d p-6 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 border border-rose-200/80 bg-gradient-to-r from-rose-50/90 via-white to-pink-50/90 shadow-sm">
        <div class="flex items-start sm:items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-rose-200 flex-shrink-0">
            <i data-lucide="printer" class="w-7 h-7"></i>
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2.5">
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">24. ศูนย์รวมดาวน์โหลด & สั่งพิมพ์เอกสารวิชาการ</h2>
              <span class="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
                ⚡ ครบวงจร 28 รายการ
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              รวมทุกเอกสาร ปพ.1-ปพ.6, เล่ม ปพ.5 สมบูรณ์, ตารางสอน A4 แนวนอน, ป้ายล็อกเกอร์ 5 ช่อง, ทะเบียน DMC, บันทึกนิเทศ และแบบฟอร์มทางการ สั่งพิมพ์และดาวน์โหลดได้ในคลิกเดียว
            </p>
          </div>
        </div>
        <!-- Quick Action Shortcuts -->
        <div class="flex flex-wrap items-center gap-2 sm:self-start lg:self-center">
          <button type="button" onclick="triggerPrintCenterQuick('p6_batch')" class="btn-ega-primary text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition hover:scale-[1.02]">
            <i data-lucide="award" class="w-4 h-4 text-amber-300"></i> พิมพ์ ปพ.6 ยกห้อง
          </button>
          <button type="button" onclick="triggerPrintCenterQuick('pp5_full')" class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm hover:scale-[1.02]">
            <i data-lucide="book-open" class="w-4 h-4 text-emerald-300"></i> พิมพ์เล่ม ปพ.5
          </button>
          <button type="button" onclick="triggerPrintCenterQuick('timetable')" class="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm hover:scale-[1.02]">
            <i data-lucide="calendar" class="w-4 h-4 text-indigo-300"></i> ตารางสอนแนวนอน
          </button>
          <button type="button" onclick="triggerPrintCenterQuick('locker')" class="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm hover:scale-[1.02]">
            <i data-lucide="layout-grid" class="w-4 h-4 text-purple-300"></i> ป้ายล็อกเกอร์ 5 ช่อง
          </button>
        </div>
      </div>

      <!-- Filter Controls: Classroom Selector + Search + Category Pills -->
      <div class="card-3d p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Classroom Selector -->
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5 whitespace-nowrap">
              <i data-lucide="school" class="w-4 h-4 text-blue-600"></i> เลือกห้องเรียนที่ต้องการพิมพ์:
            </span>
            <select id="printCenterClassSelect" onchange="syncPrintCenterClass(this.value)" class="px-3.5 py-2 border-2 border-blue-200 rounded-xl bg-blue-50/60 font-black text-blue-950 text-xs sm:text-sm shadow-2xs focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none transition cursor-pointer">
              <option value="ป.6/1" selected>ชั้นประถมศึกษาปีที่ 6/1 (19 คน)</option>
              <option value="ป.6/2">ชั้นประถมศึกษาปีที่ 6/2 (19 คน)</option>
              <option value="ป.5/1">ชั้นประถมศึกษาปีที่ 5/1 (35 คน)</option>
              <option value="ป.4/1">ชั้นประถมศึกษาปีที่ 4/1 (32 คน)</option>
              <option value="ป.3/1">ชั้นประถมศึกษาปีที่ 3/1 (34 คน)</option>
              <option value="ป.2/1">ชั้นประถมศึกษาปีที่ 2/1 (33 คน)</option>
              <option value="ป.1/1">ชั้นประถมศึกษาปีที่ 1/1 (23 คน)</option>
              <option value="ป.1/2">ชั้นประถมศึกษาปีที่ 1/2 (23 คน)</option>
              <option value="ม.3/1">ชั้นมัธยมศึกษาปีที่ 3/1 (17 คน)</option>
              <option value="ม.2/1">ชั้นมัธยมศึกษาปีที่ 2/1 (34 คน)</option>
              <option value="ม.1/1">ชั้นมัธยมศึกษาปีที่ 1/1 (22 คน)</option>
              <option value="อ.3/1">ชั้นอนุบาล 3/1 (15 คน)</option>
              <option value="อ.3/2">ชั้นอนุบาล 3/2 (16 คน)</option>
              <option value="อ.2/1">ชั้นอนุบาล 2/1 (12 คน)</option>
              <option value="อ.2/2">ชั้นอนุบาล 2/2 (12 คน)</option>
            </select>
            <span class="text-[11px] text-slate-500 hidden sm:inline">
              (ปรับใช้กับ ปพ.6, เล่ม ปพ.5, เช็คชื่อ, ป้ายล็อกเกอร์, โภชนาการ และเงินออม อัตโนมัติ)
            </span>
          </div>

          <!-- Live Search Box with Clear Button -->
          <div class="relative w-full md:w-72">
            <i data-lucide="search" class="w-4 h-4 absolute left-3 top-2.5 text-slate-400"></i>
            <input type="text" id="printCenterSearchInput" oninput="renderPrintCenterCards()" placeholder="ค้นหาชื่อเอกสาร, รหัส ปพ., ประเภท..." class="w-full pl-9 pr-8 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm bg-slate-50 font-medium shadow-2xs focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition">
            <button type="button" id="printCenterClearSearchBtn" onclick="clearPrintCenterSearch()" class="hidden absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 transition">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- Category Pills Filter Bar -->
        <div class="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span class="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <i data-lucide="layers" class="w-3.5 h-3.5 text-rose-500"></i> หมวดหมู่:
          </span>
          <button type="button" onclick="setPrintCenterCategory('all')" id="printCatPill-all" class="print-cat-pill active px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-2xs bg-rose-600 text-white">
            <span>📂 ทั้งหมด</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-white/25">28</span>
          </button>
          <button type="button" onclick="setPrintCenterCategory('grades')" id="printCatPill-grades" class="print-cat-pill px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900">
            <span>🏆 วัดผล & ปพ.</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200">8</span>
          </button>
          <button type="button" onclick="setPrintCenterCategory('plans')" id="printCatPill-plans" class="print-cat-pill px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900">
            <span>📚 แผน & นิเทศ</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200">3</span>
          </button>
          <button type="button" onclick="setPrintCenterCategory('timetables')" id="printCatPill-timetables" class="print-cat-pill px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-900">
            <span>🗓️ ตารางสอน & ปฏิทิน</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200">2</span>
          </button>
          <button type="button" onclick="setPrintCenterCategory('student_affairs')" id="printCatPill-student_affairs" class="print-cat-pill px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900">
            <span>💚 กิจวัตร & พฤติกรรม</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200">5</span>
          </button>
          <button type="button" onclick="setPrintCenterCategory('dmc_locker')" id="printCatPill-dmc_locker" class="print-cat-pill px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900">
            <span>🗃️ ทะเบียน & ล็อกเกอร์</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200">5</span>
          </button>
          <button type="button" onclick="setPrintCenterCategory('activities_templates')" id="printCatPill-activities_templates" class="print-cat-pill px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-900">
            <span>🎯 กิจกรรม & แม่แบบ</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200">5</span>
          </button>
          <div class="ml-auto">
            <span id="printCenterCountBadge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 font-black border border-rose-200 text-xs shadow-2xs">
              ⚡ พร้อมสั่งพิมพ์ 28 รายการ
            </span>
          </div>
        </div>
      </div>

      <!-- Document Cards Container -->
      <div id="printCenterCardsContainer" class="space-y-8">
        <!-- Rendered dynamically -->
      </div>
    </section>

  </main>
      </div>
    </div>
  
`;

normalized = normalized.substring(0, sIdx) + newChunk + normalized.substring(eIdx);
console.log('Replaced section 24 HTML and layout closing divs: OK');

// 3. Update JavaScript logic
const jsStartTag = 'function syncPrintCenterClass(val) {';
const jsEndTag = '<!-- MAIN SITE FOOTER -->';

const jsStartIdx = normalized.indexOf(jsStartTag);
const jsEndIdx = normalized.indexOf(jsEndTag);

console.log('jsStartIdx:', jsStartIdx, 'jsEndIdx:', jsEndIdx);
if (jsStartIdx === -1 || jsEndIdx === -1) {
  console.error('Could not locate JS bounds');
  process.exit(1);
}

// Find closing </script> before jsEndTag
const scriptCloseIdx = normalized.lastIndexOf('</script>', jsEndIdx);
const beforeJsChunk = normalized.substring(jsStartIdx, scriptCloseIdx);

const newJsChunk = `let activePrintCategory = 'all';

    function setPrintCenterCategory(cat) {
      activePrintCategory = cat;
      const pills = [
        { id: 'printCatPill-all', color: 'bg-rose-600 text-white' },
        { id: 'printCatPill-grades', color: 'bg-blue-600 text-white' },
        { id: 'printCatPill-plans', color: 'bg-emerald-600 text-white' },
        { id: 'printCatPill-timetables', color: 'bg-indigo-600 text-white' },
        { id: 'printCatPill-student_affairs', color: 'bg-amber-600 text-white' },
        { id: 'printCatPill-dmc_locker', color: 'bg-purple-600 text-white' },
        { id: 'printCatPill-activities_templates', color: 'bg-rose-600 text-white' }
      ];

      pills.forEach(p => {
        const el = document.getElementById(p.id);
        if (!el) return;
        if (p.id === \`printCatPill-\${cat}\`) {
          el.className = \`print-cat-pill active px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-2xs \${p.color}\`;
          const badge = el.querySelector('span:last-child');
          if (badge) badge.className = 'text-[10px] px-1.5 py-0.2 rounded-full bg-white/30 text-white font-bold';
        } else {
          el.className = 'print-cat-pill px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900';
          const badge = el.querySelector('span:last-child');
          if (badge) badge.className = 'text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700';
        }
      });

      renderPrintCenterCards();
    }

    function clearPrintCenterSearch() {
      const inp = document.getElementById('printCenterSearchInput');
      if (inp) {
        inp.value = '';
        const clearBtn = document.getElementById('printCenterClearSearchBtn');
        if (clearBtn) clearBtn.classList.add('hidden');
        renderPrintCenterCards();
      }
    }

    function syncPrintCenterClass(val) {
      // Sync selected classroom across app selectors so prints use this class automatically
      ['p6BatchClassSelect', 'attendanceClassSelect', 'bmiClassFilter', 'savingsClassFilter', 'behaviorClassFilter', 'dmcFilterClass', 'gradeFilterClass', 'pp5FilterClass'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.value = val;
          // Trigger change event if appropriate
          if (id === 'p6BatchClassSelect' && typeof onP6BatchClassChange === 'function') onP6BatchClassChange();
        }
      });
      // Re-render cards so button labels and scope badges reflect the chosen class
      renderPrintCenterCards();
      showToast(\`เลือกระดับชั้น \${val} สำหรับการสั่งพิมพ์เอกสารเรียบร้อย\`);
    }

    function renderPrintCenter() {
      if (!state.ext) initExtendedState();
      renderPrintCenterCards();
    }

    function renderPrintCenterCards() {
      const container = document.getElementById('printCenterCardsContainer');
      if (!container) return;

      const categoryFilter = activePrintCategory || 'all';
      const searchInput = document.getElementById('printCenterSearchInput');
      const searchQ = (searchInput?.value || '').trim().toLowerCase();
      const clearBtn = document.getElementById('printCenterClearSearchBtn');
      if (clearBtn) {
        if (searchQ) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
      }

      const currentClass = document.getElementById('printCenterClassSelect')?.value || 'ป.6/1';

      let filteredDocs = PRINT_CENTER_DOCS;
      if (categoryFilter !== 'all') {
        filteredDocs = filteredDocs.filter(d => d.category === categoryFilter);
      }
      if (searchQ) {
        filteredDocs = filteredDocs.filter(d =>
          d.title.toLowerCase().includes(searchQ) ||
          d.code.toLowerCase().includes(searchQ) ||
          d.desc.toLowerCase().includes(searchQ) ||
          d.categoryName.toLowerCase().includes(searchQ) ||
          (d.orientation && d.orientation.toLowerCase().includes(searchQ))
        );
      }

      // Update count badge
      const countBadge = document.getElementById('printCenterCountBadge');
      if (countBadge) {
        countBadge.textContent = \`⚡ แสดงผล \${filteredDocs.length} จาก 28 รายการ\`;
      }

      if (filteredDocs.length === 0) {
        container.innerHTML = \`
          <div class="card-3d p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <i data-lucide="search-x" class="w-12 h-12 mx-auto mb-3 opacity-40 text-rose-500"></i>
            <h4 class="text-base font-black text-slate-800">ไม่พบเอกสารที่ค้นหา: "\${escapeHtml(searchQ)}"</h4>
            <p class="text-xs text-slate-500 mt-1">กรุณาลองพิมพ์คำค้นอื่น หรือกดปุ่ม "📂 ทั้งหมด" เพื่อดูเอกสารทั้งหมด 28 รายการ</p>
            <button type="button" onclick="clearPrintCenterSearch(); setPrintCenterCategory('all');" class="mt-4 btn-ega-primary text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-sm">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> ล้างการค้นหาและแสดงทั้งหมด
            </button>
          </div>
        \`;
        if (window.lucide) lucide.createIcons();
        return;
      }

      // Group by category
      const categories = [
        {
          key: 'grades',
          num: '1',
          name: '🏆 หมวดที่ 1: งานวัดผล & พัฒนาการผู้เรียน (ปพ.1 - ปพ.6)',
          desc: 'สมุด ปพ.6 ยกห้อง, ปพ.6 รายคน, เล่ม ปพ.5 สมบูรณ์, หน้าสรุปเกรด, บัญชีแก้ 0 ร มส, ตารางสอบ และ School MIS CSV',
          border: 'border-blue-300',
          bgHeader: 'bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/50',
          badge: 'bg-blue-100 text-blue-800 border border-blue-200'
        },
        {
          key: 'plans',
          num: '2',
          name: '📚 หมวดที่ 2: งานแผนการสอน, นิเทศภายใน & จัดสอนแทน',
          desc: 'เล่มแผนการสอนพร้อมประทับลายเซ็นดิจิทัล ผอ. อัตโนมัติ, บันทึกนิเทศ 5 ด้าน 100 คะแนน และคำสั่งสอนแทน',
          border: 'border-emerald-300',
          bgHeader: 'bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/50',
          badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200'
        },
        {
          key: 'timetables',
          num: '3',
          name: '🗓️ หมวดที่ 3: งานตารางสอน & ปฏิทินปฏิบัติงานวิชาการ',
          desc: 'ตารางสอนและตารางเรียน A4 แนวนอน แยกสีประจำวันไทย (จันทร์-ศุกร์) และปฏิทินปฏิบัติงานวิชาการ 2569',
          border: 'border-indigo-300',
          bgHeader: 'bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/50',
          badge: 'bg-indigo-100 text-indigo-800 border border-indigo-200'
        },
        {
          key: 'student_affairs',
          num: '4',
          name: '💚 หมวดที่ 4: งานกิจการนักเรียน & ดูแลช่วยเหลือนักเรียน',
          desc: 'แบบบันทึกเวลาเรียน 4 มิติ (เสาธง/อาหาร/นม/แปรงฟัน), โภชนาการ BMI, วินัยความประพฤติ, สมุดเงินออม และเยี่ยมบ้าน สพฐ.',
          border: 'border-amber-300',
          bgHeader: 'bg-gradient-to-r from-amber-50/80 via-white to-yellow-50/50',
          badge: 'bg-amber-100 text-amber-800 border border-amber-200'
        },
        {
          key: 'dmc_locker',
          num: '5',
          name: '🗃️ หมวดที่ 5: งานทะเบียนนักเรียน, DMC & ล็อกเกอร์เหล็กวิชาการ',
          desc: 'ป้ายรายชื่อใส่ล็อกเกอร์ 5 ช่อง (ประจำห้อง / 15 ห้องรวดเดียว), ป้ายติดโต๊ะสอบ, ทะเบียน DMC และทะเบียนย้ายเข้า-ออก',
          border: 'border-purple-300',
          bgHeader: 'bg-gradient-to-r from-purple-50/80 via-white to-pink-50/50',
          badge: 'bg-purple-100 text-purple-800 border border-purple-200'
        },
        {
          key: 'activities_templates',
          num: '6',
          name: '🎯 หมวดที่ 6: กิจกรรมพัฒนาผู้เรียน, วิจัย CAR & แม่แบบดาวน์โหลด',
          desc: 'แบบประเมินกิจกรรมชุมนุม, ทะเบียนลูกเสือ-เนตรนารี, แผน IEP เรียนรวม, วิจัยหน้าเดียว และแม่แบบ Excel .xlsx',
          border: 'border-rose-300',
          bgHeader: 'bg-gradient-to-r from-rose-50/80 via-white to-pink-50/50',
          badge: 'bg-rose-100 text-rose-800 border border-rose-200'
        }
      ];

      // Classroom-scoped document IDs that should display the active classroom name
      const classroomScopedDocs = [
        'doc_p6_batch',
        'doc_grade_room_summary',
        'doc_daily_attendance',
        'doc_bmi_report',
        'doc_behavior_report',
        'doc_savings_report',
        'doc_locker_sheet'
      ];

      let html = '';
      categories.forEach(cat => {
        const catDocs = filteredDocs.filter(d => d.category === cat.key);
        if (catDocs.length === 0) return;

        html += \`
          <div class="space-y-4">
            <!-- Category Header -->
            <div class="p-3.5 sm:p-4 rounded-2xl border-l-4 \${cat.border} border border-slate-200 \${cat.bgHeader} shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-sm sm:text-base font-black text-slate-900 tracking-tight">\${cat.name}</h3>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black \${cat.badge}">\${catDocs.length} ฉบับ</span>
                </div>
                <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">\${cat.desc}</p>
              </div>
            </div>

            <!-- Cards Grid (3 Columns) -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              \${catDocs.map(doc => {
                const isClassScoped = classroomScopedDocs.includes(doc.id);
                let btnLabel = doc.btnText;
                if (doc.id === 'doc_p6_batch') btnLabel = \`พิมพ์ ปพ.6 (\${currentClass})\`;
                else if (doc.id === 'doc_grade_room_summary') btnLabel = \`พิมพ์สรุปเกรด (\${currentClass})\`;
                else if (doc.id === 'doc_daily_attendance') btnLabel = \`พิมพ์เช็คชื่อ (\${currentClass})\`;
                else if (doc.id === 'doc_bmi_report') btnLabel = \`พิมพ์รายงาน BMI (\${currentClass})\`;
                else if (doc.id === 'doc_behavior_report') btnLabel = \`พิมพ์คะแนนวินัย (\${currentClass})\`;
                else if (doc.id === 'doc_savings_report') btnLabel = \`พิมพ์เงินออม (\${currentClass})\`;
                else if (doc.id === 'doc_locker_sheet') btnLabel = \`พิมพ์ล็อกเกอร์ (\${currentClass})\`;

                // Orientation / Format Pill
                let orientPill = '';
                const ori = doc.orientation || '';
                if (ori.includes('Landscape') || ori.includes('แนวนอน')) {
                  orientPill = \`<span class="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1"><i data-lucide="layout" class="w-3 h-3 text-indigo-500"></i> \${ori}</span>\`;
                } else if (ori.includes('.xlsx') || ori.includes('Excel')) {
                  orientPill = \`<span class="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1"><i data-lucide="file-spreadsheet" class="w-3 h-3 text-emerald-600"></i> \${ori}</span>\`;
                } else if (ori.includes('.csv') || ori.includes('CSV')) {
                  orientPill = \`<span class="text-[10px] font-black text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full flex items-center gap-1"><i data-lucide="file-code" class="w-3 h-3 text-teal-600"></i> \${ori}</span>\`;
                } else {
                  orientPill = \`<span class="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1"><i data-lucide="file-text" class="w-3 h-3 text-slate-500"></i> \${ori}</span>\`;
                }

                // Scope Pill
                let scopePill = '';
                if (isClassScoped) {
                  scopePill = \`<div class="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-xl border border-blue-200/60 mb-3"><i data-lucide="school" class="w-3.5 h-3.5 text-blue-600 flex-shrink-0"></i><span>สำหรับ: <span class="font-black text-blue-900">\${currentClass}</span></span></div>\`;
                } else if (doc.id === 'doc_locker_all_rooms') {
                  scopePill = \`<div class="flex items-center gap-1.5 text-[11px] font-bold text-teal-700 bg-teal-50/80 px-2.5 py-1 rounded-xl border border-teal-200/60 mb-3"><i data-lucide="layers" class="w-3.5 h-3.5 text-teal-600 flex-shrink-0"></i><span>สำหรับ: ทั้ง 15 ห้องเรียน (346 คน)</span></div>\`;
                } else {
                  scopePill = \`<div class="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/60 mb-3"><i data-lucide="building-2" class="w-3.5 h-3.5 text-slate-400 flex-shrink-0"></i><span>สำหรับ: ภาพรวมสถานศึกษา</span></div>\`;
                }

                return \`
                  <div class="card-3d p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-rose-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
                    <div>
                      <!-- Card Header: Code Badge + Format Badge -->
                      <div class="flex items-start justify-between gap-2 mb-2.5">
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase \${cat.badge} shadow-2xs">
                          \${doc.code}
                        </span>
                        \${orientPill}
                      </div>

                      <!-- Document Title -->
                      <h4 class="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-2 group-hover:text-rose-700 transition-colors">
                        \${doc.title}
                      </h4>

                      <!-- Document Description -->
                      <p class="text-[11px] sm:text-xs text-slate-500 leading-relaxed mb-3 line-clamp-3">
                        \${doc.desc}
                      </p>

                      <!-- Scope Info -->
                      \${scopePill}
                    </div>

                    <!-- Card Action Button -->
                    <div class="pt-2 border-t border-slate-100">
                      <button type="button" onclick="triggerPrintCenterDoc('\${doc.id}')" class="\${doc.btnClass} w-full text-xs sm:text-sm py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 shadow-2xs font-bold hover:scale-[1.01] active:scale-[0.99]">
                        <i data-lucide="\${doc.icon || 'printer'}" class="w-4 h-4"></i>
                        <span class="truncate">\${btnLabel}</span>
                      </button>
                    </div>
                  </div>
                \`;
              }).join('')}
            </div>
          </div>
        \`;
      });

      container.innerHTML = html;
      if (window.lucide) lucide.createIcons();
    }

    function triggerPrintCenterDoc(docId) {
      const doc = PRINT_CENTER_DOCS.find(d => d.id === docId);
      if (doc && typeof doc.action === 'function') {
        doc.action();
      }
    }

    function triggerPrintCenterQuick(type) {
      const cls = document.getElementById('printCenterClassSelect')?.value || 'ป.6/1';
      if (type === 'p6_batch') {
        const p6Sel = document.getElementById('p6BatchClassSelect');
        if (p6Sel) p6Sel.value = cls;
        if (typeof onP6BatchClassChange === 'function') onP6BatchClassChange();
        printClassroomP6Batch();
      } else if (type === 'pp5_full') {
        printPp5Report('all');
      } else if (type === 'timetable') {
        printTimetableA4Landscape();
      } else if (type === 'locker') {
        const sel = document.getElementById('dmcFilterClass');
        if (sel) sel.value = cls;
        printLockerRoomStudentSheet(false);
      }
    }
`;

normalized = normalized.substring(0, jsStartIdx) + newJsChunk + normalized.substring(scriptCloseIdx);
console.log('Replaced Print Center JS: OK');

// Convert back to CRLF if file was CRLF
if (isCrlf) {
  normalized = normalized.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', normalized, 'utf8');
console.log('Updated index.html successfully!');
