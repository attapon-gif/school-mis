// MODULE 4: ตารางสอน (ไม่ซ้ำ) & จัดสอนแทน

let timetablesList = [];
let substituteList = [];
let periodsData = [];
let daysData = [];

function initTimetableModule() {
  loadTimetableData();
}

async function loadTimetableData() {
  try {
    const res = await fetch('/api/timetables');
    const data = await res.json();
    timetablesList = data.timetables || [];
    periodsData = data.periods || [];
    daysData = data.days || [];

    // Populate Classroom Filter
    const classSelect = document.getElementById('timetableClassSelect');
    if (classSelect) {
      classSelect.innerHTML = (data.classrooms || []).map(c => `
        <option value="${c}">${c}</option>
      `).join('');
    }

    renderTimetableGrid();
    loadSubstitutes();
  } catch (err) {
    console.error('Error loading timetable:', err);
  }
}

// Render Weekly Timetable Grid
function renderTimetableGrid() {
  const table = document.getElementById('timetableMainGrid');
  if (!table) return;

  const currentClass = document.getElementById('timetableClassSelect') ? document.getElementById('timetableClassSelect').value : 'ม.1/1';

  // Table Header (Periods)
  let headerHtml = `
    <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-xs">
      <tr>
        <th class="p-3 border-r border-slate-200 w-24">วัน / คาบ</th>
  `;
  periodsData.forEach(p => {
    headerHtml += `
      <th class="p-3 border-r border-slate-200">
        <div>${p.name}</div>
        <div class="text-[10px] text-slate-400 font-normal">${p.time}</div>
      </th>
    `;
  });
  headerHtml += `</tr></thead>`;

  // Table Body (Days)
  let bodyHtml = `<tbody class="divide-y divide-slate-200">`;

  daysData.forEach(day => {
    let dayBg = 'bg-white';
    if (day === 'จันทร์') dayBg = 'bg-amber-50/20';
    else if (day === 'อังคาร') dayBg = 'bg-pink-50/20';
    else if (day === 'พุธ') dayBg = 'bg-emerald-50/20';
    else if (day === 'พฤหัสบดี') dayBg = 'bg-orange-50/20';
    else if (day === 'ศุกร์') dayBg = 'bg-blue-50/20';

    bodyHtml += `<tr class="${dayBg}">`;
    bodyHtml += `<td class="p-3 font-bold text-slate-800 border-r border-slate-200">${day}</td>`;

    periodsData.forEach(p => {
      // Check if lunch break
      if (p.id === 4) {
        bodyHtml += `<td class="p-2 border-r border-slate-200 bg-slate-100 text-xs text-slate-400 font-medium">พักกลางวัน</td>`;
        return;
      }

      // Find slot for this day, period, and selected classroom
      const slot = timetablesList.find(t => t.day === day && t.period === p.id && t.classroom === currentClass);

      if (slot) {
        bodyHtml += `
          <td class="p-2 border-r border-slate-200">
            <div class="bg-blue-50/90 border border-blue-200 rounded-xl p-2.5 text-left relative group shadow-sm hover:border-blue-400 transition-all">
              <div class="font-bold text-xs text-blue-900">${slot.subject}</div>
              <div class="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
                <i data-lucide="user" class="w-3 h-3 text-slate-400"></i> ${slot.teacherName}
              </div>
              <div class="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                <i data-lucide="map-pin" class="w-3 h-3 text-slate-400"></i> ${slot.room}
              </div>
              <button onclick="deleteTimetableSlot('${slot.id}')" class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all p-1">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </td>
        `;
      } else {
        bodyHtml += `
          <td class="p-2 border-r border-slate-200 hover:bg-blue-50/30 transition-all cursor-pointer" onclick="quickAddSlot('${day}', ${p.id})">
            <div class="h-16 flex items-center justify-center text-slate-300 text-xs hover:text-blue-500">
              <i data-lucide="plus" class="w-4 h-4"></i>
            </div>
          </td>
        `;
      }
    });

    bodyHtml += `</tr>`;
  });

  bodyHtml += `</tbody>`;

  table.innerHTML = headerHtml + bodyHtml;
  if (window.lucide) lucide.createIcons();
}

