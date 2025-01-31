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
    sourceValues[i][0] = '=DATEDIF('+birthdateColum+(i+2)+',\''+sourceSheetName+'\'!'+sourceSheetTournamentDateCell+',"Y")';
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


//from text document template page
function createSerialLetter(templateId, documentName, tournamentData, addExtraPage){

  const templateCombatDoc = DriveApp.getFileById(templateId);

  var files = destFolder.getFilesByName(documentName);
  while (files.hasNext()) {//If there is another element in the iterator
    var thisFile = files.next();
    thisFile.setTrashed(true);
  };

  const newCombatDoc = templateCombatDoc.makeCopy(destFolder);
  newCombatDoc.setName(documentName);

  var columnHeaders = tournamentData[0];
  

  const doc = DocumentApp.openById(newCombatDoc.getId());
  const body = doc.getBody();

  var bodyCopy = body.copy();
  body.clear();
  body.appendPageBreak();

  //body.clear();
  for(var row=1;row<tournamentData.length;row++){
    var replacementBody = bodyCopy.copy();

    for(var column=0;column<columnHeaders.length;column++){
      var search = columnHeaders[column];
      var rowdata = tournamentData[row];
      
      var replace = rowdata[column]? rowdata[column] : "";

      replacementBody.replaceText('{'+search+'}', replace);  
    }

    //if(row!= tournamentData.length-1){
      replacementBody.appendPageBreak();
    //}
    copyBody(replacementBody, body);
  }

  if(addExtraPage){
    //add one more copy (last page has graphic multiplied...)
    var replacementBody = bodyCopy.copy();
    replacementBody.appendPageBreak();
    copyBody(replacementBody, body);
  }

  doc.saveAndClose();
}