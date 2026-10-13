const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// 1. Remove the password hint and clear pre-filled password
const oldPasswordBlock = `        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="block text-xs font-bold text-slate-700">รหัสผ่าน (Password)</label>
            <span class="text-[10px] text-blue-600">นักเรียน: เลข 4 หลัก / บุคลากร: 1234</span>
          </div>
          <div class="relative">
            <input type="password" id="loginPassword" required value="1234" placeholder="กรอกรหัสผ่าน" class="w-full pl-9 pr-9 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500">
            <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
            <button type="button" onclick="togglePasswordVisibility('loginPassword', 'loginEyeIcon')" class="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
              <i data-lucide="eye" id="loginEyeIcon" class="w-4 h-4"></i>
            </button>
          </div>
        </div>`;

const newPasswordBlock = `        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">รหัสผ่าน (Password)</label>
          <div class="relative">
            <input type="password" id="loginPassword" required value="" placeholder="กรอกรหัสผ่าน" class="w-full pl-9 pr-9 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500">
            <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
            <button type="button" onclick="togglePasswordVisibility('loginPassword', 'loginEyeIcon')" class="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
              <i data-lucide="eye" id="loginEyeIcon" class="w-4 h-4"></i>
            </button>
          </div>
        </div>`;

if (!content.includes(oldPasswordBlock)) {
  console.error('Could not find oldPasswordBlock!');
  process.exit(1);
}
content = content.replace(oldPasswordBlock, newPasswordBlock);
console.log('1. Removed password hint successfully.');

// Also make loginUsername default value empty so placeholder is visible cleanly
const oldUserField = `<input type="text" id="loginUsername" required value="admin" placeholder="กรอกชื่อผู้ใช้ หรือเลขประจำตัวนักเรียน 4 หลัก"`;
const newUserField = `<input type="text" id="loginUsername" required value="" placeholder="กรอกชื่อผู้ใช้ หรือเลขประจำตัวนักเรียน 4 หลัก"`;
if (content.includes(oldUserField)) {
  content = content.replace(oldUserField, newUserField);
  console.log('Cleaned loginUsername value.');
}

// 2. Remove 1-Click Quick Demo Accounts
const target2_start = `      <!-- 1-Click Quick Demo Accounts -->`;
const target2_end = `      <!-- Footer Info -->`;

const idx2_start = content.indexOf(target2_start);
const idx2_end = content.indexOf(target2_end);

if (idx2_start === -1 || idx2_end === -1) {
  console.error('Could not find 1-Click Quick Demo Accounts block!');
  process.exit(1);
}

content = content.substring(0, idx2_start) + content.substring(idx2_end);
console.log('2. Removed 1-Click Quick Demo Accounts block successfully.');

// 3. Update handleLoginRoleChange so it does not auto-fill passwords
const oldRoleChange = `    function handleLoginRoleChange(role) {
      const uInput = document.getElementById('loginUsername');
      const pInput = document.getElementById('loginPassword');
      if (!uInput) return;
      if (role === 'admin') { uInput.value = 'admin'; if (pInput) pInput.value = 'admin'; }
      else if (role === 'director') { uInput.value = 'director'; if (pInput) pInput.value = '1234'; }
      else if (role === 'teacher') { uInput.value = 'teacher'; if (pInput) pInput.value = '1234'; }
      else if (role === 'student') { uInput.value = '5863'; if (pInput) pInput.value = '5863'; }
    }`;

const newRoleChange = `    function handleLoginRoleChange(role) {
      const uInput = document.getElementById('loginUsername');
      const pInput = document.getElementById('loginPassword');
      if (!uInput) return;
      if (pInput) pInput.value = '';
      if (role === 'admin') { uInput.value = 'admin'; }
      else if (role === 'director') { uInput.value = 'director'; }
      else if (role === 'teacher') { uInput.value = 'teacher'; }
      else if (role === 'student') { uInput.value = ''; }
    }`;

if (content.includes(oldRoleChange)) {
  content = content.replace(oldRoleChange, newRoleChange);
  console.log('3. Updated handleLoginRoleChange.');
}

fs.writeFileSync('index.html', content, 'utf8');
console.log('Saved index.html successfully!');
