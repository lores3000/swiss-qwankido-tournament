
function createQuyenSynchroList(){
  init();
  var intermediateSheet = spreadsheet.getSheetByName(intermediateSheetName);
  var range = intermediateSheet.getDataRange();
  var sourceValues = range.getValues();

  var quyenSynchroSheet = createOrReplaceSheet(quyenSynchroSheetName);

  var data = [];

  data.push(sourceValues[0]);

  for(var i=0;i<quyenSynchroColumns.length;i++){
    addToQuyenSynchroList(quyenSynchroColumns[i]/*,quyenSynchroCategories[i]*/,quyenSynchroTeamColumns[i], sourceValues, data);
  }

  quyenSynchroSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}

function sortByClubAndTeam(dataToSort, teamColumn){

  //get all clubs
  var clubs = [];
  for(var i=0;i<dataToSort.length;i++){
    var found = false;
    for(var j=0;j<clubs.length;j++){
      if(clubs[j]==dataToSort[i][clubColumn]){
        found = true;
      }
    }
    if(!found){
      clubs.push(dataToSort[i][0]);
    }
  }


  //get all teams
  var teams = [];
  for(var i=0;i<dataToSort.length;i++){
    var found = false;
    for(var j=0;j<teams.length;j++){
      if(teams[j]==dataToSort[i][teamColumn]){
        found = true;
      }
    }
    if(!found){
      teams.push(dataToSort[i][teamColumn]);
    }
  }

  var sorted = [];

  for(var i=0;i<clubs.length;i++){
    for(var j=0;j<teams.length;j++){
      for(var k=0;k<dataToSort.length;k++){
        if(dataToSort[k][clubColumn] == clubs[i] && dataToSort[k][teamColumn] == teams[j]){
          sorted.push(dataToSort[k]);
        }
      }
    }
  }

  return sorted;
}

function addToQuyenSynchroList(column, /*categories,*/ teamColumn, sourceValues, data){
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

  //todo group by synchro teams

  for(var i=0;i<categories.length;i++){
    var titleMale = [];
    var titleFemale = [];
    var tmpDataMale = [];
    var tmpDataFemale = [];
    var dataEmpty = [];
    var clubs = [];
    //var teams = [];

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

    //sort by club and team
    tmpDataMale = sortByClubAndTeam(tmpDataMale,teamColumn);
    tmpDataFemale = sortByClubAndTeam(tmpDataFemale,teamColumn);

    data.push(titleMale);
    var lastTeam = null;
    var lastClub = null;
    for(var j=0;j<tmpDataMale.length;j++){
      if(j!=0 && lastClub != tmpDataMale[j][clubColumn]||lastTeam != tmpDataMale[j][teamColumn]){
        data.push(dataEmpty);
      }
      data.push(tmpDataMale[j]);
      lastClub = tmpDataMale[j][clubColumn];
      lastTeam = tmpDataMale[j][teamColumn];
    }
    data.push(dataEmpty);
    data.push(titleFemale);
    for(var j=0;j<tmpDataFemale.length;j++){
      if(j!=0 && lastClub != tmpDataFemale[j][clubColumn]||lastTeam != tmpDataFemale[j][teamColumn]){
        data.push(dataEmpty);
      }
      data.push(tmpDataFemale[j]);
      lastClub = tmpDataFemale[j][clubColumn];
      lastTeam = tmpDataFemale[j][teamColumn];
    }
    data.push(dataEmpty);
  }
}