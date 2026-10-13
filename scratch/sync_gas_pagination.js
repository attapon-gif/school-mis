const fs = require('fs');

let content = fs.readFileSync('google-apps-script/Index.html', 'utf8');

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

if (content.includes(oldTableBlock)) {
  content = content.replace(oldTableBlock, newTableBlock);
  console.log('1. Updated userPaginationBar in GAS Index.html');
}

const funcStartTarget = 'function renderUserManagementTable() {';
const funcEndTarget = 'function renderRolePermissionMatrix() {';

const idxStart = content.indexOf(funcStartTarget);
const idxEnd = content.indexOf(funcEndTarget, idxStart);

if (idxStart !== -1 && idxEnd !== -1) {
  const rootIndex = fs.readFileSync('index.html', 'utf8');
  const rootFuncStart = rootIndex.indexOf(funcStartTarget);
  const rootFuncEnd = rootIndex.indexOf(funcEndTarget, rootFuncStart);
  const newFuncsFromRoot = rootIndex.substring(rootFuncStart, rootFuncEnd);

  content = content.substring(0, idxStart) + newFuncsFromRoot + content.substring(idxEnd);
  console.log('2. Updated functions in GAS Index.html');
}

fs.writeFileSync('google-apps-script/Index.html', content, 'utf8');
console.log('Synced google-apps-script/Index.html successfully!');
