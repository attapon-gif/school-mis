const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

console.log('Original index.html length:', content.length);

// 1. Replace DEFAULT_SYSTEM_USERS with DONGSAWAN_STUDENT_USERS + DEFAULT_STAFF_USERS + DEFAULT_SYSTEM_USERS
const targetOldUsersStart = `    // =========================================================================
    // USER ACCOUNTS & PERMISSION MATRIX LOGIC (ระบบกำหนดสิทธิ์และจัดการผู้ใช้งาน)
    // =========================================================================
    const DEFAULT_SYSTEM_USERS = [`;

const targetOldUsersEnd = `    ];

    const DEFAULT_ROLE_PERMISSIONS = {`;

const startIdx = content.indexOf(targetOldUsersStart);
const endIdx = content.indexOf(targetOldUsersEnd, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find DEFAULT_SYSTEM_USERS block!', { startIdx, endIdx });
  process.exit(1);
}

// Extract old staff users (from startIdx to endIdx)
const oldBlock = content.substring(startIdx + targetOldUsersStart.length, endIdx);

// Build new block
const newBlock = `    // =========================================================================
    // USER ACCOUNTS & PERMISSION MATRIX LOGIC (ระบบกำหนดสิทธิ์และจัดการผู้ใช้งาน)
    // =========================================================================
    const DONGSAWAN_STUDENT_USERS = (typeof DONGSAWAN_346_STUDENTS_TUPLES !== 'undefined' ? DONGSAWAN_346_STUDENTS_TUPLES : []).map(t => {
      const [stuId, citId, title, fname, lname, gender, room, num] = t;
      const shortTitle = title === 'เด็กชาย' ? 'ด.ช.' : (title === 'เด็กหญิง' ? 'ด.ญ.' : title);
      let classFullText = room;
      if (room.startsWith('ม.')) classFullText = 'ชั้นมัธยมศึกษาปีที่ ' + room.replace('ม.', '');
      else if (room.startsWith('ป.')) classFullText = 'ชั้นประถมศึกษาปีที่ ' + room.replace('ป.', '');
      else if (room.startsWith('อ.')) classFullText = 'ชั้นอนุบาล ' + room.replace('อ.', '');

      return {
        id: 'STU_' + stuId,
        username: String(stuId),
        password: String(stuId),
        name: \`\${shortTitle}\${fname} \${lname}\`,
        role: 'student',
        position: \`นักเรียนชั้น \${room} เลขที่ \${num}\`,
        dept: classFullText,
        phone: '',
        studentId: String(stuId),
        citizenId: String(citId),
        avatarIcon: 'user-check',
        status: 'active'
      };
    });

    const DEFAULT_STAFF_USERS = [` + oldBlock + `    ];

    const DEFAULT_SYSTEM_USERS = [
      ...DEFAULT_STAFF_USERS,
      ...DONGSAWAN_STUDENT_USERS
    ];

    const DEFAULT_ROLE_PERMISSIONS = {`;

content = content.substring(0, startIdx) + newBlock + content.substring(endIdx + targetOldUsersEnd.length);
console.log('Updated DEFAULT_SYSTEM_USERS definition successfully.');

// 2. Update initUserManagementState condition
const oldInit = `    function initUserManagementState() {
      if (!state.users || state.users.length < 20 || !state.users.some(u => u.username === 'supak')) {
        try {
          const stored = localStorage.getItem('fm_system_users');
          let parsed = stored ? JSON.parse(stored) : null;
          if (parsed && Array.isArray(parsed) && parsed.length >= DEFAULT_SYSTEM_USERS.length && parsed.some(u => u.username === 'supak')) {
            state.users = parsed;
          } else {
            state.users = JSON.parse(JSON.stringify(DEFAULT_SYSTEM_USERS));
            localStorage.setItem('fm_system_users', JSON.stringify(state.users));
          }
        } catch (e) {
          state.users = JSON.parse(JSON.stringify(DEFAULT_SYSTEM_USERS));
        }
      }`;

const newInit = `    function initUserManagementState() {
      if (!state.users || state.users.length < 350 || !state.users.some(u => u.role === 'student' && u.username && u.username.length === 4)) {
        try {
          const stored = localStorage.getItem('fm_system_users');
          let parsed = stored ? JSON.parse(stored) : null;
          if (parsed && Array.isArray(parsed) && parsed.length >= DEFAULT_SYSTEM_USERS.length && parsed.some(u => u.role === 'student' && u.username && u.username.length === 4)) {
            state.users = parsed;
          } else {
            state.users = JSON.parse(JSON.stringify(DEFAULT_SYSTEM_USERS));
            localStorage.setItem('fm_system_users', JSON.stringify(state.users));
          }
        } catch (e) {
          state.users = JSON.parse(JSON.stringify(DEFAULT_SYSTEM_USERS));
        }
      }`;

