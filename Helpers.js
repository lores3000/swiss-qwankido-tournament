function copyTable(source, destinationSheetName, rowoffset){
  var sourceSheet = source;

  var range = sourceSheet.getDataRange();
  var rows = range.getNumRows();
  var columns = range.getNumColumns();

  var intermediateSheet = createOrReplaceSheet(intermediateSheetName);

  var source = sourceSheet.getRange(rowoffset,1,rows,columns);
  var destination = intermediateSheet.getRange(1,1,rows-rowoffset,columns);

  source.copyTo(destination);
  return intermediateSheet;
}

function calculateAgeInYears(intermediateSheet){
  var range = intermediateSheet.getDataRange();
  var rows = range.getNumRows();

  var changeRange = intermediateSheet.getRange(birthdateColum+2+':'+birthdateColum+rows);
  var sourceValues = changeRange.getValues();

  //correct age
  for(var i=0;i<sourceValues.length;i++){
    sourceValues[i][0] = '=DATEDIF('+birthdateColum+(i+2)+','+sourceSheetName+'!'+sourceSheetTournamentDateCell+',"Y")';
  }
  intermediateSheet.getRange(ageColum+2+':'+ageColum+rows).setFormulas(sourceValues);
}

function createOrReplaceSheet(name){
  var sheet = spreadsheet.getSheetByName(name)
    if(sheet != null)
      spreadsheet.deleteSheet(sheet);
    sheet = spreadsheet.insertSheet(name);
    return sheet;
}