// Quick add slot by clicking cell
function quickAddSlot(day, period) {
  document.getElementById('ttDaySelect').value = day;
  document.getElementById('ttPeriodSelect').value = period;
  const currentClass = document.getElementById('timetableClassSelect').value;
  document.getElementById('ttClassroomSelect').value = currentClass;
  openModalAddTimetableSlot();
}

function openModalAddTimetableSlot() {
  checkSlotConflict();
  openModal('modalAddTimetable');
}

// REAL-TIME CONFLICT CHECKER (RULE: Teacher, Room, Classroom cannot duplicate in same slot)
async function checkSlotConflict() {
  const day = document.getElementById('ttDaySelect').value;
  const period = document.getElementById('ttPeriodSelect').value;
  const teacherId = document.getElementById('ttTeacherSelect').value;
  const room = document.getElementById('ttRoomSelect').value;
  const classroom = document.getElementById('ttClassroomSelect').value;

  const alertBox = document.getElementById('conflictAlertBox');
  const alertText = document.getElementById('conflictAlertText');
  const submitBtn = document.getElementById('btnSubmitTimetableSlot');

  try {
    const res = await fetch('/api/timetables/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day, period, teacherId, room, classroom })
    });
    const result = await res.json();

    if (result.hasConflict) {
      alertBox.classList.remove('hidden');
      alertText.innerHTML = result.conflicts.map(c => `• ${c}`).join('<br>');
      submitBtn.disabled = true;
      submitBtn.className = 'px-4 py-2 bg-slate-300 text-slate-500 rounded-xl text-sm font-semibold cursor-not-allowed';
    } else {
      alertBox.classList.add('hidden');
      alertText.innerHTML = '';
      submitBtn.disabled = false;
      submitBtn.className = 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm';
    }
  } catch (err) {
    console.error('Conflict check error:', err);
  }
}

// Save Timetable Slot
async function handleSaveTimetableSlot(e) {
  e.preventDefault();
  const day = document.getElementById('ttDaySelect').value;
  const period = document.getElementById('ttPeriodSelect').value;
  const classroom = document.getElementById('ttClassroomSelect').value;
  const teacherSelect = document.getElementById('ttTeacherSelect');
  const teacherId = teacherSelect.value;
  const teacherObj = state.teachers.find(t => t.id === teacherId) || {};
  const teacherName = teacherObj.name || teacherSelect.options[teacherSelect.selectedIndex].text;
  const subject = document.getElementById('ttSubjectInput').value;
  const room = document.getElementById('ttRoomSelect').value;

  const payload = {
    day,
    period,
    classroom,
    teacherId,
    teacherName,
    subject,
    room
  };

  try {
    const res = await fetch('/api/timetables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!res.ok) {
      alert(result.error || 'ตารางสอนชนกัน ไม่สามารถบันทึกได้');
      return;
    }

    closeModal('modalAddTimetable');
    document.getElementById('ttSubjectInput').value = '';
    await loadTimetableData();
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการบันทึกคาบสอน');
  }
}

