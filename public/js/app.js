// Global App State
const state = {
  currentRole: 'admin',
  currentTab: 'tab-grades',
  schoolInfo: {},
  teachers: [],
  classrooms: [],
  rooms: [],
  periods: [],
  days: [],
  activeStudent: null
};

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  if (window.lucide) lucide.createIcons();
  await loadSystemInfo();
  
  // Initialize Modules
  if (typeof initGradesModule === 'function') initGradesModule();
  if (typeof initPlansModule === 'function') initPlansModule();
  if (typeof initSupervisionModule === 'function') initSupervisionModule();
  if (typeof initTimetableModule === 'function') initTimetableModule();
  
  // Set default role
  switchRole('admin');
});

// Load system info from backend
async function loadSystemInfo() {
  try {
    const res = await fetch('/api/info');
    const data = await res.json();
    state.schoolInfo = data.schoolInfo || {};
    state.teachers = data.teachers || [];
    state.classrooms = data.classrooms || [];
    state.rooms = data.rooms || [];
    state.periods = data.periods || [];
    state.days = data.days || [];

    // Update Header
    document.getElementById('headerSchoolName').textContent = state.schoolInfo.name || 'โรงเรียนฝันใหม่';
    document.getElementById('headerTermYear').textContent = `ภาคเรียนที่ ${state.schoolInfo.term}/${state.schoolInfo.academicYear}`;

    // Update Settings Fields
    if (document.getElementById('settingSchoolName')) {
      document.getElementById('settingSchoolName').value = state.schoolInfo.name || '';
      document.getElementById('settingSubTitle').value = state.schoolInfo.subTitle || '';
      document.getElementById('settingAcademicYear').value = state.schoolInfo.academicYear || '';
      document.getElementById('settingTerm').value = state.schoolInfo.term || '';
      document.getElementById('settingDirectorName').value = state.schoolInfo.directorName || '';
      document.getElementById('settingDirectorPosition').value = state.schoolInfo.directorPosition || '';
      if (state.schoolInfo.signatureUrl) {
        document.getElementById('settingSignaturePreview').src = state.schoolInfo.signatureUrl;
      }
    }

    populateCommonDropdowns();
  } catch (err) {
    console.error('Error loading system info:', err);
  }
}

// Populate common dropdowns across modals
function populateCommonDropdowns() {
  const teacherDropdowns = ['planTeacherSelect', 'supvTeacherSelect', 'ttTeacherSelect', 'subAbsentTeacher'];
  teacherDropdowns.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = state.teachers.map(t => `<option value="${t.id}">${t.name} (${t.subject})</option>`).join('');
  });

  const classDropdowns = ['planClassSelect', 'supvClassSelect', 'ttClassroomSelect', 'subClassroom'];
  classDropdowns.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = state.classrooms.map(c => `<option value="${c}">${c}</option>`).join('');
  });

  const roomDropdowns = ['ttRoomSelect'];
  roomDropdowns.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = state.rooms.map(r => `<option value="${r}">${r}</option>`).join('');
  });
}

// Role Switcher
function switchRole(role) {
  state.currentRole = role;
  
  // Update button highlights
  ['admin', 'teacher', 'director', 'student'].forEach(r => {
    const btn = document.getElementById(`roleBtn-${r}`);
    if (!btn) return;
    if (r === role) {
      btn.className = 'px-3 py-1.5 rounded-lg transition-all bg-white text-blue-600 shadow-sm font-semibold';
    } else {
      btn.className = 'px-3 py-1.5 rounded-lg transition-all text-slate-600 hover:text-slate-900';
    }
  });

  // Role visibility logic
  const studentLoginContainer = document.getElementById('studentLoginContainer');
  const studentResultCard = document.getElementById('studentResultCard');
  const adminGradeView = document.getElementById('adminGradeView');

  if (role === 'student') {
    switchTab('tab-grades');
    adminGradeView.classList.add('hidden');
    if (state.activeStudent) {
      studentLoginContainer.classList.add('hidden');
      studentResultCard.classList.remove('hidden');
    } else {
      studentLoginContainer.classList.remove('hidden');
      studentResultCard.classList.add('hidden');
    }
  } else {
    studentLoginContainer.classList.add('hidden');
    studentResultCard.classList.add('hidden');
    adminGradeView.classList.remove('hidden');
  }

  // Refresh lucide icons
  if (window.lucide) lucide.createIcons();
}

// Tab Switcher
function switchTab(tabId) {
  state.currentTab = tabId;

  // Tabs content visibility
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.add('hidden');
  });
  const target = document.getElementById(tabId);
  if (target) target.classList.remove('hidden');

  // Nav buttons styling
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.className = 'nav-tab flex items-center gap-2 py-3 px-3 text-sm font-medium border-b-2 border-transparent text-slate-600 hover:text-slate-900 transition-all';
  });
  const navBtnId = 'nav-' + tabId.replace('tab-', '');
  const activeNavBtn = document.getElementById(navBtnId);
  if (activeNavBtn) {
    activeNavBtn.className = 'nav-tab active-tab flex items-center gap-2 py-3 px-3 text-sm font-semibold border-b-2 border-blue-600 text-blue-600 transition-all';
  }

  // Auto trigger reloads per tab
  if (tabId === 'tab-grades') loadGrades();
  if (tabId === 'tab-plans') loadLessonPlans();
  if (tabId === 'tab-supervision') loadSupervisions();
  if (tabId === 'tab-timetable') {
    renderTimetableGrid();
    loadSubstitutes();
  }

  if (window.lucide) lucide.createIcons();
}

// Modal Helpers
function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) {
    el.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  }
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add('hidden');
}

// Save Settings Form
async function handleSaveSettings(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('settingSchoolName').value,
    subTitle: document.getElementById('settingSubTitle').value,
    academicYear: document.getElementById('settingAcademicYear').value,
    term: document.getElementById('settingTerm').value,
    directorName: document.getElementById('settingDirectorName').value,
    directorPosition: document.getElementById('settingDirectorPosition').value
  };

  // Check if signature file uploaded
  const sigInput = document.getElementById('settingSignatureInput');
  if (sigInput && sigInput.files.length > 0) {
    const formData = new FormData();
    formData.append('signature', sigInput.files[0]);
    try {
      const uploadRes = await fetch('/api/upload/signature', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      if (uploadData.url) payload.signatureUrl = uploadData.url;
    } catch (err) {
      console.error('Signature upload error:', err);
    }
  }

  try {
    const res = await fetch('/api/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      alert('บันทึกการตั้งค่าข้อมูลสถานศึกษาและลายเซ็นเรียบร้อยแล้ว!');
      await loadSystemInfo();
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า');
  }
}
