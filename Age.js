function generateAgeLists(){
  init();
  var intermediateSheet = spreadsheet.getSheetByName(intermediateSheetName);
  generateAgeList(7,8,intermediateSheet);
  generateAgeList(9,10,intermediateSheet);
  generateAgeList(11,12,intermediateSheet);
  generateAgeList(13,15,intermediateSheet);
  generateAgeList(16,99,intermediateSheet);
}

function generateAgeList(minimumAge, maximumAge, sourceSheet){
  var ageSheet = createOrReplaceSheet('Gen '+minimumAge+'-'+maximumAge+'J');
  var range = sourceSheet.getDataRange();
  var values = range.getValues();
  var data = [];
  for (var i = 0; i< values.length ; i++){
    var row = values[i];
    var age = row[6];
    if(i==0){ //push title column
      data.push(values[i])
    }else if(age >= minimumAge && age <= maximumAge){
      data.push(values[i])
    }
  }
  
  ageSheet.getRange(1, 1, data.length, data[0].length).setValues(data);

  //todo copy format of first row
}