// Delete slot
async function deleteTimetableSlot(slotId) {
  if (!confirm('ต้องการลบคาบสอนนี้ออกจากตารางหรือไม่?')) return;
  try {
    const res = await fetch(`/api/timetables/${slotId}`, { method: 'DELETE' });
    if (res.ok) {
      await loadTimetableData();
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการลบคาบสอน');
  }
}

// -------------------------------------------------------------
// SUBSTITUTE TEACHING (ระบบสอนแทน)
// -------------------------------------------------------------
async function loadSubstitutes() {
  try {
    const res = await fetch('/api/substitutes');
    const data = await res.json();
    substituteList = data.substitutes || [];
    renderSubstitutesList(substituteList);
  } catch (err) {
    console.error('Error loading substitutes:', err);
  }
}

function renderSubstitutesList(list) {
  const tbody = document.getElementById('substituteListTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">ยังไม่มีประวัติการจัดสอนแทน</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(s => `
    <tr class="hover:bg-slate-50 transition-all">
      <td class="p-3 text-xs">
        <div class="font-bold text-slate-800">${s.date} (วัน${s.day})</div>
        <div class="text-slate-400">คาบที่ ${s.period} (${s.periodTime})</div>
      </td>
      <td class="p-3 text-xs">
        <div class="font-semibold text-blue-700">${s.classroom}</div>
        <div class="text-slate-600">${s.subject}</div>
      </td>
      <td class="p-3 text-xs font-medium text-red-600">${s.absentTeacherName}</td>
      <td class="p-3 text-xs text-slate-500">${s.absentReason}</td>
      <td class="p-3 text-xs font-bold text-emerald-700">${s.subTeacherName}</td>
      <td class="p-3 text-xs">
        <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">${s.status}</span>
      </td>
      <td class="p-3 text-center">
        <button onclick="printSubstituteSlip('${s.id}')" class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold flex items-center gap-1 mx-auto">
          <i data-lucide="printer" class="w-3.5 h-3.5"></i> ใบสอนแทน (PDF)
        </button>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function openModalSubstitute() {
  const d = new Date();
  document.getElementById('subDate').value = d.toISOString().split('T')[0];
  searchFreeTeachers();
  openModal('modalSubstitute');
}

// SMART SEARCH: Find Free Teachers for Substitute
async function searchFreeTeachers() {
  const day = document.getElementById('subDay').value;
  const period = document.getElementById('subPeriod').value;
  const absentTeacherId = document.getElementById('subAbsentTeacher').value;

  try {
    const res = await fetch('/api/substitutes/find-free-teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day, period, absentTeacherId })
    });
    const data = await res.json();
    const select = document.getElementById('subFreeTeacherSelect');
    const badge = document.getElementById('freeTeacherCountBadge');

    badge.textContent = `${data.totalFree} คนว่าง`;

    if (data.freeTeachers.length === 0) {
      select.innerHTML = `<option value="">-- ไม่มีครูว่างในคาบนี้ --</option>`;
    } else {
      select.innerHTML = data.freeTeachers.map(t => `
        <option value="${t.id}">${t.name} (${t.subject})</option>
      `).join('');
    }
  } catch (err) {
    console.error('Error finding free teachers:', err);
  }
}

async function handleSaveSubstitute(e) {
  e.preventDefault();
  const date = document.getElementById('subDate').value;
  const day = document.getElementById('subDay').value;
  const period = document.getElementById('subPeriod').value;
  const classroom = document.getElementById('subClassroom').value;
  const subject = document.getElementById('subSubject').value;
  const absentTeacherSelect = document.getElementById('subAbsentTeacher');
  const absentTeacherId = absentTeacherSelect.value;
  const absentTeacherName = absentTeacherSelect.options[absentTeacherSelect.selectedIndex].text.split(' (')[0];
  const absentReason = document.getElementById('subReason').value;

  const subTeacherSelect = document.getElementById('subFreeTeacherSelect');
  if (!subTeacherSelect.value) {
    alert('กรุณาเลือกครูผู้สอนแทน');
    return;
  }
  const subTeacherId = subTeacherSelect.value;
  const subTeacherName = subTeacherSelect.options[subTeacherSelect.selectedIndex].text.split(' (')[0];
  const remark = document.getElementById('subRemark').value;

  const payload = {
    date,
    day,
    period,
    periodTime: `คาบที่ ${period}`,
    classroom,
    subject: subject || 'การจัดการเรียนรู้ตามตาราง',
    absentTeacherId,
    absentTeacherName,
    absentReason,
    subTeacherId,
    subTeacherName,
    remark
  };

  try {
    const res = await fetch('/api/substitutes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      alert('บันทึกคำสั่งจัดสอนแทนเรียบร้อยแล้ว!');
      closeModal('modalSubstitute');
      loadSubstitutes();
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการบันทึกสอนแทน');
  }
}

// Print Substitute Teaching Slip (PDF Template)
function printSubstituteSlip(subId) {
  const sub = substituteList.find(s => s.id === subId);
  if (!sub) return;
  const school = state.schoolInfo;
  const printable = document.getElementById('printableArea');

  printable.innerHTML = `
    <div style="font-family: 'Sarabun', sans-serif; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6;">
      <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px;">
        <img src="${school.logoUrl || '/assets/logo.jpg'}" style="max-height: 70px; margin: 0 auto 6px auto; display: block;" alt="ตราโรงเรียนฝันใหม่">
        <h2 style="font-size: 20px; font-weight: bold; margin: 0;">${school.name}</h2>
        <h3 style="font-size: 16px; font-weight: bold; margin-top: 4px;">บันทึกข้อความ / ใบมอบหมายปฏิบัติหน้าที่สอนแทน</h3>
        <p style="font-size: 13px; color: #64748b; margin: 4px 0;">ฝ่ายบริหารงานวิชาการ สถานศึกษา</p>
      </div>

      <div style="font-size: 14px; margin-bottom: 16px;">
        <p><strong>เรียน:</strong> ${sub.subTeacherName}</p>
        <p style="text-indent: 30px; margin-top: 8px;">
          ด้วย <strong>${sub.absentTeacherName}</strong> มีความจำเป็นต้องหยุดปฏิบัติหน้าที่ราชการเนื่องจาก <em>"${sub.absentReason}"</em> 
          ฝ่ายบริหารงานวิชาการได้ตรวจสอบตารางสอนแล้ว จึงขอมอบหมายให้ท่านปฏิบัติหน้าที่สอนแทน เพื่อให้การจัดการเรียนการสอนดำเนินไปอย่างต่อเนื่อง ดังนี้:
        </p>
      </div>

      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-bottom: 16px; font-size: 14px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div><strong>วันที่ปฏิบัติหน้าที่สอนแทน:</strong> ${sub.date} (วัน${sub.day})</div>
          <div><strong>เวลา / คาบเรียน:</strong> คาบที่ ${sub.period} (${sub.periodTime})</div>
          <div><strong>ระดับชั้นเรียน:</strong> ${sub.classroom}</div>
          <div><strong>รายวิชา:</strong> ${sub.subject}</div>
        </div>
        <div style="margin-top: 10px; border-top: 1px dashed #cbd5e1; pt: 8px;">
          <strong>ภาระงาน / คำแนะนำที่ฝากให้นักเรียนปฏิบัติ:</strong>
          <div style="color: #475569; margin-top: 2px;">${sub.remark || 'ควบคุมชั้นเรียนและดูแลให้นักเรียนทำกิจกรรมการเรียนรู้ตามที่ได้รับมอบหมาย'}</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-top: 40px;">
        <div style="text-align: center; width: 250px;">
          <div>ลงชื่อ......................................................ผู้รับมอบหมายสอนแทน</div>
          <div style="margin-top: 4px;">(${sub.subTeacherName})</div>
          <div style="color: #64748b; font-size: 12px;">ครูผู้สอนแทน</div>
        </div>
        <div style="text-align: center; width: 250px;">
          <div style="height: 50px; display: flex; align-items: center; justify-content: center;">
            <img src="${school.signatureUrl || '/uploads/signatures/default_signature.png'}" style="max-height: 45px;" alt="Signature">
          </div>
          <div>ลงชื่อ (${school.directorName})</div>
          <div style="color: #64748b; font-size: 12px;">${school.directorPosition}</div>
        </div>
      </div>
    </div>
  `;

  window.print();
}
