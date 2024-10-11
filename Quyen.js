var maxFightersPerGroup = 14;

//create headers for 14 fighters
var header = ["Category",
  "Fighter1 Name", "Fighter1 Rank",
  "Fighter2 Name", "Fighter2 Rank",
  "Fighter3 Name", "Fighter3 Rank",
  "Fighter4 Name", "Fighter4 Rank",
  "Fighter5 Name", "Fighter5 Rank",
  "Fighter6 Name", "Fighter6 Rank",
  "Fighter7 Name", "Fighter7 Rank",
  "Fighter8 Name", "Fighter8 Rank",
  "Fighter9 Name", "Fighter9 Rank",
  "Fighter10 Name", "Fighter10 Rank",
  "Fighter11 Name", "Fighter11 Rank",
  "Fighter12 Name", "Fighter12 Rank",
  "Fighter13 Name", "Fighter13 Rank",
  "Fighter14 Name", "Fighter14 Rank",
];



function createQuyenLists(){
  init();
  var intermediateSheet = spreadsheet.getSheetByName(intermediateSheetName);
  var range = intermediateSheet.getDataRange();
  var sourceValues = range.getValues();

  var quyenSheet = createOrReplaceSheet(quyenSheetName);

  var data = [];
  var tournamentData = [];

  data.push(sourceValues[0]);
  tournamentData.push(header);

  for(var i=0;i<quyenColumns.length;i++){
    addToQuyenList(quyenColumns[i]/*,quyenCategories[i]*/, sourceValues, data, tournamentData);
  }

  quyenSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  createCombatSerialLetter(tournamentData);
}

function addToQuyenList(column, /*categories,*/ sourceValues, data, tournamentData){
  var categories = [];
  //get all categories
  for(var i=1;i<sourceValues.length;i++){
    var category = sourceValues[i][column];
    //check if category starts with a K
    if(category.startsWith('K')){
      if(categories.indexOf(category) == -1){
        categories.push(category);
      }
    }
  }
  
  var tournamentDataEntry = [];

  for(var i=0;i<categories.length;i++){
    var title = [];
    var tmpData = [];
    var dataEmpty = [];
    for(var j=0;j<data[0].length;j++){
      title.push([]);
      dataEmpty.push([]);
    }
    title[0]=categories[i];
    tournamentDataEntry.push(title);

    for(var j=1;j<sourceValues.length;j++){
      var category = sourceValues[j][column]
      if(category == categories[i]){
        tmpData.push(sourceValues[j]);
        tournamentDataEntry.push(sourceValues[j][nameColumnId]);
        tournamentDataEntry.push(sourceValues[j][rankColumnId]);
      }
    }

    data.push(title);
    for(var j=0;j<tmpData.length;j++){
      data.push(tmpData[j]);
    }

    for(var j=tmpData.length;j<maxFightersPerGroup;j++){
      tournamentDataEntry.push(dataEmpty);
      tournamentDataEntry.push(dataEmpty);
    }

    tournamentData.push(tournamentDataEntry);
    data.push(dataEmpty);
  }
}


//from page
function createCombatSerialLetter(tournamentData){

  const templateCombatDoc = DriveApp.getFileById('1EC4g0wBJJfR48WFcKWC7rtml-LAR2Tel0i0YhkAuPvc');

  var files = appFolder.getFilesByName("Quyen");
  while (files.hasNext()) {//If there is another element in the iterator
    var thisFile = files.next();
    thisFile.setTrashed(true);
  };

  const newDoc = templateCombatDoc.makeCopy(appFolder);
  newDoc.setName("Quyen");

  var columnHeaders = tournamentData[0];
  
  const doc = DocumentApp.openById(newDoc.getId());
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

  //add one more copy (last page has graphic multiplied...)
  var replacementBody = bodyCopy.copy();
  replacementBody.appendPageBreak();
  copyBody(replacementBody, body);

  doc.saveAndClose();
}