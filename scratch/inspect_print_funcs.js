const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

const printFuncs = [
  'printPp1', 'printPp6', 'printPp5', 'printRemedialReport', 'printExamScheduleReport',
  'printPlansReport', 'printPlanBooklet', 'printSupervisionReport', 'printSupervisionSummaryReport',
  'printSubstituteReport', 'printTeacherTimetable', 'printClassroomTimetable', 'printMasterTimetable',
  'printAcademicCalendarReport', 'printDailyAttendanceReport', 'printBmiReport', 'printBehaviorSummaryReport',
  'printSavingsReport', 'printHomeVisitReport', 'printLockerTagsSheet', 'printDeskTagsSheet',
  'printDmcOfficialDirectory', 'printClubReport', 'printScoutReport', 'printIepReport',
  'printTransfersReport', 'printCarReport', 'downloadExcelTemplate', 'openModalImportExcel'
];

printFuncs.forEach(f => {
  const has = s.includes(f);
  console.log(f + ':', has);
});
