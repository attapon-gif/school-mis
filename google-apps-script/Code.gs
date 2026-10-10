/**
 * ระบบบริหารงานวิชาการโรงเรียน (School Academic MIS)
 * Backend Google Apps Script (GAS)
 * ใช้ Google Sheets เป็นฐานข้อมูล และ Google Drive จัดเก็บไฟล์
 */

const FOLDER_NAME = 'MIS_Academic_Uploads';

// เข้าใช้งานหน้าเว็บ Web App หรือรับคำขอ API (GET)
function doGet(e) {
  if (e && e.parameter && e.parameter.action) {
    var action = e.parameter.action;
    var payload = {};
    if (e.parameter.payload) {
      try { payload = JSON.parse(e.parameter.payload); } catch(err){}
    }
    var result = apiRouter(action, payload);
    return ContentService.createTextOutput(JSON.stringify(result || { success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('ระบบบริหารงานวิชาการโรงเรียนฝันใหม่ (เวอร์ชัน FM)')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// รับคำขอ API จากภายนอก (POST สำหรับเชื่อมต่อกับ GitHub Pages หรือเว็บภายนอก)
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch(err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    var action = data.action || (e.parameter && e.parameter.action);
    var payload = data.payload || {};
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch(err){}
    }
    var result = apiRouter(action, payload);
    return ContentService.createTextOutput(JSON.stringify(result || { success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// รวมไฟล์ย่อย (ถ้ามี)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * API Router หลัก: เชื่อมต่อ Frontend กับ Google Sheets & Drive
 */
function apiRouter(action, payload) {
  try {
    switch (action) {
      case 'initSetup':
        return initSetup();
      case 'getInfo':
        return getSystemInfo();
      case 'updateInfo':
        return updateSystemInfo(payload);
      case 'studentLogin':
        return handleStudentLogin(payload);
      case 'getGrades':
        return getGradesList(payload);
      case 'resolveGrade':
        return resolveGrade(payload);
      case 'getPlans':
        return getLessonPlans();
      case 'savePlan':
        return saveLessonPlan(payload);
      case 'reviewPlan':
        return reviewLessonPlan(payload);
      case 'postLessonPlan':
        return postLessonPlan(payload);
      case 'getSupervisions':
        return getSupervisions();
      case 'saveSupervision':
        return saveSupervision(payload);
      case 'evaluateSupervision':
        return evaluateSupervision(payload);
      case 'getTimetables':
        return getTimetablesData();
      case 'validateTimetable':
        return validateTimetableConflict(payload);
      case 'saveTimetable':
        return saveTimetableSlot(payload);
      case 'deleteTimetable':
        return deleteTimetableSlot(payload);
      case 'findFreeTeachers':
        return findFreeTeachers(payload);
      case 'saveSubstitute':
        return saveSubstitute(payload);
      case 'uploadFile':
        return uploadFileToDrive(payload);
      case 'saveStudent':
        return saveStudent(payload);
      case 'importStudents':
        return importStudentsBatch(payload);
      case 'saveGradeRecord':
        return saveGradeRecord(payload);
      case 'saveTeacher':
        return saveTeacher(payload);
      case 'saveClassroom':
        return saveClassroom(payload);
      case 'saveRoom':
        return saveRoom(payload);
      case 'sendLineNotify':
        return sendLineNotifyMessage(payload);
      default:
        return { success: false, error: 'Unknown action: ' + action };
    }
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * ส่งข้อความแจ้งเตือนผ่าน LINE (รองรับทั้ง LINE Messaging API มาตรฐานใหม่ และ LINE Notify)
 */
function sendLineNotifyMessage(payload) {
  var token = payload ? payload.token : '';
  var message = payload ? payload.message : '';
  var targetId = payload ? payload.targetId : '';
  if (!token || !message) {
    return { success: false, error: 'ต้องระบุ Token และ Message' };
  }

  // 1. ลองส่งแบบ LINE Messaging API (LINE Official Account - Broadcast / Push)
  try {
    var msgEndpoint = targetId ? 'https://api.line.me/v2/bot/message/push' : 'https://api.line.me/v2/bot/message/broadcast';
    var msgBody = targetId ? { to: targetId, messages: [{ type: 'text', text: message }] } : { messages: [{ type: 'text', text: message }] };
    var msgOptions = {
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(msgBody),
      muteHttpExceptions: true
    };
    var msgRes = UrlFetchApp.fetch(msgEndpoint, msgOptions);
    if (msgRes.getResponseCode() === 200) {
      return { success: true, mode: 'messaging_api', status: 200, response: msgRes.getContentText() };
    }
  } catch (errMsg) {
    // ลอง LINE Notify ต่อไป
  }

  // 2. ลองส่งแบบ LINE Notify เดิม (กรณี Token เก่าที่ยังไม่หมดอายุ)
  try {
    var options = {
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      payload: {
        'message': message
      },
      muteHttpExceptions: true
    };
    var response = UrlFetchApp.fetch('https://notify-api.line.me/api/notify', options);
    var resCode = response.getResponseCode();
    var resText = response.getContentText();
    return { success: resCode === 200, status: resCode, response: resText };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

// ------------------------------------------------------------------
// ระบบจัดการโฟลเดอร์ Google Drive สำหรับเก็บไฟล์
// ------------------------------------------------------------------
function getOrCreateFolder(subfolderName) {
  let rootFolders = DriveApp.getFoldersByName(FOLDER_NAME);
  let rootFolder = rootFolders.hasNext() ? rootFolders.next() : DriveApp.createFolder(FOLDER_NAME);
  
  if (!subfolderName) return rootFolder;
  let subFolders = rootFolder.getFoldersByName(subfolderName);
  return subFolders.hasNext() ? subFolders.next() : rootFolder.createFolder(subfolderName);
}

function uploadFileToDrive(payload) {
  const folder = getOrCreateFolder(payload.subfolder || 'general');
  const contentType = payload.mimeType || 'application/octet-stream';
  const decoded = Utilities.base64Decode(payload.base64Data.split(',')[1] || payload.base64Data);
  const blob = Utilities.newBlob(decoded, contentType, payload.fileName);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  return {
    success: true,
    fileId: file.getId(),
    url: file.getUrl(),
    downloadUrl: `https://drive.google.com/uc?export=view&id=${file.getId()}`
  };
}

// ------------------------------------------------------------------
// Google Sheets Database Helpers
// ------------------------------------------------------------------
function getDbSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

function sheetToObjects(sheetName) {
  const sheet = getDbSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  
  const headers = values[0];
  const results = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    let obj = {};
    for (let j = 0; j < headers.length; j++) {
      let val = row[j];
      if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
        try { val = JSON.parse(val); } catch (e) {}
      }
      obj[headers[j]] = val;
    }
    results.push(obj);
  }
  return results;
}

function appendObjectToSheet(sheetName, obj) {
  const sheet = getDbSheet(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(h => {
    let val = obj[h];
    if (typeof val === 'object' && val !== null) return JSON.stringify(val);
    return val !== undefined ? val : '';
  });
  sheet.appendRow(row);
  return obj;
}

function updateObjectInSheet(sheetName, idKey, idVal, updateData) {
  const sheet = getDbSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return false;
  
  const headers = data[0];
  const keyColIdx = headers.indexOf(idKey);
  if (keyColIdx === -1) return false;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][keyColIdx]) === String(idVal)) {
      headers.forEach((h, j) => {
        if (updateData[h] !== undefined) {
          let val = updateData[h];
          if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
          sheet.getRange(i + 1, j + 1).setValue(val);
        }
      });
      return true;
    }
  }
  return false;
}

// ------------------------------------------------------------------
// MODULE: System Info & Settings
// ------------------------------------------------------------------
function getSystemInfo() {
  const sheet = getDbSheet('Config');
  const values = sheet.getDataRange().getValues();
  const info = {};
  for (let i = 0; i < values.length; i++) {
    if (values[i][0]) info[values[i][0]] = values[i][1];
  }

  const teachers = sheetToObjects('Teachers');
  const classrooms = sheetToObjects('Classrooms').map(c => c.name);
  const rooms = sheetToObjects('Rooms').map(r => r.name);

  const periods = [
    { period: 1, name: "คาบที่ 1", time: "08.30 - 09.20" },
    { period: 2, name: "คาบที่ 2", time: "09.20 - 10.10" },
    { period: 3, name: "คาบที่ 3", time: "10.10 - 11.00" },
    { period: 4, name: "คาบที่ 4", time: "11.00 - 11.50" },
    { period: 5, name: "คาบที่ 5 (พักเที่ยง)", time: "11.50 - 12.50" },
    { period: 6, name: "คาบที่ 6", time: "12.50 - 13.40" },
    { period: 7, name: "คาบที่ 7", time: "13.40 - 14.30" }
  ];
  const days = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];

  return {
    schoolInfo: info,
    teachers,
    classrooms,
    rooms,
    periods,
    days
  };
}

function updateSystemInfo(payload) {
  const sheet = getDbSheet('Config');
  const data = sheet.getDataRange().getValues();
  const existingKeys = data.map(r => r[0]);

  for (let key in payload) {
    const idx = existingKeys.indexOf(key);
    if (idx !== -1) {
      sheet.getRange(idx + 1, 2).setValue(payload[key]);
    } else {
      sheet.appendRow([key, payload[key]]);
      existingKeys.push(key);
    }
  }
  return { success: true };
}

// ------------------------------------------------------------------
// MODULE 1: ผลการเรียน & สรุปยอดแก้ 0, ร, มส
// ------------------------------------------------------------------
function handleStudentLogin(payload) {
  const students = sheetToObjects('Students');
  const stu = students.find(s => String(s.id).trim() === String(payload.studentId).trim() && 
                                 String(s.citizenId).trim() === String(payload.citizenId).trim());
  if (!stu) {
    return { success: false, error: 'ไม่พบข้อมูลนักเรียน หรือเลขประจำตัวประชาชนไม่ถูกต้อง' };
  }

  const allGrades = sheetToObjects('Grades');
  const studentGrades = allGrades.filter(g => String(g.studentId) === String(stu.id));

  let totalCredits = 0;
  let totalPoints = 0;
  studentGrades.forEach(g => {
    const gradeNum = parseFloat(g.grade);
    const cr = parseFloat(g.credits) || 0;
    if (!isNaN(gradeNum)) {
      totalCredits += cr;
      totalPoints += gradeNum * cr;
    }
  });
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  return {
    success: true,
    student: stu,
    grades: studentGrades,
    gpa,
    schoolInfo: getSystemInfo().schoolInfo
  };
}

function getGradesList(query) {
  const grades = sheetToObjects('Grades');
  const students = sheetToObjects('Students');

  let list = grades.map(g => {
    const stu = students.find(s => String(s.id) === String(g.studentId)) || {};
    const tot = (g.total !== undefined && g.total !== null && g.total !== '') ? g.total : 
                ((g.totalScore !== undefined && g.totalScore !== null && g.totalScore !== '') ? g.totalScore :
                (Number(g.scoreCollect || 0) + Number(g.scoreMid || 0) + Number(g.scoreFinal || 0)));
    return {
      ...g,
      total: tot,
      totalScore: tot,
      studentName: stu.name || g.studentName || '-',
      classroom: stu.classroom || g.classroom || '-',
      studentNumber: stu.number || g.studentNumber || 1
    };
  });

  if (query && query.classroom) {
    list = list.filter(g => g.classroom === query.classroom);
  }

  const zeroCount = grades.filter(g => String(g.grade) === '0').length;
  const rCount = grades.filter(g => String(g.grade) === 'ร').length;
  const msCount = grades.filter(g => String(g.grade) === 'มส').length;
  const passCount = grades.filter(g => !['0', 'ร', 'มส'].includes(String(g.grade))).length;

  if (query && query.statusType) {
    if (query.statusType === '0') list = list.filter(g => String(g.grade) === '0');
    else if (query.statusType === 'ร') list = list.filter(g => String(g.grade) === 'ร');
    else if (query.statusType === 'มส') list = list.filter(g => String(g.grade) === 'มส');
    else if (query.statusType === 'problem') list = list.filter(g => ['0', 'ร', 'มส'].includes(String(g.grade)));
  }

  return {
    grades: list,
    summary: {
      zeroCount,
      rCount,
      msCount,
      totalProblem: zeroCount + rCount + msCount,
      passCount,
      totalCount: grades.length
    }
  };
}

function resolveGrade(payload) {
  const updateData = {};
  if (payload.status) updateData.status = payload.status;
  if (payload.remark !== undefined) updateData.remark = payload.remark;
  if (payload.newGrade) updateData.grade = payload.newGrade;

  const ok = updateObjectInSheet('Grades', 'id', payload.id, updateData);
  return { success: ok };
}

// ------------------------------------------------------------------
// MODULE 2: แผนการสอน + บันทึกหลังแผน + ลายเซ็นผู้บริหาร
// ------------------------------------------------------------------
function getLessonPlans() {
  const plans = sheetToObjects('LessonPlans');
  return { plans };
}

function saveLessonPlan(payload) {
  const plans = sheetToObjects('LessonPlans');
  const newId = 'LP' + Utilities.formatString('%03d', plans.length + 1);

  const planObj = {
    id: newId,
    teacherId: payload.teacherId || 'T01',
    teacherName: payload.teacherName || 'ครูผู้สอน',
    subject: payload.subject,
    classroom: payload.classroom,
    unitTitle: payload.unitTitle,
    learningHours: parseInt(payload.learningHours) || 4,
    planFileUrl: payload.planFileUrl || '',
    fileName: payload.fileName || 'แผนการสอน.pdf',
    submittedDate: Utilities.formatDate(new Date(), 'GMT+7', 'yyyy-MM-dd HH:mm'),
    status: 'รอตรวจ',
    directorComment: '',
    approvedDate: '',
    signatureStampUrl: '',
    postLesson: {
      isRecorded: false,
      recordedDate: '',
      result: '',
      problem: '',
      solution: ''
    }
  };

  appendObjectToSheet('LessonPlans', planObj);
  return { success: true, plan: planObj };
}

function reviewLessonPlan(payload) {
  const info = getSystemInfo().schoolInfo;
  const updateData = {
    status: payload.status,
    directorComment: payload.directorComment || '',
    approvedDate: Utilities.formatDate(new Date(), 'GMT+7', 'yyyy-MM-dd HH:mm')
  };
  if (payload.status === 'อนุมัติแล้ว') {
    updateData.signatureStampUrl = payload.signatureStampUrl || info.signatureUrl || '';
  }

  const ok = updateObjectInSheet('LessonPlans', 'id', payload.id, updateData);
  return { success: ok };
}

function postLessonPlan(payload) {
  const postLessonObj = {
    isRecorded: true,
    recordedDate: Utilities.formatDate(new Date(), 'GMT+7', 'yyyy-MM-dd HH:mm'),
    result: payload.result,
    problem: payload.problem,
    solution: payload.solution
  };

  const ok = updateObjectInSheet('LessonPlans', 'id', payload.id, { postLesson: postLessonObj });
  return { success: ok };
}

// ------------------------------------------------------------------
// MODULE 3: นิเทศภายใน (ปฏิทิน + คะแนน + คลังรูปภาพ)
// ------------------------------------------------------------------
function getSupervisions() {
  const list = sheetToObjects('Supervisions');
  return { supervisions: list };
}

function saveSupervision(payload) {
  const list = sheetToObjects('Supervisions');
  const newId = 'SUP' + Utilities.formatString('%03d', list.length + 1);
  const info = getSystemInfo().schoolInfo;

  const item = {
    id: newId,
    date: payload.date,
    period: payload.period,
    teacherId: payload.teacherId,
    teacherName: payload.teacherName,
    subject: payload.subject,
    classroom: payload.classroom,
    room: payload.room,
    supervisorName: payload.supervisorName || info.headAcademicName || 'หัวหน้าวิชาการ',
    status: 'รอนิเทศ',
    scores: null,
    feedback: '',
    photos: []
  };

  appendObjectToSheet('Supervisions', item);
  return { success: true, supervision: item };
}

function evaluateSupervision(payload) {
  const updateData = {
    status: 'เสร็จสิ้น',
    scores: payload.scores,
    feedback: payload.feedback || '',
    photos: payload.photos || []
  };

  const ok = updateObjectInSheet('Supervisions', 'id', payload.id, updateData);
  return { success: ok };
}

// ------------------------------------------------------------------
// MODULE 4: ตารางสอน (ไม่ซ้ำ) & จัดสอนแทน
// ------------------------------------------------------------------
function getTimetablesData() {
  const timetables = sheetToObjects('Timetables');
  const info = getSystemInfo();
  const substitutes = sheetToObjects('Substitutes');

  return {
    timetables,
    substitutes,
    days: info.days,
    periods: info.periods,
    teachers: info.teachers,
    classrooms: info.classrooms,
    rooms: info.rooms
  };
}

function validateTimetableConflict(payload) {
  const { day, period, teacherId, room, classroom, excludeId } = payload;
  const timetables = sheetToObjects('Timetables');
  const conflicts = [];
  const pNum = parseInt(period);

  const list = timetables.filter(t => t.id !== excludeId && t.day === day && parseInt(t.period) === pNum);

  for (const t of list) {
    if (t.teacherId === teacherId) {
      conflicts.push(`ครูผู้สอน (${t.teacherName}) มีคาบสอนในวัน ${day} คาบ ${t.period} อยู่แล้วที่ห้อง ${t.classroom}`);
    }
    if (t.room === room) {
      conflicts.push(`ห้องเรียน (${room}) มีการเรียนการสอนวิชา ${t.subject} ในวัน ${day} คาบ ${t.period} อยู่แล้ว`);
    }
    if (t.classroom === classroom) {
      conflicts.push(`ชั้นเรียน (${classroom}) มีตารางเรียนวิชา ${t.subject} ในคาบนี้อยู่แล้ว`);
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts
  };
}

function saveTimetableSlot(payload) {
  const check = validateTimetableConflict(payload);
  if (check.hasConflict) {
    return { success: false, error: check.conflicts.join('\n') };
  }

  const timetables = sheetToObjects('Timetables');
  const newId = 'TT' + Utilities.formatString('%03d', timetables.length + 1);

  const slot = {
    id: newId,
    day: payload.day,
    period: parseInt(payload.period),
    teacherId: payload.teacherId,
    teacherName: payload.teacherName,
    subject: payload.subject,
    classroom: payload.classroom,
    room: payload.room
  };

  appendObjectToSheet('Timetables', slot);
  return { success: true, slot };
}

function deleteTimetableSlot(payload) {
  const sheet = getDbSheet('Timetables');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(payload.id)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, error: 'Slot not found' };
}

function findFreeTeachers(payload) {
  const { day, period, absentTeacherId } = payload;
  const pNum = parseInt(period);
  const timetables = sheetToObjects('Timetables');
  const teachers = sheetToObjects('Teachers');

  const busyTeacherIds = timetables
    .filter(t => t.day === day && parseInt(t.period) === pNum)
    .map(t => t.teacherId);

  const freeTeachers = teachers.filter(t => 
    t.id !== absentTeacherId && !busyTeacherIds.includes(t.id)
  );

  return {
    day,
    period: pNum,
    freeTeachers,
    totalFree: freeTeachers.length
  };
}

function saveSubstitute(payload) {
  const subs = sheetToObjects('Substitutes');
  const newId = 'SUB' + Utilities.formatString('%03d', subs.length + 1);

  const subRecord = {
    id: newId,
    date: payload.date,
    day: payload.day,
    period: parseInt(payload.period),
    periodTime: payload.periodTime || 'ตามตารางสอน',
    classroom: payload.classroom,
    subject: payload.subject,
    absentTeacherId: payload.absentTeacherId,
    absentTeacherName: payload.absentTeacherName,
    absentReason: payload.absentReason,
    subTeacherId: payload.subTeacherId,
    subTeacherName: payload.subTeacherName,
    status: 'อนุมัติสอนแทนแล้ว',
    assignedDate: Utilities.formatDate(new Date(), 'GMT+7', 'yyyy-MM-dd HH:mm'),
    remark: payload.remark || ''
  };

  appendObjectToSheet('Substitutes', subRecord);
  return { success: true, substitute: subRecord };
}


// ------------------------------------------------------------------
// ADMIN DATA MANAGEMENT (บันทึกข้อมูลนักเรียน เกรด ครู ห้องเรียน จากหน้าเว็บ)
// ------------------------------------------------------------------
function saveStudent(payload) {
  const students = sheetToObjects('Students');
  const existing = students.find(s => String(s.id).trim() === String(payload.id).trim());
  if (existing) {
    updateObjectInSheet('Students', 'id', payload.id, payload);
  } else {
    appendObjectToSheet('Students', payload);
  }
  return { success: true, student: payload };
}

function importStudentsBatch(payload) {
  const list = payload.students || [];
  if (!Array.isArray(list) || list.length === 0) {
    return { success: false, error: 'No student data provided' };
  }
  let count = 0;
  list.forEach(stu => {
    if (stu && (stu.id || stu.name)) {
      saveStudent(stu);
      count++;
    }
  });
  return { success: true, importedCount: count };
}

function saveGradeRecord(payload) {
  const grades = sheetToObjects('Grades');
  const newId = payload.id || ('G' + Utilities.formatString('%03d', grades.length + 1));
  const tot = (payload.total !== undefined && payload.total !== null && payload.total !== '') ? Number(payload.total) : 
              (Number(payload.scoreCollect || 0) + Number(payload.scoreMid || 0) + Number(payload.scoreFinal || 0));
  
  let grade = payload.grade;
  if (!grade) {
    if (tot >= 80) grade = '4';
    else if (tot >= 75) grade = '3.5';
    else if (tot >= 70) grade = '3';
    else if (tot >= 65) grade = '2.5';
    else if (tot >= 60) grade = '2';
    else if (tot >= 55) grade = '1.5';
    else if (tot >= 50) grade = '1';
    else grade = '0';
  }

  let status = payload.status;
  if (!status) {
    if (grade === '0') status = 'ติด 0';
    else if (grade === 'ร') status = 'ติด ร';
    else if (grade === 'มส') status = 'ติด มส';
    else status = 'ปกติ';
  }

  // บันทึก/อัปเดตข้อมูลนักเรียนควบคู่กัน
  if (payload.studentName && payload.classroom) {
    saveStudent({
      id: payload.studentId,
      citizenId: payload.citizenId || '',
      name: payload.studentName,
      classroom: payload.classroom,
      number: parseInt(payload.studentNumber) || 1
    });
  }

  const record = {
    id: newId,
    studentId: payload.studentId,
    courseCode: payload.courseCode || '',
    courseName: payload.courseName || '',
    credits: parseFloat(payload.credits) || 1.0,
    scoreCollect: Number(payload.scoreCollect || 0),
    scoreMid: Number(payload.scoreMid || 0),
    scoreFinal: Number(payload.scoreFinal || 0),
    total: tot,
    grade: String(grade),
    status: status,
    remark: payload.remark || ''
  };

  appendObjectToSheet('Grades', record);
  return { success: true, grade: record };
}

function saveTeacher(payload) {
  const teachers = sheetToObjects('Teachers');
  const newId = payload.id || ('T' + Utilities.formatString('%02d', teachers.length + 1));
  const teacher = {
    id: newId,
    name: payload.name,
    subject: payload.subject,
    dept: payload.dept,
    phone: payload.phone || ''
  };
  appendObjectToSheet('Teachers', teacher);
  return { success: true, teacher };
}

function saveClassroom(payload) {
  appendObjectToSheet('Classrooms', { name: payload.name });
  return { success: true };
}

function saveRoom(payload) {
  appendObjectToSheet('Rooms', { name: payload.name });
  return { success: true };
}

// ------------------------------------------------------------------
// AUTO INITIALIZE COMPREHENSIVE SAMPLE DATA (สร้างข้อมูลตัวอย่างครบวงจร)
// ------------------------------------------------------------------
function initSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Config
  let s = getDbSheet('Config');
  s.clear();
  s.appendRow(['Key', 'Value']);
  s.appendRow(['name', 'โรงเรียนฝันใหม่']);
  s.appendRow(['subTitle', 'สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)']);
  s.appendRow(['version', 'FM']);
  s.appendRow(['academicYear', '2569']);
  s.appendRow(['term', '1']);
  s.appendRow(['directorName', 'ดร.วิชัย เกียรติสกุล']);
  s.appendRow(['directorPosition', 'ผู้อำนวยการสถานศึกษา เชี่ยวชาญ']);
  s.appendRow(['headAcademicName', 'นางสาวนฤมล บุญประเสริฐ']);
  s.appendRow(['developer', 'funmai studio']);
  s.appendRow(['developerEmail', 'attapon@nbcc.ac.th']);
  s.appendRow(['developerPhone', '062-3636031']);
  s.appendRow(['signatureUrl', 'https://api.iconify.design/lucide:signature.svg']);

  // 2. Teachers (8 ท่าน)
  s = getDbSheet('Teachers');
  s.clear();
  s.appendRow(['id', 'name', 'subject', 'dept', 'phone']);
  s.appendRow(['T01', 'นายอรรถพล ฉาไธสง', 'วิทยาการคำนวณและดิจิทัล', 'กลุ่มสาระฯ วิทยาศาสตร์และเทคโนโลยี', '081-234-5678']);
  s.appendRow(['T02', 'นางสาวปราณี ศรีสุข', 'ภาษาไทย 1', 'กลุ่มสาระฯ ภาษาไทย', '082-345-6789']);
  s.appendRow(['T03', 'นายสมชาย ใจดี', 'คณิตศาสตร์ 1', 'กลุ่มสาระฯ คณิตศาสตร์', '083-456-7890']);
  s.appendRow(['T04', 'นางสาวกานดา มณีวรรณ', 'วิทยาศาสตร์และฟิสิกส์', 'กลุ่มสาระฯ วิทยาศาสตร์และเทคโนโลยี', '084-567-8901']);
  s.appendRow(['T05', 'นายวีระศักดิ์ ยิ่งยง', 'สังคมศึกษา ศาสนาฯ', 'กลุ่มสาระฯ สังคมศึกษา', '085-678-9012']);
  s.appendRow(['T06', 'Mr. David Wilson', 'ภาษาอังกฤษสื่อสาร', 'กลุ่มสาระฯ ภาษาต่างประเทศ', '086-789-0123']);
  s.appendRow(['T07', 'นางสาวพิมพา รัตนศิลป์', 'ศิลปะและทัศนศิลป์', 'กลุ่มสาระฯ ศิลปะ', '087-890-1234']);
  s.appendRow(['T08', 'นายเกียรติศักดิ์ ชัยชนะ', 'สุขศึกษาและพลศึกษา', 'กลุ่มสาระฯ สุขศึกษาและพลศึกษา', '088-901-2345']);

  // 3. Classrooms
  s = getDbSheet('Classrooms');
  s.clear();
  s.appendRow(['name']);
  ['ม.1/1', 'ม.1/2', 'ม.2/1', 'ม.2/2', 'ม.3/1', 'ม.3/2'].forEach(c => s.appendRow([c]));

  // 4. Rooms
  s = getDbSheet('Rooms');
  s.clear();
  s.appendRow(['name']);
  ['ห้อง 101', 'ห้อง 102', 'ห้อง 201', 'ห้อง 202', 'ห้องปฏิบัติการคอมพิวเตอร์ 1', 'ห้องปฏิบัติการวิทยาศาสตร์', 'ห้อง Sound Lab'].forEach(r => s.appendRow([r]));

  // 5. Students (10 คน)
  s = getDbSheet('Students');
  s.clear();
  s.appendRow(['id', 'citizenId', 'name', 'classroom', 'number']);
  s.appendRow(['S67001', '1100100200301', 'ด.ช.ธนภัทร สุขสมบูรณ์', 'ม.1/1', 1]);
  s.appendRow(['S67002', '1100100200302', 'น.ส.กัญญาพร รัตนศิริ', 'ม.1/1', 2]);
  s.appendRow(['S67003', '1100100200303', 'ด.ช.กิตติพงษ์ วิลาวัลย์', 'ม.1/1', 3]);
  s.appendRow(['S67004', '1100100200304', 'ด.ญ.ชนัญชิดา ชัยเจริญ', 'ม.1/1', 4]);
  s.appendRow(['S67005', '1100100200305', 'นายปิยะพงษ์ ทองหล่อ', 'ม.1/2', 1]);
  s.appendRow(['S67006', '1100100200306', 'น.ส.ศศิธร เจริญสุข', 'ม.1/2', 2]);
  s.appendRow(['S67007', '1100100200307', 'นายณัฐวุฒิ บุญมี', 'ม.2/1', 1]);
  s.appendRow(['S67008', '1100100200308', 'น.ส.ชลธิชา สมหวัง', 'ม.2/1', 2]);
  s.appendRow(['S67009', '1100100200309', 'นายภานุพงศ์ ดวงตา', 'ม.3/1', 1]);
  s.appendRow(['S67010', '1100100200310', 'น.ส.พิมพ์ชนก แสงแก้ว', 'ม.3/1', 2]);

  // 6. Grades (24 รายการ: ผ่าน 21, ติด 0: 1, ติด ร: 1, ติด มส: 1)
  s = getDbSheet('Grades');
  s.clear();
  s.appendRow(['id', 'studentId', 'courseCode', 'courseName', 'credits', 'scoreCollect', 'scoreMid', 'scoreFinal', 'total', 'grade', 'status', 'remark']);
  
  // S67001 (ด.ช.ธนภัทร - ม.1/1)
  s.appendRow(['G001', 'S67001', 'ว21201', 'วิทยาการคำนวณและดิจิทัล', 1.0, 29, 28, 28, 85, '4', 'ปกติ', 'คะแนนดีเยี่ยม']);
  s.appendRow(['G002', 'S67001', 'ค21101', 'คณิตศาสตร์พื้นฐาน 1', 1.5, 27, 25, 26, 78, '3.5', 'ปกติ', '']);
  s.appendRow(['G003', 'S67001', 'ท21101', 'ภาษาไทย 1', 1.5, 26, 24, 25, 75, '3.5', 'ปกติ', '']);
  s.appendRow(['G004', 'S67001', 'อ21101', 'ภาษาอังกฤษ 1', 1.5, 28, 26, 27, 81, '4', 'ปกติ', '']);

  // S67002 (น.ส.กัญญาพร - ม.1/1)
  s.appendRow(['G005', 'S67002', 'ว21201', 'วิทยาการคำนวณและดิจิทัล', 1.0, 30, 30, 29, 89, '4', 'ปกติ', '']);
  s.appendRow(['G006', 'S67002', 'ค21101', 'คณิตศาสตร์พื้นฐาน 1', 1.5, 28, 28, 29, 85, '4', 'ปกติ', '']);
  s.appendRow(['G007', 'S67002', 'ว21101', 'วิทยาศาสตร์ 1', 1.5, 29, 27, 28, 84, '4', 'ปกติ', '']);

  // S67003 (ด.ช.กิตติพงษ์ - ม.1/1 - มีติด 0 และ ติด ร สำหรับทดสอบแก้ตัว)
  s.appendRow(['G008', 'S67003', 'ว21201', 'วิทยาการคำนวณและดิจิทัล', 1.0, 18, 15, 14, 47, '0', 'ติด 0', 'ค้างส่งใบงาน Flowchart อัลกอริทึม']);
  s.appendRow(['G009', 'S67003', 'ค21101', 'คณิตศาสตร์พื้นฐาน 1', 1.5, 20, 18, 0, 38, 'ร', 'ติด ร', 'ขาดสอบปลายภาคเนื่องจากป่วย (มีใบรับรองแพทย์)']);
  s.appendRow(['G010', 'S67003', 'ส21101', 'สังคมศึกษา 1', 1.5, 20, 20, 22, 62, '2', 'ปกติ', '']);

  // S67004 (ด.ญ.ชนัญชิดา - ม.1/1)
  s.appendRow(['G011', 'S67004', 'ว21201', 'วิทยาการคำนวณและดิจิทัล', 1.0, 27, 26, 25, 78, '3.5', 'ปกติ', '']);
  s.appendRow(['G012', 'S67004', 'ท21101', 'ภาษาไทย 1', 1.5, 28, 28, 27, 83, '4', 'ปกติ', '']);

  // S67005 (นายปิยะพงษ์ - ม.1/2 - มีติด มส)
  s.appendRow(['G013', 'S67005', 'ว21201', 'วิทยาการคำนวณและดิจิทัล', 1.0, 10, 12, 10, 32, 'มส', 'ติด มส', 'เวลาเรียนไม่ถึง 80% (ขาดเรียน 12 คาบ)']);
  s.appendRow(['G014', 'S67005', 'ส21101', 'สังคมศึกษา 1', 1.5, 20, 19, 21, 60, '2', 'ปกติ', '']);

  // S67006 (น.ส.ศศิธร - ม.1/2)
  s.appendRow(['G015', 'S67006', 'ว21201', 'วิทยาการคำนวณและดิจิทัล', 1.0, 30, 30, 30, 90, '4', 'ปกติ', '']);
  s.appendRow(['G016', 'S67006', 'ค21101', 'คณิตศาสตร์พื้นฐาน 1', 1.5, 29, 29, 30, 88, '4', 'ปกติ', '']);
  s.appendRow(['G017', 'S67006', 'อ21101', 'ภาษาอังกฤษ 1', 1.5, 30, 30, 29, 89, '4', 'ปกติ', '']);

  // S67007 (นายณัฐวุฒิ - ม.2/1)
  s.appendRow(['G018', 'S67007', 'ว22101', 'วิทยาศาสตร์ 3', 1.5, 25, 25, 24, 74, '3', 'ปกติ', '']);
  s.appendRow(['G019', 'S67007', 'ค22101', 'คณิตศาสตร์ 3', 1.5, 24, 23, 23, 70, '3', 'ปกติ', '']);

  // S67008 (น.ส.ชลธิชา - ม.2/1)
  s.appendRow(['G020', 'S67008', 'ว22101', 'วิทยาศาสตร์ 3', 1.5, 29, 29, 28, 86, '4', 'ปกติ', '']);
  s.appendRow(['G021', 'S67008', 'ศ22101', 'ทัศนศิลป์ 2', 1.0, 30, 28, 29, 87, '4', 'ปกติ', '']);

  // S67009 (นายภานุพงศ์ - ม.3/1)
  s.appendRow(['G022', 'S67009', 'อ23101', 'ภาษาอังกฤษ 5', 1.5, 22, 22, 21, 65, '2.5', 'ปกติ', '']);

  // S67010 (น.ส.พิมพ์ชนก - ม.3/1)
  s.appendRow(['G023', 'S67010', 'อ23101', 'ภาษาอังกฤษ 5', 1.5, 28, 27, 28, 83, '4', 'ปกติ', '']);
  s.appendRow(['G024', 'S67010', 'ส23101', 'สังคมศึกษา 5', 1.5, 24, 25, 26, 75, '3.5', 'ปกติ', '']);

  // 7. LessonPlans (5 แผนการสอน มีทั้ง อนุมัติแล้ว และ รอตรวจ)
  s = getDbSheet('LessonPlans');
  s.clear();
  s.appendRow(['id', 'teacherId', 'teacherName', 'subject', 'classroom', 'unitTitle', 'learningHours', 'planFileUrl', 'fileName', 'submittedDate', 'status', 'directorComment', 'approvedDate', 'signatureStampUrl', 'postLesson']);
  
  s.appendRow([
    'LP001', 'T01', 'นายอรรถพล ฉาไธสง', 'วิทยาการคำนวณและดิจิทัล (ว21201)', 'ม.1/1',
    'หน่วยที่ 1: การคิดเชิงคำนวณและผังงานแก้ปัญหา (Flowchart Algorithm)', 8, '', 'แผนการสอน_ว21201_หน่วย1_อรรถพล.pdf',
    '2026-10-01 09:30', 'อนุมัติแล้ว', 'แผนการจัดการเรียนรู้เน้นกระบวนการ Active Learning และฝึกคิดเป็นระบบ ดีเยี่ยมมาก อนุมัติใช้จัดการเรียนรู้ได้', '2026-10-03 14:15',
    'https://api.iconify.design/lucide:signature.svg',
    JSON.stringify({ isRecorded: true, recordedDate: '2026-10-06 16:30', result: 'นักเรียนร้อยละ 88 สามารถเขียนผังงานแก้ปัญหาได้ตามเกณฑ์ประเมิน', problem: 'นักเรียน 3 คนพิมพ์ช้าและยังสับสนสัญลักษณ์เงื่อนไข', solution: 'จัดกิจกรรมบัดดี้คู่หูเพื่อนช่วยเพื่อน และให้แบบฝึกเสริม' })
  ]);

  s.appendRow([
    'LP002', 'T02', 'นางสาวปราณี ศรีสุข', 'ภาษาไทย 1 (ท21101)', 'ม.1/2',
    'หน่วยที่ 2: วรรณคดีวิจักษ์และบทละครพูดพระร่วง', 6, '', 'แผนภาษาไทย_ม1_ปราณี.pdf',
    '2026-10-04 11:20', 'รอตรวจ', '', '',
    '',
    JSON.stringify({ isRecorded: false, recordedDate: '', result: '', problem: '', solution: '' })
  ]);

  s.appendRow([
    'LP003', 'T03', 'นายสมชาย ใจดี', 'คณิตศาสตร์ 1 (ค21101)', 'ม.1/1',
    'หน่วยที่ 1: จำนวนเต็มและสมบัติของจำนวนจริงในชีวิตจริง', 10, '', 'แผนคณิตศาสตร์_ม1_สมชาย.pdf',
    '2026-10-02 13:45', 'อนุมัติแล้ว', 'กิจกรรมมีแบบฝึกหัดที่หลากหลาย อนุมัติครับ', '2026-10-04 10:00',
    'https://api.iconify.design/lucide:signature.svg',
    JSON.stringify({ isRecorded: false, recordedDate: '', result: '', problem: '', solution: '' })
  ]);

  s.appendRow([
    'LP004', 'T04', 'นางสาวกานดา มณีวรรณ', 'วิทยาศาสตร์และฟิสิกส์ (ว22101)', 'ม.2/1',
    'หน่วยที่ 3: แรงและการเคลื่อนที่ผ่านการทดลองเชิงประจักษ์', 8, '', 'แผนวิทย์_ม2_กานดา.pdf',
    '2026-10-05 08:30', 'อนุมัติแล้ว', 'การทดลองออกแบบได้ปลอดภัยและน่าสนใจมาก อนุมัติครับ', '2026-10-06 11:00',
    'https://api.iconify.design/lucide:signature.svg',
    JSON.stringify({ isRecorded: true, recordedDate: '2026-10-07 15:00', result: 'นักเรียนทุกคนได้ลงมือปฏิบัติทดลองและสรุปผลแรงเสียดทานได้ถูกต้อง', problem: 'ชุดตาชั่งสปริงไม่เพียงพอ 1 กลุ่ม', solution: 'หมุนเวียนฐานการทดลอง' })
  ]);

  s.appendRow([
    'LP005', 'T06', 'Mr. David Wilson', 'ภาษาอังกฤษสื่อสาร (อ23101)', 'ม.3/1',
    'Unit 2: Expressing Opinions in Everyday Global Issues', 6, '', 'English_Unit2_David.pdf',
    '2026-10-07 14:00', 'รอตรวจ', '', '',
    '',
    JSON.stringify({ isRecorded: false, recordedDate: '', result: '', problem: '', solution: '' })
  ]);

  // 8. Supervisions (4 รายการ มีคะแนน Rubric 5 ด้าน)
  s = getDbSheet('Supervisions');
  s.clear();
  s.appendRow(['id', 'date', 'period', 'teacherId', 'teacherName', 'subject', 'classroom', 'room', 'supervisorName', 'status', 'scores', 'feedback', 'photos']);
  
  s.appendRow([
    'SUP001', '2026-10-15', 'คาบที่ 3 (10.10 - 11.00)', 'T01', 'นายอรรถพล ฉาไธสง',
    'วิทยาการคำนวณและดิจิทัล', 'ม.1/1', 'ห้องปฏิบัติการคอมพิวเตอร์ 1', 'นางสาวนฤมล บุญประเสริฐ (หน.วิชาการ)',
    'เสร็จสิ้น',
    JSON.stringify({ pre: 19, active: 20, tech: 20, classroom: 18, measure: 19, total: 96 }),
    'การจัดการเรียนรู้โดดเด่นมาก นักเรียนตื่นตัวและมีส่วนร่วมตลอดคาบ การใช้โปรแกรมจำลองทำให้เห็นผลทันที ขอชมเชย',
    JSON.stringify(['https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80'])
  ]);

  s.appendRow([
    'SUP002', '2026-10-18', 'คาบที่ 2 (09.20 - 10.10)', 'T02', 'นางสาวปราณี ศรีสุข',
    'ภาษาไทย 1', 'ม.1/2', 'ห้อง 101', 'นางสาวนฤมล บุญประเสริฐ (หน.วิชาการ)',
    'เสร็จสิ้น',
    JSON.stringify({ pre: 18, active: 18, tech: 17, classroom: 19, measure: 18, total: 90 }),
    'บรรยากาศในชั้นเรียนอบอุ่น นักเรียนกล้าแสดงออกในการอ่านบทกลอน แนะนำเพิ่มสื่อดิจิทัลเสริม',
    JSON.stringify([])
  ]);

  s.appendRow([
    'SUP003', '2026-10-22', 'คาบที่ 5 (12.40 - 13.30)', 'T03', 'นายสมชาย ใจดี',
    'คณิตศาสตร์ 1', 'ม.1/1', 'ห้อง 101', 'ดร.วิชัย เกียรติสกุล (ผอ.สถานศึกษา)',
    'รอนิเทศ', '', '', '[]'
  ]);

  s.appendRow([
    'SUP004', '2026-10-25', 'คาบที่ 1 (08.30 - 09.20)', 'T06', 'Mr. David Wilson',
    'ภาษาอังกฤษสื่อสาร', 'ม.3/1', 'ห้อง Sound Lab', 'นางสาวนฤมล บุญประเสริฐ (หน.วิชาการ)',
    'รอนิเทศ', '', '', '[]'
  ]);

  // 9. Timetables (จัดเต็มตาราง ม.1/1, ม.1/2)
  s = getDbSheet('Timetables');
  s.clear();
  s.appendRow(['id', 'day', 'period', 'teacherId', 'teacherName', 'subject', 'classroom', 'room']);
  
  // ม.1/1
  s.appendRow(['TT001', 'จันทร์', 1, 'T01', 'นายอรรถพล ฉาไธสง', 'วิทยาการคำนวณ', 'ม.1/1', 'ห้องปฏิบัติการคอมพิวเตอร์ 1']);
  s.appendRow(['TT002', 'จันทร์', 2, 'T02', 'นางสาวปราณี ศรีสุข', 'ภาษาไทย 1', 'ม.1/1', 'ห้อง 101']);
  s.appendRow(['TT003', 'จันทร์', 3, 'T03', 'นายสมชาย ใจดี', 'คณิตศาสตร์ 1', 'ม.1/1', 'ห้อง 101']);
  s.appendRow(['TT004', 'จันทร์', 6, 'T05', 'นายวีระศักดิ์ ยิ่งยง', 'สังคมศึกษา 1', 'ม.1/1', 'ห้อง 101']);
  s.appendRow(['TT005', 'จันทร์', 7, 'T06', 'Mr. David Wilson', 'ภาษาอังกฤษ 1', 'ม.1/1', 'ห้อง Sound Lab']);

  s.appendRow(['TT006', 'อังคาร', 1, 'T03', 'นายสมชาย ใจดี', 'คณิตศาสตร์ 1', 'ม.1/1', 'ห้อง 101']);
  s.appendRow(['TT007', 'อังคาร', 2, 'T04', 'นางสาวกานดา มณีวรรณ', 'วิทยาศาสตร์ 1', 'ม.1/1', 'ห้องปฏิบัติการวิทยาศาสตร์']);
  s.appendRow(['TT008', 'อังคาร', 3, 'T04', 'นางสาวกานดา มณีวรรณ', 'วิทยาศาสตร์ 1', 'ม.1/1', 'ห้องปฏิบัติการวิทยาศาสตร์']);
  s.appendRow(['TT009', 'อังคาร', 6, 'T07', 'นางสาวพิมพา รัตนศิลป์', 'ศิลปะ 1', 'ม.1/1', 'ห้อง 101']);

  s.appendRow(['TT010', 'พุธ', 1, 'T02', 'นางสาวปราณี ศรีสุข', 'ภาษาไทย 1', 'ม.1/1', 'ห้อง 101']);
  s.appendRow(['TT011', 'พุธ', 2, 'T06', 'Mr. David Wilson', 'ภาษาอังกฤษ 1', 'ม.1/1', 'ห้อง Sound Lab']);
  s.appendRow(['TT012', 'พุธ', 3, 'T01', 'นายอรรถพล ฉาไธสง', 'ดิจิทัลประยุกต์', 'ม.1/1', 'ห้องปฏิบัติการคอมพิวเตอร์ 1']);
  s.appendRow(['TT013', 'พุธ', 7, 'T08', 'นายเกียรติศักดิ์ ชัยชนะ', 'พลศึกษา 1', 'ม.1/1', 'โรงยิมเนเซียม']);

  s.appendRow(['TT014', 'พฤหัสบดี', 1, 'T05', 'นายวีระศักดิ์ ยิ่งยง', 'ประวัติศาสตร์', 'ม.1/1', 'ห้อง 101']);
  s.appendRow(['TT015', 'พฤหัสบดี', 2, 'T03', 'นายสมชาย ใจดี', 'คณิตศาสตร์ 1', 'ม.1/1', 'ห้อง 101']);
  s.appendRow(['TT016', 'พฤหัสบดี', 3, 'T02', 'นางสาวปราณี ศรีสุข', 'ภาษาไทย 1', 'ม.1/1', 'ห้อง 101']);

  s.appendRow(['TT017', 'ศุกร์', 1, 'T06', 'Mr. David Wilson', 'ภาษาอังกฤษ 1', 'ม.1/1', 'ห้อง Sound Lab']);
  s.appendRow(['TT018', 'ศุกร์', 2, 'T04', 'นางสาวกานดา มณีวรรณ', 'วิทยาศาสตร์ 1', 'ม.1/1', 'ห้อง 101']);
  s.appendRow(['TT019', 'ศุกร์', 6, 'T01', 'นายอรรถพล ฉาไธสง', 'แนะแนว/Coding', 'ม.1/1', 'ห้องปฏิบัติการคอมพิวเตอร์ 1']);

  // ม.1/2 ตัวอย่างบางคาบ
  s.appendRow(['TT020', 'จันทร์', 1, 'T02', 'นางสาวปราณี ศรีสุข', 'ภาษาไทย 1', 'ม.1/2', 'ห้อง 102']);
  s.appendRow(['TT021', 'จันทร์', 2, 'T01', 'นายอรรถพล ฉาไธสง', 'วิทยาการคำนวณ', 'ม.1/2', 'ห้องปฏิบัติการคอมพิวเตอร์ 1']);

  // 10. Substitutes (2 รายการประวัติสอนแทน)
  s = getDbSheet('Substitutes');
  s.clear();
  s.appendRow(['id', 'date', 'day', 'period', 'periodTime', 'classroom', 'subject', 'absentTeacherId', 'absentTeacherName', 'absentReason', 'subTeacherId', 'subTeacherName', 'status', 'assignedDate', 'remark']);
  s.appendRow([
    'SUB001', '2026-10-07', 'พุธ', 2, '09.20 - 10.10', 'ม.1/1', 'ภาษาอังกฤษ 1',
    'T06', 'Mr. David Wilson', 'ไปราชการอบรมสัมมนาครูต่างชาติ', 'T01', 'นายอรรถพล ฉาไธสง',
    'อนุมัติสอนแทนแล้ว', '2026-10-06 14:30', 'ให้นักเรียนทำแบบฝึกหัดคำศัพท์ในใบงาน Unit 2 หน้า 25'
  ]);
  s.appendRow([
    'SUB002', '2026-10-02', 'ศุกร์', 1, '08.30 - 09.20', 'ม.1/2', 'คณิตศาสตร์ 1',
    'T03', 'นายสมชาย ใจดี', 'ลาป่วย (มีใบรับรองแพทย์)', 'T05', 'นายวีระศักดิ์ ยิ่งยง',
    'อนุมัติสอนแทนแล้ว', '2026-10-01 16:00', 'ให้นักเรียนทำแบบฝึกหัดโจทย์สมการ หน้า 40-42'
  ]);

  return { success: true, message: 'สร้างตารางฐานข้อมูลและข้อมูลตัวอย่างสมบูรณ์แบบเรียบร้อยแล้ว!' };
}
