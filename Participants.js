//todo make configurable with table


function generateParticipantsList() {
  init();
  var sourceSheet = spreadsheet.getSheetByName(sourceSheetName);
  var intermediateSheet = spreadsheet.getSheetByName(intermediateSheetName);

  var rowoffset = 5;

  intermediateSheet = copyTable(sourceSheet, intermediateSheetName, rowoffset)
  calculateAgeInYears(intermediateSheet);

  //todo remove duplicates? -> fix in source data for now
  //todo find wrong categories? -> fix in source data for now

}




