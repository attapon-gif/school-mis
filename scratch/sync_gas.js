const fs = require('fs');

let content = fs.readFileSync('google-apps-script/Index.html', 'utf8');

const targetOldUsersStart = `    // =========================================================================
    // USER ACCOUNTS & PERMISSION MATRIX LOGIC (ระบบกำหนดสิทธิ์และจัดการผู้ใช้งาน)
    // =========================================================================
    const DEFAULT_SYSTEM_USERS = [`;

const targetOldUsersEnd = `    ];

    const DEFAULT_ROLE_PERMISSIONS = {`;

const startIdx = content.indexOf(targetOldUsersStart);
const endIdx = content.indexOf(targetOldUsersEnd, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const oldBlock = content.substring(startIdx + targetOldUsersStart.length, endIdx);
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

  if (content.includes(oldInit)) {
    content = content.replace(oldInit, newInit);
  }

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

  if (content.includes(oldManualLogin)) {
    content = content.replace(oldManualLogin, newManualLogin);
  }

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

  if (content.includes(oldRoleChange)) {
    content = content.replace(oldRoleChange, newRoleChange);
  }

  const oldStuLoginCond = `const localStu = (DEFAULT_MOCK_DATA.students || []).find(s =>
        String(s.id).toLowerCase() === studentId.toLowerCase() &&
        (!citizenId || String(s.citizenId) === citizenId)
      ) || (DEFAULT_MOCK_DATA.students || []).find(s => String(s.id).toLowerCase() === studentId.toLowerCase());`;

  const newStuLoginCond = `const localStu = (DEFAULT_MOCK_DATA.students || []).find(s =>
        String(s.id).toLowerCase() === studentId.toLowerCase() &&
        (!citizenId || citizenId === studentId || String(s.citizenId) === citizenId)
      ) || (DEFAULT_MOCK_DATA.students || []).find(s => String(s.id).toLowerCase() === studentId.toLowerCase());`;

  if (content.includes(oldStuLoginCond)) {
    content = content.replace(oldStuLoginCond, newStuLoginCond);
  }

  fs.writeFileSync('google-apps-script/Index.html', content, 'utf8');
  console.log('google-apps-script/Index.html updated successfully!');
}
