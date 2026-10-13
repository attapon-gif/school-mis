const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const functionsToCheck = [
  'printClassroomP6Batch',
  'printStudentReport',
  'printPp5Report',
  'printClassroomTotalSummaryReport',
  'printRemedialSummary',
  'printExamSchedule',
  'exportSchoolMisCsv',
  'printCurrentFullPlan',
  'printSupervisionReport',
  'printSubstituteOrder',
  'printTimetableA4Landscape',
  'printAcademicCalendar',
  'printDailyAttendanceReport',
  'printBmiReport',
  'printBehaviorSummaryReport',
  'printSavingsReport',
  'printSingleHomeVisitReport',
  'printLockerRoomStudentSheet',
  'printLockerNameTags',
  'printDmcStudentDatabaseReport',
  'printTransfersReport',
  'printClubsReport',
  'printScoutsReport',
  'printIepSummaryReport',
  'printSingleResearchReport',
  'downloadStudentExcelTemplate'
];

functionsToCheck.forEach(fn => {
  const exists = content.includes(`function ${fn}`) || content.includes(`${fn} =`);
  console.log(`${fn}: ${exists ? 'EXISTS' : 'MISSING'}`);
});
