var maxEntriesPerSheet = 14;

//create headers for 14 fighters
var sheetHeader = ["Category",
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
  tournamentData.push(sheetHeader);

  for(var i=0;i<quyenColumns.length;i++){
    addToQuyenList(quyenColumns[i]/*,quyenCategories[i]*/, sourceValues, data, tournamentData);
  }

  quyenSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  createSerialLetter('1EC4g0wBJJfR48WFcKWC7rtml-LAR2Tel0i0YhkAuPvc','Quyen',tournamentData,false);
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
    tournamentDataEntry.push(categories[i]);

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

    for(var j=tmpData.length;j<maxEntriesPerSheet;j++){
      tournamentDataEntry.push([]);
      tournamentDataEntry.push([]);
    }
    data.push(dataEmpty);
  }

  tournamentData.push(tournamentDataEntry);
}

