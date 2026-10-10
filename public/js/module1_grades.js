// MODULE 1: ผลการเรียน & สรุป 0, ร, มส

let currentGradesData = [];
let selectedGradeIdForResolve = null;

function initGradesModule() {
  loadGrades();
}

// Student Login Action
async function handleStudentLogin() {
  const studentId = document.getElementById('loginStudentId').value.trim();
  const citizenId = document.getElementById('loginCitizenId').value.trim();

  if (!studentId || !citizenId) {
    alert('กรุณากรอกทั้งเลขประจำตัวนักเรียนและเลขบัตรประชาชน');
    return;
  }

  try {
    const res = await fetch('/api/student/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, citizenId })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
      return;
    }

    state.activeStudent = data.student;
    renderStudentResult(data);
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
  }
}

// Render Student Grade Slip
function renderStudentResult(data) {
  const { student, grades, gpa } = data;
  document.getElementById('studentLoginContainer').classList.add('hidden');
  document.getElementById('studentResultCard').classList.remove('hidden');

  document.getElementById('stuCardName').textContent = student.name;
  document.getElementById('stuCardId').textContent = student.id;
  document.getElementById('stuCardClass').textContent = `${student.classroom} (เลขที่ ${student.number})`;
  document.getElementById('stuCardGPA').textContent = gpa;

  const tbody = document.getElementById('studentGradeTableBody');
  if (grades.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-slate-400">ยังไม่มีข้อมูลผลการเรียนในภาคเรียนนี้</td></tr>`;
    return;
  }

  tbody.innerHTML = grades.map(g => {
    let gradeBadge = 'bg-slate-100 text-slate-700';
    if (g.grade === '4' || g.grade === '3.5') gradeBadge = 'bg-emerald-100 text-emerald-800 font-bold';
    else if (g.grade === '0') gradeBadge = 'bg-red-100 text-red-700 font-bold';
    else if (g.grade === 'ร') gradeBadge = 'bg-amber-100 text-amber-700 font-bold';
    else if (g.grade === 'มส') gradeBadge = 'bg-purple-100 text-purple-700 font-bold';

    return `
      <tr class="hover:bg-slate-50/70 transition-all">
        <td class="p-3.5 font-mono text-slate-600 font-semibold">${g.courseCode}</td>
        <td class="p-3.5 font-medium text-slate-900">${g.courseName}</td>
        <td class="p-3.5 text-center font-medium">${g.credits.toFixed(1)}</td>
        <td class="p-3.5 text-center text-slate-500">${g.scoreCollect}</td>
        <td class="p-3.5 text-center text-slate-500">${g.scoreMid}</td>
        <td class="p-3.5 text-center text-slate-500">${g.scoreFinal}</td>
        <td class="p-3.5 text-center font-bold text-slate-800">${g.total}</td>
        <td class="p-3.5 text-center">
          <span class="inline-block px-3 py-1 rounded-full text-xs ${gradeBadge}">${g.grade}</span>
        </td>
        <td class="p-3.5 text-xs text-slate-600">
          ${g.status !== 'ปกติ' ? `<span class="text-red-600 font-semibold">${g.status}</span>` : '<span class="text-emerald-600">ปกติ</span>'}
          ${g.remark ? `<div class="text-slate-400 mt-0.5">${g.remark}</div>` : ''}
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function logoutStudent() {
  state.activeStudent = null;
  document.getElementById('studentResultCard').classList.add('hidden');
  document.getElementById('studentLoginContainer').classList.remove('hidden');
}

// Print Official Student Report Card (PDF Template)
function printStudentReport() {
  if (!state.activeStudent) return;
  const printable = document.getElementById('printableArea');
  const stu = state.activeStudent;
  const school = state.schoolInfo;
  const rows = document.getElementById('studentGradeTableBody').innerHTML;
  const gpa = document.getElementById('stuCardGPA').textContent;

  printable.innerHTML = `
    <div style="font-family: 'Sarabun', sans-serif; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.5;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${school.logoUrl || '/assets/logo.jpg'}" style="max-height: 75px; margin: 0 auto 8px auto; display: block;" alt="ตราโรงเรียนฝันใหม่">
        <h2 style="font-size: 22px; font-weight: bold; margin: 0;">${school.name || 'โรงเรียนฝันใหม่'}</h2>
        <p style="font-size: 14px; color: #64748b; margin: 4px 0;">${school.subTitle || 'สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)'}</p>
        <h3 style="font-size: 18px; font-weight: bold; margin-top: 10px; text-decoration: underline;">แบบรายงานผลการเรียนรายบุคคล (ปพ.6)</h3>
        <p style="font-size: 14px; margin: 4px 0;">ประจำภาคเรียนที่ ${school.term} ปีการศึกษา ${school.academicYear}</p>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
        <div>
          <div><strong>ชื่อ-สกุล:</strong> ${stu.name}</div>
          <div><strong>ระดับชั้น:</strong> ${stu.classroom} (เลขที่ ${stu.number})</div>
        </div>
        <div style="text-align: right;">
          <div><strong>รหัสนักเรียน:</strong> ${stu.id}</div>
          <div><strong>เลขประจำตัวประชาชน:</strong> ${stu.citizenId}</div>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
        <thead>
          <tr style="background: #f8fafc; border-top: 1px solid #cbd5e1; border-bottom: 2px solid #cbd5e1;">
            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">รหัสวิชา</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">รายวิชา</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">หน่วยกิต</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">คะแนนรวม</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">ระดับผลการเรียน</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">สถานะ/หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 30px;">
        <div style="border: 1px solid #cbd5e1; padding: 12px 20px; border-radius: 8px; font-size: 14px;">
          <div><strong>ผลการเรียนเฉลี่ย (GPA):</strong> <span style="font-size: 18px; font-weight: bold; color: #2563eb;">${gpa}</span></div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">* เอกสารนี้เป็นรายงานผลการเรียนอย่างไม่เป็นทางการ</div>
        </div>

        <div style="text-align: center; width: 250px;">
          <div style="height: 60px; display: flex; align-items: center; justify-content: center;">
            <img src="${school.signatureUrl || '/uploads/signatures/default_signature.png'}" style="max-height: 55px;" alt="Signature">
          </div>
          <div style="font-size: 14px; font-weight: bold;">(${school.directorName || 'ดร.วิชัย เกียรติสกุล'})</div>
          <div style="font-size: 13px; color: #64748b;">${school.directorPosition || 'ผู้อำนวยการสถานศึกษา'}</div>
        </div>
      </div>
    </div>
  `;

  window.print();
}

// Load All Grades (Admin / Teacher View)
async function loadGrades() {
  const classFilter = document.getElementById('gradeFilterClass') ? document.getElementById('gradeFilterClass').value : '';
  const statusFilter = document.getElementById('gradeFilterStatus') ? document.getElementById('gradeFilterStatus').value : '';

  let url = `/api/grades?`;
  if (classFilter) url += `classroom=${encodeURIComponent(classFilter)}&`;
  if (statusFilter) url += `statusType=${encodeURIComponent(statusFilter)}&`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    currentGradesData = data.grades || [];

    // Update Stats
    document.getElementById('statTotalGrades').textContent = data.summary.totalCount;
    document.getElementById('statZeroCount').textContent = data.summary.zeroCount;
    document.getElementById('statRCount').textContent = data.summary.rCount;
    document.getElementById('statMsCount').textContent = data.summary.msCount;
    document.getElementById('statPassCount').textContent = data.summary.passCount;

    document.getElementById('gradeRecordCount').textContent = `แสดง ${currentGradesData.length} รายการ`;

    renderAllGradesTable(currentGradesData);
  } catch (err) {
    console.error('Error loading grades:', err);
  }
}

function filterGradeStatus(type) {
  const sel = document.getElementById('gradeFilterStatus');
  if (sel) {
    sel.value = type;
    loadGrades();
  }
}

// Render All Grades Table
function renderAllGradesTable(list) {
  const tbody = document.getElementById('allGradesTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-slate-400">ไม่พบรายการผลการเรียนตามเงื่อนไขที่เลือก</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(g => {
    let gradeBadge = 'bg-slate-100 text-slate-700';
    if (g.grade === '4' || g.grade === '3.5') gradeBadge = 'bg-emerald-100 text-emerald-800 font-bold';
    else if (g.grade === '0') gradeBadge = 'bg-red-100 text-red-700 font-bold animate-pulse';
    else if (g.grade === 'ร') gradeBadge = 'bg-amber-100 text-amber-700 font-bold';
    else if (g.grade === 'มส') gradeBadge = 'bg-purple-100 text-purple-700 font-bold';

    const isProblem = ['0', 'ร', 'มส'].includes(g.grade);

    return `
      <tr class="hover:bg-slate-50 transition-all ${isProblem ? 'bg-red-50/20' : ''}">
        <td class="p-3.5 text-xs font-semibold text-slate-600">${g.classroom} / #${g.studentNumber || '-'}</td>
        <td class="p-3.5 font-medium text-slate-900">${g.studentName || '-'}</td>
        <td class="p-3.5 font-mono text-xs text-slate-500">${g.courseCode}</td>
        <td class="p-3.5 text-slate-800">${g.courseName}</td>
        <td class="p-3.5 text-center font-bold text-slate-700">${g.total}</td>
        <td class="p-3.5 text-center">
          <span class="inline-block px-2.5 py-1 rounded-full text-xs ${gradeBadge}">${g.grade}</span>
        </td>
        <td class="p-3.5 text-xs">
          <span class="${isProblem ? 'text-red-600 font-semibold' : 'text-slate-500'}">${g.status}</span>
          ${g.remark ? `<div class="text-slate-400 text-xs">${g.remark}</div>` : ''}
        </td>
        <td class="p-3.5 text-center">
          ${isProblem ? `
            <button onclick="openResolveModal('${g.id}')" class="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 mx-auto">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> แก้ 0/ร
            </button>
          ` : `
            <span class="text-slate-300 text-xs">-</span>
          `}
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

// Open Resolve Modal
function openResolveModal(gradeId) {
  selectedGradeIdForResolve = gradeId;
  const item = currentGradesData.find(g => g.id === gradeId);
  if (!item) return;

  const infoEl = document.getElementById('resolveGradeDetails');
  infoEl.innerHTML = `
    <div><strong>นักเรียน:</strong> ${item.studentName} (${item.classroom})</div>
    <div><strong>วิชา:</strong> ${item.courseName} (${item.courseCode}) | เกรดเดิม: <span class="text-red-600 font-bold">${item.grade}</span></div>
  `;

  document.getElementById('resolveStatusSelect').value = item.status;
  document.getElementById('resolveRemarkInput').value = item.remark || '';
  document.getElementById('resolveGradeSelect').value = '';

  openModal('modalResolveGrade');
}

// Save Resolve Status
async function saveGradeResolution() {
  if (!selectedGradeIdForResolve) return;
  const status = document.getElementById('resolveStatusSelect').value;
  const remark = document.getElementById('resolveRemarkInput').value;
  const newGrade = document.getElementById('resolveGradeSelect').value;

  try {
    const res = await fetch(`/api/grades/${selectedGradeIdForResolve}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, remark, newGrade: newGrade || undefined })
    });
    const result = await res.json();
    if (result.success) {
      closeModal('modalResolveGrade');
      loadGrades();
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
  }
}

// Export Problem Students PDF Report (บัญชีรายชื่อแก้ 0 ร มส)
function exportProblemStudentsPDF() {
  const problems = currentGradesData.filter(g => ['0', 'ร', 'มส'].includes(g.grade));
  if (problems.length === 0) {
    alert('ไม่มีข้อมูลนักเรียนที่ติด 0, ร, มส ตามเงื่อนไขปัจจุบัน');
    return;
  }

  const school = state.schoolInfo;
  const printable = document.getElementById('printableArea');

  printable.innerHTML = `
    <div style="font-family: 'Sarabun', sans-serif; color: #1e293b; max-width: 900px; margin: 0 auto; line-height: 1.5;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 20px; font-weight: bold; margin: 0;">${school.name}</h2>
        <h3 style="font-size: 16px; font-weight: bold; margin-top: 6px;">บัญชีรายชื่อนักเรียนที่มีผลการเรียนไม่ผ่านเกณฑ์ (ติด 0, ร, มส) เพื่อดำเนินการสอบแก้ตัว</h3>
        <p style="font-size: 13px; color: #64748b; margin: 4px 0;">ประจำภาคเรียนที่ ${school.term} ปีการศึกษา ${school.academicYear}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 24px;">
        <thead>
          <tr style="background: #f1f5f9; border-top: 1px solid #cbd5e1; border-bottom: 2px solid #cbd5e1;">
            <th style="padding: 8px; border: 1px solid #cbd5e1; width: 40px; text-align: center;">ที่</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1; width: 80px;">ห้องเรียน</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1;">ชื่อ-สกุล นักเรียน</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1;">รหัสวิชา - รายวิชา</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1; width: 50px; text-align: center;">เกรด</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1;">สถานะดำเนินการ</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1;">ลายมือชื่อครูประจำวิชา</th>
          </tr>
        </thead>
        <tbody>
          ${problems.map((p, idx) => `
            <tr>
              <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
              <td style="padding: 6px; border: 1px solid #cbd5e1;">${p.classroom}</td>
              <td style="padding: 6px; border: 1px solid #cbd5e1; font-weight: 600;">${p.studentName}</td>
              <td style="padding: 6px; border: 1px solid #cbd5e1;">${p.courseCode} ${p.courseName}</td>
              <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; color: #dc2626; font-weight: bold;">${p.grade}</td>
              <td style="padding: 6px; border: 1px solid #cbd5e1;">${p.status}</td>
              <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; height: 32px;"></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-top: 30px;">
        <div style="text-align: center; width: 250px;">
          <div>ลงชื่อ......................................................</div>
          <div style="margin-top: 4px;">(นางสาวนฤมล บุญประเสริฐ)</div>
          <div style="color: #64748b; font-size: 12px;">หัวหน้าฝ่ายบริหารงานวิชาการ</div>
        </div>
        <div style="text-align: center; width: 250px;">
          <div>ลงชื่อ......................................................</div>
          <div style="margin-top: 4px;">(${school.directorName})</div>
          <div style="color: #64748b; font-size: 12px;">${school.directorPosition}</div>
        </div>
      </div>
    </div>
  `;

  window.print();
}
