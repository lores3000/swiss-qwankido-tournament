var maxSongLuyenTeamsPerSheet = 7;

//create headers for 14 fighters
var songLuyenSheetHeader = ["Category",
  "Fighter1 Name", "Fighter1 Rank","Fighter1 Club",
  "Fighter2 Name", "Fighter2 Rank","Fighter2 Club",
  "Fighter3 Name", "Fighter3 Rank","Fighter3 Club",
  "Fighter4 Name", "Fighter4 Rank","Fighter4 Club",
  "Fighter5 Name", "Fighter5 Rank","Fighter5 Club",
  "Fighter6 Name", "Fighter6 Rank","Fighter6 Club",
  "Fighter7 Name", "Fighter7 Rank","Fighter7 Club",
  "Fighter8 Name", "Fighter8 Rank","Fighter8 Club",
  "Fighter9 Name", "Fighter9 Rank","Fighter9 Club",
  "Fighter10 Name", "Fighter10 Rank","Fighter10 Club",
  "Fighter11 Name", "Fighter11 Rank","Fighter11 Club",
  "Fighter12 Name", "Fighter12 Rank","Fighter12 Club",
  "Fighter13 Name", "Fighter13 Rank","Fighter13 Club",
  "Fighter14 Name", "Fighter14 Rank","Fighter14 Club",
];

function createsongLuyenList(){
  init();
  var intermediateSheet = spreadsheet.getSheetByName(intermediateSheetName);
  var range = intermediateSheet.getDataRange();
  var sourceValues = range.getValues();

  var songLuyenSheet = createOrReplaceSheet(songLuyenSheetName);

  var data = [];
  var tournamentData = [];

  data.push(sourceValues[0]);
  tournamentData.push(songLuyenSheetHeader);

  for(var i=0;i<songLuyenColumns.length;i++){
    addTosongLuyenList(songLuyenColumns[i],/*songLuyenCategories[i],*/songLuyenTeamColumns[i], sourceValues, data, tournamentData);
  }

  songLuyenSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  createSerialLetter('15iKlL6Aw9-GPYCX1lDLPw3a5dWftqMV1DWICqFh559k','SongLuyen',tournamentData,false);
}

function sortByClubAndTeam(dataToSort, teamColumn){

  //get all clubs
  var clubs = [];
  for(var i=0;i<dataToSort.length;i++){
    var found = false;
    for(var j=0;j<clubs.length;j++){
      if(clubs[j]==dataToSort[i][clubColumnId]){
        found = true;
      }
    }
    if(!found){
      clubs.push(dataToSort[i][clubColumnId]);
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
        if(dataToSort[k][clubColumnId] == clubs[i] && dataToSort[k][teamColumn] == teams[j]){
          sorted.push(dataToSort[k]);
        }
      }
    }
  }

  return sorted;
}

function addTosongLuyenList(column, /*categories,*/ teamColumn, sourceValues, data, tournamentData){
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
    var tournamentDataEntry = [];
    var title = [];
    var tmpData = [];
    var dataEmpty = [];
    var clubs = [];
    //var teams = [];

    for(var j=0;j<data[0].length;j++){
      title.push([]);
      dataEmpty.push([]);
    }

    title[0]=categories[i];

    for(var j=1;j<sourceValues.length;j++){
      var category = sourceValues[j][column]
      if(category == categories[i]){
          tmpData.push(sourceValues[j]);
      }
    }

    //sort by club and team
    tmpData = sortByClubAndTeam(tmpData,teamColumn);

    data.push(title);
    tournamentDataEntry.push(title[0]);
    var lastTeam = null;
    var lastClub = null;
    for(var j=0;j<tmpData.length;j++){
      if(j!=0 && lastClub != tmpData[j][clubColumnId]||lastTeam != tmpData[j][teamColumn]){
        data.push(dataEmpty);
      }
      data.push(tmpData[j]);

      tournamentDataEntry.push(tmpData[j][nameColumnId]);
      tournamentDataEntry.push(tmpData[j][rankColumnId]);
      tournamentDataEntry.push(tmpData[j][clubColumnId]);
      lastClub = tmpData[j][clubColumnId];
      lastTeam = tmpData[j][teamColumn];
    }
    data.push(dataEmpty);
    
    tournamentData.push(tournamentDataEntry);
  }
}