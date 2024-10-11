//todo make configurable with table


function generateParticipantsList() {
  init();

  var source = DriveApp.getFileById(sourceSheetFile);
  
  var files = appFolder.getFilesByName(destinationSheetName);
  while (files.hasNext()) {//If there is another element in the iterator
    var thisFile = files.next();
    thisFile.setTrashed(true);
  };

  destination = source.makeCopy(destinationSheetName,appFolder);
  spreadsheet = SpreadsheetApp.open(destination);

  var source = spreadsheet.getSheetByName(sourceSheetName);
  var intermediateSheet = createOrReplaceSheet(intermediateSheetName);

  var rowoffset = startrowforsourcedata;

  intermediateSheet = copyTable(source, intermediateSheetName, rowoffset)
  calculateAgeInYears(intermediateSheet);

  //todo remove duplicates? -> fix in source data for now
  //todo find wrong categories? -> fix in source data for now

}




