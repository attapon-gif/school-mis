const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// 1. Add pagination HTML container right after userTableBody's </table></div>
const oldTableBlock = `              <tbody id="userTableBody" class="divide-y divide-slate-100 font-medium text-slate-800">
                <!-- Dynamically populated -->
              </tbody>
            </table>
          </div>
        </div>
      </div>`;

const newTableBlock = `              <tbody id="userTableBody" class="divide-y divide-slate-100 font-medium text-slate-800">
                <!-- Dynamically populated -->
              </tbody>
            </table>
          </div>

          <!-- Pagination Bar for User Management -->
          <div id="userPaginationBar" class="p-3.5 sm:px-5 bg-slate-50/90 border-t border-slate-200/90 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div class="flex flex-wrap items-center gap-2.5 text-slate-600 font-medium">
              <span class="font-bold text-slate-700">แสดงผล:</span>
              <select id="userPageSizeSelect" onchange="changeUserPageSize(this.value)" class="px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-600 shadow-sm cursor-pointer">
                <option value="15">15 รายการ/หน้า</option>
                <option value="25" selected>25 รายการ/หน้า</option>
                <option value="50">50 รายการ/หน้า</option>
                <option value="100">100 รายการ/หน้า</option>
                <option value="all">แสดงทั้งหมด</option>
              </select>
              <span class="text-slate-300">|</span>
              <span id="userPaginationInfo" class="font-bold text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-xs">
                แสดง 1 - 25 จากทั้งหมด 378 บัญชี
              </span>
            </div>

            <!-- Page Navigation Buttons -->
            <div id="userPaginationControls" class="flex flex-wrap items-center gap-1 justify-center">
              <!-- Dynamically rendered page buttons -->
            </div>
          </div>
        </div>
      </div>`;

if (!content.includes(oldTableBlock)) {
  console.error('Could not find oldTableBlock');
  process.exit(1);
}
content = content.replace(oldTableBlock, newTableBlock);
console.log('1. Added userPaginationBar HTML successfully.');

// 2. Replace renderUserManagementTable and filterUsersList with paginated versions
const funcStartTarget = 'function renderUserManagementTable() {';
const funcEndTarget = 'function renderRolePermissionMatrix() {';

const idxStart = content.indexOf(funcStartTarget);
const idxEnd = content.indexOf(funcEndTarget, idxStart);

if (idxStart === -1 || idxEnd === -1) {
  console.error('Could not find renderUserManagementTable boundaries');
  process.exit(1);
}

