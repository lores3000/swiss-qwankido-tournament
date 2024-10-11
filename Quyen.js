function createQuyenLists(){
  init();
  var intermediateSheet = spreadsheet.getSheetByName(intermediateSheetName);
  var range = intermediateSheet.getDataRange();
  var sourceValues = range.getValues();

  var quyenSheet = createOrReplaceSheet(quyenSheetName);

  var data = [];

  data.push(sourceValues[0]);

  for(var i=0;i<quyenColumns.length;i++){
    addToQuyenList(quyenColumns[i]/*,quyenCategories[i]*/, sourceValues, data);
  }

  quyenSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}

function addToQuyenList(column, /*categories,*/ sourceValues, data){
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

  for(var i=0;i<categories.length;i++){
    var titleMale = [];
    var titleFemale = [];
    var tmpDataMale = [];
    var tmpDataFemale = [];
    var dataEmpty = [];
    for(var j=0;j<data[0].length;j++){
      titleMale.push([]);
      titleFemale.push([]);
      dataEmpty.push([]);
    }
    titleMale[0]=categories[i]+' '+male;
    titleFemale[0]=categories[i]+' '+female;

    for(var j=1;j<sourceValues.length;j++){
      var category = sourceValues[j][column]
      if(category == categories[i]){
        if(sourceValues[j][1]==male){
          tmpDataMale.push(sourceValues[j]);
        }else{
          tmpDataFemale.push(sourceValues[j]);
        }
        
      }
    }

    data.push(titleMale);
    for(var j=0;j<tmpDataMale.length;j++){
      data.push(tmpDataMale[j]);
    }
    data.push(dataEmpty);
    data.push(titleFemale);
    for(var j=0;j<tmpDataFemale.length;j++){
      data.push(tmpDataFemale[j]);
    }
    data.push(dataEmpty);
  }
}