if (!content.includes(oldInit)) {
  console.error('Could not find oldInit string in index.html');
  process.exit(1);
}
content = content.replace(oldInit, newInit);
console.log('Updated initUserManagementState successfully.');

// 3. Update handleManualLogin to handle student role properly
const oldManualLogin = `      let acc = matchedUser || SYSTEM_ACCOUNTS[role] || SYSTEM_ACCOUNTS.admin;
      let userObj = {
        ...acc,
        username: username,
        isLoggedIn: true,
        loginTime: new Date().toLocaleString('th-TH')
      };

      if (role === 'director') {
        userObj.name = state.schoolInfo.directorName || 'นางรัษฎาภรณ์ ศิริมาตย์';
        userObj.position = state.schoolInfo.directorPosition || 'ผู้อำนวยการโรงเรียนดงสวรรค์วิทยา';
      } else if (role === 'student') {
        const found = DEFAULT_MOCK_DATA.students.find(s => s.id === username || s.citizenId === username) || DEFAULT_MOCK_DATA.students[0];
        if (found) {
          userObj.name = found.name;
          userObj.studentId = found.id;
          userObj.position = \`\${found.classroom} เลขที่ \${found.number}\`;
        }
      } else if (role === 'teacher') {`;

const newManualLogin = `      const effectiveRole = matchedUser ? matchedUser.role : role;
      let acc = matchedUser || SYSTEM_ACCOUNTS[effectiveRole] || SYSTEM_ACCOUNTS.admin;
      let userObj = {
        ...acc,
        role: effectiveRole,
        username: username,
        isLoggedIn: true,
        loginTime: new Date().toLocaleString('th-TH')
      };

      if (effectiveRole === 'director') {
        userObj.name = state.schoolInfo.directorName || 'นางรัษฎาภรณ์ ศิริมาตย์';
        userObj.position = state.schoolInfo.directorPosition || 'ผู้อำนวยการโรงเรียนดงสวรรค์วิทยา';
      } else if (effectiveRole === 'student') {
        const stuId = matchedUser ? (matchedUser.studentId || matchedUser.username) : username;
        userObj.role = 'student';
        userObj.studentId = stuId;
        const allStudents = (state.students && state.students.length > 0) ? state.students : (DEFAULT_MOCK_DATA.students || []);
        const found = allStudents.find(s => String(s.studentId || s.id) === String(stuId) || String(s.citizenId) === String(stuId));
        if (found) {
          userObj.name = found.name;
          userObj.studentId = found.studentId || found.id;
          userObj.position = \`\${found.classroom} เลขที่ \${found.number}\`;
          userObj.dept = found.classroom;
        } else if (matchedUser) {
          userObj.name = matchedUser.name;
          userObj.studentId = matchedUser.studentId || stuId;
          userObj.position = matchedUser.position;
        }
      } else if (effectiveRole === 'teacher') {`;

if (!content.includes(oldManualLogin)) {
  console.error('Could not find oldManualLogin string in index.html');
  process.exit(1);
}
content = content.replace(oldManualLogin, newManualLogin);
console.log('Updated handleManualLogin successfully.');

// 4. Update handleLoginRoleChange to set username & password for student
const oldRoleChange = `    function handleLoginRoleChange(role) {
      const uInput = document.getElementById('loginUsername');
      if (!uInput) return;
      if (role === 'admin') uInput.value = 'admin';
      else if (role === 'director') uInput.value = 'director';
      else if (role === 'teacher') uInput.value = 'teacher';
      else if (role === 'student') uInput.value = '6517';
    }`;

const newRoleChange = `    function handleLoginRoleChange(role) {
      const uInput = document.getElementById('loginUsername');
      const pInput = document.getElementById('loginPassword');
      if (!uInput) return;
      if (role === 'admin') { uInput.value = 'admin'; if (pInput) pInput.value = 'admin'; }
      else if (role === 'director') { uInput.value = 'director'; if (pInput) pInput.value = '1234'; }
      else if (role === 'teacher') { uInput.value = 'teacher'; if (pInput) pInput.value = '1234'; }
      else if (role === 'student') { uInput.value = '5863'; if (pInput) pInput.value = '5863'; }
    }`;

if (!content.includes(oldRoleChange)) {
  console.error('Could not find oldRoleChange in index.html');
  process.exit(1);
}
content = content.replace(oldRoleChange, newRoleChange);
console.log('Updated handleLoginRoleChange successfully.');

// 5. Update handleStudentLogin to accept 4-digit studentId as password
const oldStuLoginCond = `const localStu = (DEFAULT_MOCK_DATA.students || []).find(s =>
        String(s.id).toLowerCase() === studentId.toLowerCase() &&
        (!citizenId || String(s.citizenId) === citizenId)
      ) || (DEFAULT_MOCK_DATA.students || []).find(s => String(s.id).toLowerCase() === studentId.toLowerCase());`;