const newFunctions = `function renderUserManagementTable() {
      initUserManagementState();
      const tbody = document.getElementById('userTableBody');
      if (!tbody) return;

      if (!state.userPagination) {
        state.userPagination = {
          currentPage: 1,
          pageSize: 25
        };
      }

      const searchTerm = (document.getElementById('inputSearchUser')?.value || '').trim().toLowerCase();
      const roleFilter = document.getElementById('selectFilterUserRole')?.value || 'all';

      const filtered = state.users.filter(u => {
        const matchSearch = !searchTerm || 
          (u.name && u.name.toLowerCase().includes(searchTerm)) ||
          (u.username && u.username.toLowerCase().includes(searchTerm)) ||
          (u.position && u.position.toLowerCase().includes(searchTerm)) ||
          (u.dept && u.dept.toLowerCase().includes(searchTerm));
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        return matchSearch && matchRole;
      });

      // Update stats
      const elTotal = document.getElementById('statTotalUsers');
      const elExec = document.getElementById('statExecUsers');
      const elTeacher = document.getElementById('statTeacherUsers');
      if (elTotal) elTotal.textContent = state.users.length;
      if (elExec) elExec.textContent = state.users.filter(u => ['admin', 'director', 'academic'].includes(u.role)).length;
      if (elTeacher) elTeacher.textContent = state.users.filter(u => ['teacher', 'registrar'].includes(u.role)).length;

      const paginationBar = document.getElementById('userPaginationBar');

      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-slate-400 font-semibold">ไม่พบข้อมูลบัญชีผู้ใช้ที่ค้นหา</td></tr>';
        if (paginationBar) paginationBar.classList.add('hidden');
        return;
      }
      if (paginationBar) paginationBar.classList.remove('hidden');

      // Pagination calculation
      const rawPageSize = state.userPagination.pageSize || 25;
      const actualPageSize = rawPageSize === 'all' ? filtered.length : parseInt(rawPageSize, 10);
      const totalPages = Math.ceil(filtered.length / actualPageSize) || 1;

      if (state.userPagination.currentPage > totalPages) {
        state.userPagination.currentPage = totalPages;
      }
      if (state.userPagination.currentPage < 1) {
        state.userPagination.currentPage = 1;
      }

      const curPage = state.userPagination.currentPage;
      const startIdx = (curPage - 1) * actualPageSize;
      const endIdx = Math.min(startIdx + actualPageSize, filtered.length);
      const pagedUsers = filtered.slice(startIdx, endIdx);

      tbody.innerHTML = pagedUsers.map(u => {
        const roleDef = state.rolePermissions[u.role] || { title: u.role, badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' };
        const isActive = u.status === 'active';
        return \`
          <tr class="hover:bg-blue-50/40 transition border-b border-slate-100">
            <td class="p-3.5 sm:px-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  <i data-lucide="\${u.avatarIcon || 'user'}" class="w-4 h-4"></i>
                </div>
                <div>
                  <div class="font-bold text-slate-900">\${u.name}</div>
                  <div class="text-[11px] text-slate-500">\${u.position || '-'}</div>
                </div>
              </div>
            </td>
            <td class="p-3.5 sm:px-4">
              <div class="font-mono font-bold text-slate-900">\${u.username}</div>
              <div class="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <span>รหัสผ่าน:</span>
                <span class="bg-slate-100 px-1.5 py-0.2 rounded font-bold text-slate-600">\${u.password || '1234'}</span>
              </div>
            </td>
            <td class="p-3.5 sm:px-4">
              <span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border \${roleDef.badgeColor}">
                \${roleDef.title}
              </span>
            </td>
            <td class="p-3.5 sm:px-4 text-slate-600">
              <div>\${u.dept || '-'}</div>
              <div class="text-[11px] text-slate-400">\${u.phone || ''}</div>
            </td>
            <td class="p-3.5 sm:px-4 text-center">
              <button type="button" onclick="toggleUserStatus('\${u.id}')" title="คลิกเพื่อเปิด/ปิดใช้งาน" class="cursor-pointer">
                \${isActive 
                  ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">🟢 ใช้งานปกติ</span>' 
                  : '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200">🔴 ระงับ</span>'}
              </button>
            </td>
            <td class="p-3.5 sm:px-4 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button type="button" onclick="quickSwitchToUser('\${u.id}')" title="เข้าสู่ระบบด้วยบัญชีนี้ทันที" class="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold transition flex items-center gap-1 text-[11px]">
                  <i data-lucide="log-in" class="w-3.5 h-3.5"></i> สลับเข้า
                </button>
                <button type="button" onclick="openModalAddUser('\${u.id}')" title="แก้ไขข้อมูล/สิทธิ์" class="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition">
                  <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                </button>
                <button type="button" onclick="deleteUser('\${u.id}')" title="ลบบัญชีนี้" class="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </td>
          </tr>
        \`;
      }).join('');

      // Update info text
      const infoEl = document.getElementById('userPaginationInfo');
      if (infoEl) {
        if (rawPageSize === 'all') {
          infoEl.textContent = \`แสดงทั้งหมด \${filtered.length} บัญชี\`;
        } else {
          infoEl.textContent = \`แสดง \${startIdx + 1} - \${endIdx} จากทั้งหมด \${filtered.length} บัญชี (หน้า \${curPage}/\${totalPages})\`;
        }
      }

      // Sync select dropdown
      const selPageSize = document.getElementById('userPageSizeSelect');
      if (selPageSize && selPageSize.value !== String(rawPageSize)) {
        selPageSize.value = String(rawPageSize);
      }

      // Render pagination buttons
      renderUserPaginationControls(filtered.length, curPage, rawPageSize);

      if (window.lucide && typeof lucide.createIcons === 'function') {
        try { lucide.createIcons(); } catch (e) {}
      }
    }

    function goToUserPage(page) {
      if (!state.userPagination) state.userPagination = { currentPage: 1, pageSize: 25 };
      state.userPagination.currentPage = page;
      renderUserManagementTable();
      const tableWrapper = document.getElementById('userTableBody');
      if (tableWrapper) {
        const rect = tableWrapper.getBoundingClientRect();
        if (rect.top < 0 || rect.top > window.innerHeight) {
          tableWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    function changeUserPageSize(size) {
      if (!state.userPagination) state.userPagination = { currentPage: 1, pageSize: 25 };
      state.userPagination.pageSize = size;
      state.userPagination.currentPage = 1;
      renderUserManagementTable();
    }

    function renderUserPaginationControls(totalItems, currentPage, pageSize) {
      const container = document.getElementById('userPaginationControls');
      if (!container) return;
      if (totalItems <= 0 || pageSize === 'all') {
        container.innerHTML = '';
        return;
      }

      const actualPageSize = parseInt(pageSize, 10);
      const totalPages = Math.ceil(totalItems / actualPageSize) || 1;
      if (totalPages <= 1) {
        container.innerHTML = '';
        return;
      }

      let html = '';

      // First & Prev buttons
      const isFirst = currentPage <= 1;
      html += \`
        <button type="button" onclick="goToUserPage(1)" \${isFirst ? 'disabled' : ''} class="h-8 px-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 \${isFirst ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-xs cursor-pointer'}" title="หน้าแรก">
          <i data-lucide="chevrons-left" class="w-3.5 h-3.5"></i>
        </button>
        <button type="button" onclick="goToUserPage(\${currentPage - 1})" \${isFirst ? 'disabled' : ''} class="h-8 px-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 \${isFirst ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-xs cursor-pointer'}" title="หน้าก่อนหน้า">
          <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i> <span class="hidden sm:inline">ก่อนหน้า</span>
        </button>
      \`;

      // Smart range
      const delta = 2;
      const range = [];
      const rangeWithDots = [];
      let l;

      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
          range.push(i);
        }
      }

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }

      for (const p of rangeWithDots) {
        if (p === '...') {
          html += \`<span class="px-1.5 py-1 text-slate-400 text-xs font-black">...</span>\`;
        } else {
          const isActive = p === currentPage;
          html += \`
            <button type="button" onclick="goToUserPage(\${p})" class="min-w-[32px] h-8 px-2.5 rounded-xl border text-xs font-black transition shadow-xs cursor-pointer \${isActive ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200 ring-2 ring-blue-300' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}">
              \${p}
            </button>
          \`;
        }
      }

      // Next & Last buttons
      const isLast = currentPage >= totalPages;
      html += \`
        <button type="button" onclick="goToUserPage(\${currentPage + 1})" \${isLast ? 'disabled' : ''} class="h-8 px-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 \${isLast ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-xs cursor-pointer'}" title="หน้าถัดไป">
          <span class="hidden sm:inline">ถัดไป</span> <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
        </button>
        <button type="button" onclick="goToUserPage(\${totalPages})" \${isLast ? 'disabled' : ''} class="h-8 px-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 \${isLast ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-xs cursor-pointer'}" title="หน้าสุดท้าย">
          <i data-lucide="chevrons-right" class="w-3.5 h-3.5"></i>
        </button>
      \`;

      container.innerHTML = html;
      if (window.lucide && typeof lucide.createIcons === 'function') {
        try { lucide.createIcons(); } catch (e) {}
      }
    }

    function filterUsersList() {
      if (state.userPagination) {
        state.userPagination.currentPage = 1;
      }
      renderUserManagementTable();
    }

    `;

content = content.substring(0, idxStart) + newFunctions + content.substring(idxEnd);
console.log('2. Replaced renderUserManagementTable with paginated version successfully.');

fs.writeFileSync('index.html', content, 'utf8');
console.log('Saved index.html successfully! New length:', content.length);