const newStuLoginCond = `const localStu = (DEFAULT_MOCK_DATA.students || []).find(s =>
        String(s.id).toLowerCase() === studentId.toLowerCase() &&
        (!citizenId || citizenId === studentId || String(s.citizenId) === citizenId)
      ) || (DEFAULT_MOCK_DATA.students || []).find(s => String(s.id).toLowerCase() === studentId.toLowerCase());`;

if (!content.includes(oldStuLoginCond)) {
  console.error('Could not find oldStuLoginCond in index.html');
  process.exit(1);
}
content = content.replace(oldStuLoginCond, newStuLoginCond);
console.log('Updated handleStudentLogin condition successfully.');

// 6. Update selectFilterUserRole dropdown in tab-admin to include Student option
const oldRoleFilter = `<select id="selectFilterUserRole" onchange="filterUsersList()" class="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-700 font-bold outline-none focus:border-blue-600">
              <option value="all">ทุกระดับสิทธิ์ (All Roles)</option>
              <option value="admin">🛡️ ผู้ดูแลระบบ (Admin)</option>
              <option value="director">🎓 ผู้อำนวยการ (Director)</option>
              <option value="academic">📘 หัวหน้างานวิชาการ (Academic Head)</option>
              <option value="registrar">📋 นายทะเบียนวัดผล (Registrar)</option>
              <option value="teacher">👨‍🏫 ครูผู้สอน (Teacher)</option>
              <option value="supervisor">🔍 ผู้นิเทศภายใน (Supervisor)</option>
            </select>`;

const newRoleFilter = `<select id="selectFilterUserRole" onchange="filterUsersList()" class="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-700 font-bold outline-none focus:border-blue-600">
              <option value="all">ทุกระดับสิทธิ์ (All Roles)</option>
              <option value="admin">🛡️ ผู้ดูแลระบบ (Admin)</option>
              <option value="director">🎓 ผู้อำนวยการ (Director)</option>
              <option value="academic">📘 หัวหน้างานวิชาการ (Academic Head)</option>
              <option value="registrar">📋 นายทะเบียนวัดผล (Registrar)</option>
              <option value="teacher">👨‍🏫 ครูผู้สอน (Teacher)</option>
              <option value="supervisor">🔍 ผู้นิเทศภายใน (Supervisor)</option>
              <option value="student">🎒 นักเรียน (Student 346 คน)</option>
            </select>`;

if (content.includes(oldRoleFilter)) {
  content = content.replace(oldRoleFilter, newRoleFilter);
  console.log('Updated selectFilterUserRole successfully.');
}

// 7. Update student login hints in UI
const oldStuHint = `placeholder="เช่น 6517 หรือ 6528" value="6517"`;
const newStuHint = `placeholder="เช่น 5863, 6588 หรือ 6517" value="5863"`;
if (content.includes(oldStuHint)) {
  content = content.replace(oldStuHint, newStuHint);
}

const oldStuPassHint = `placeholder="เลขบัตร ปชช. 13 หลัก" value="1399900430838"`;
const newStuPassHint = `placeholder="รหัสผ่านเลข 4 หลัก หรือ เลขบัตร ปชช." value="5863"`;
if (content.includes(oldStuPassHint)) {
  content = content.replace(oldStuPassHint, newStuPassHint);
}

const oldLabelPass = `<label class="block text-xs font-bold text-slate-700 mb-1.5 uppercase">เลขบัตรประชาชน 13 หลัก</label>`;
const newLabelPass = `<label class="block text-xs font-bold text-slate-700 mb-1.5 uppercase">รหัสผ่าน (เลขประจำตัว 4 หลัก หรือ เลขบัตร ปชช.)</label>`;
if (content.includes(oldLabelPass)) {
  content = content.replace(oldLabelPass, newLabelPass);
}

// 8. Update Login modal placeholders
const oldModalUser = `placeholder="กรอกชื่อผู้ใช้ เช่น admin, director, teacher"`;
const newModalUser = `placeholder="กรอกชื่อผู้ใช้ หรือเลขประจำตัวนักเรียน 4 หลัก"`;
if (content.includes(oldModalUser)) {
  content = content.replace(oldModalUser, newModalUser);
}

const oldModalPassHint = `<span class="text-[10px] text-blue-600">ค่าเริ่มต้น: 1234</span>`;
const newModalPassHint = `<span class="text-[10px] text-blue-600">นักเรียน: เลข 4 หลัก / บุคลากร: 1234</span>`;
if (content.includes(oldModalPassHint)) {
  content = content.replace(oldModalPassHint, newModalPassHint);
}

// Save back to index.html
fs.writeFileSync('index.html', content, 'utf8');
console.log('Saved index.html successfully! New length:', content.length);
