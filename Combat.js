//-> wenn gerade Anzahl und mindestens ein 2-er Team vorhanden ist wird der Teamname angezeigt nicht der Kämpfername

var maxFightersPerGroup = 5;
var combatHeader = ["Category","Fight1 Fighter1","Fight1 Fighter2","Fight2 Fighter1","Fight2 Fighter2","Fight3 Fighter1","Fight3 Fighter2","Fight4 Fighter1","Fight4 Fighter2","Fight5 Fighter1","Fight5 Fighter2","Fight6 Fighter1","Fight6 Fighter2","Fight7 Fighter1","Fight7 Fighter2","Fight8 Fighter1","Fight8 Fighter2","Fight9 Fighter1","Fight9 Fighter2","Fight10 Fighter1","Fight10 Fighter2","Combatant1","Combatant2","Combatant3","Combatant4","Combatant5","Combatant6","Combatant7","Combatant8","Combatant9","Combatant10"]

function createCombatLists(){
  init();
  var intermediateSheet = spreadsheet.getSheetByName(intermediateSheetName);
  var range = intermediateSheet.getDataRange();
  var sourceValues = range.getValues();

  var combatSheet = createOrReplaceSheet(combatSheetName);
  var combatTournamentSheet = createOrReplaceSheet(combatTournamentSheetName);

  var data = [];
  var tournamentData = [];

  data.push(sourceValues[0]);
  tournamentData.push(combatHeader);

  for(var i=0;i<combatColumns.length;i++){
    addToCombatList(combatColumns[i], combatTeamColumns[i], /*combatCategories[i],*/ sourceValues, data,tournamentData);
  }

  //Zeilen und Spalten 'drehen' //falsch -> eine Reihe sollte ein Eintrag sein - braucht noch Spaltenkopf!
  //tournamentData = tournamentData[0].map((_, i) => tournamentData.map(row => row[i]));

  combatSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  combatTournamentSheet.getRange(1, 1, tournamentData.length, tournamentData[0].length).setValues(tournamentData);

  createSerialLetter('1Pp8Mi8YfxQ9VOLXX9z7AZOxssaHucmHbi9FC51kZzoI','Combat',tournamentData, true);
}

function addToCombatList(column, teamColumn, /*categories,*/ sourceValues, data, tournamentData){
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
    var title = [];
    var tmpData = [];
    var dataEmpty = [];
    for(var j=0;j<data[0].length;j++){
      title.push([]);
      dataEmpty.push([]);
    }
    title[0] = categories[i];

    for(var j=1;j<sourceValues.length;j++){
      var category = sourceValues[j][column]
      if(category == categories[i]){
        tmpData.push(sourceValues[j]);
      }
    }

    //-> Name für anzeige in Turnier, unten noch Name + Team aller kämpfenden
    data.push(title);
    for(var j=0;j<tmpData.length;j++){
      data.push(tmpData[j]);
    }
    data.push(dataEmpty);
    createTournamentData(categories[i], teamColumn, tmpData, tournamentData);
  }
}

function createTournamentData(category, teamColumn, fightersIn, tournamentData){
  var fighters = [];
  var teams = [];
  //todo get Team from table

  var hasTeams = false;
  var row = tournamentData.length-1;

  for(var i=0;i<fightersIn.length;i++){
    fighters.push([fightersIn[i][nameColumnId],fightersIn[i][clubColumnId]+' - '+fightersIn[i][teamColumn]+' - '+fightersIn[i][nameColumnId]]); //name & displayname for list
  }

  if(fighters.length%2 == 0){
    //check if there is at least one club
    // replace fighters with club(s)
    //sort by clubs / count club members
    //assign fighters to clubs

    var membercount = [];
    var assigned = [];
    var newFighters = [];
    
    //find team names
    for(var i=0;i<fightersIn.length;i++){
      var ignore = false;
      for(var j=0;j<teams.length;j++){
        if(teams[j][0] == fightersIn[i][teamColumn]){
          hasTeams = true;
          membercount[j]+=1;
          teams[j][1].push(fighters[i][1][teamColumn]);
          ignore = true;
        }
      }
      if(!ignore){
        teams.push([fightersIn[i][0],fighters[i][1]]);
        membercount.push(1);
        assigned.push(false);
      }
    }

    //assign teams
    if(hasTeams){
      //assign complete teams first
      for(var i=0;i<teams.length;i++){
        if(membercount[i]==2){ //todo are there sometimes 3 or 4 people from the same team?
        //todo what about the combat teams? seems random...
          newFighters.push(teams[i]);
          assigned[i] = true;
        }
      }

      for(var i=0;i<teams.length;i++){
        if(membercount[i]==2){
          //newFighters.push(teams[i]);
          //assigned[i] = true;
        }else{
          //search for next member without team
          for(var j=i+1;j<teams.length;j++){
            if(membercount[j]==1 && assigned[j] == false){
              assigned[i] = true;
              assigned[j] = true;
              newFighters.push([teams[i][0]+' - '+teams[j][0],[teams[i][1],teams[j][1]]]);
              break;
            }
          }
        }
      }
      fighters = newFighters;
    }
  }

  var groups = [];

  var groupCount = (fighters.length%maxFightersPerGroup == 0)? fighters.length / maxFightersPerGroup : Math.floor(fighters.length / maxFightersPerGroup)+1;
  var fighterIndex = 0;

  for(var i=0;i<groupCount;i++){
    groups.push([]);
  }
  

  var groupIndex = 0;
  while(fighterIndex<fighters.length){//not all fighters assigned yet
    groups[groupIndex].push(fighters[fighterIndex])
    groupIndex++;
    fighterIndex++;
    if(groupIndex == groups.length) groupIndex = 0;
  }

  for(var i=0;i<groupCount;i++){
    var group = groups[i];
    //assign each fighter to each other
    var fights = [];
    fighterIndex = 0;

    for(var fighter1 = fighterIndex;fighter1<group.length-1;fighter1++){
      for(var fighter2 = fighter1+1;fighter2<group.length;fighter2++){
        fights.push([group[fighter1],group[fighter2]]);
        
      }
    }

    var rowEntries = [];

    rowEntries.push([category+' Gruppe'+(i+1)])
    var fightIndex = 0;
    for(;fightIndex<fights.length;fightIndex++){
      rowEntries.push([fights[fightIndex][0][0]]);
      rowEntries.push([fights[fightIndex][1][0]]);
    }
    
    //fill empty fights
    for(;rowEntries.length<1+10*2;){//title + 2 columns per fight max 10 fights
      rowEntries.push([null]);
    }

    //create list of fighters in round
    var fighterLines=0;
    if(fighters.length > 0){
      for(var fighterIndex=0;fighterIndex<group.length;fighterIndex++){
        var fighter = group[fighterIndex];

        for(var fighterIndex2=0;fighterIndex2<fighter[1].length;fighterIndex2++){
          rowEntries.push([fighter[1][fighterIndex2]]);
          fighterLines ++;
        }
      }
    }

    
    //fill empty fighters
    for(;rowEntries.length<1+10*2+5*2;){//title + 2 lines per fight max 10 fights + max 2 fighters per team
      rowEntries.push([null]);
    }

    tournamentData.push([]);
    row++;
    tournamentData[row]=rowEntries;
  }

  if(groupCount > 1){
    //-> finale, sieger pro Gruppe
    var fights = [];
    fighterIndex = 0;
    var rows = [];

    for(var fighter1 = fighterIndex;fighter1<groupCount-1;fighter1++){
      for(var fighter2 = fighter1+1;fighter2<groupCount;fighter2++){
        fights.push(['Sieger Gruppe '+(fighter1+1),'Sieger Gruppe '+(fighter2+1)]);
      }
    }
    rows.push([category+' Finale'])

    for(var fightIndex = 0;fightIndex<fights.length;fightIndex++){
      rows.push([fights[fightIndex][0]]);
      rows.push([fights[fightIndex][1]]);
    }

    //fill empty rows
    for(;rows.length<1+10*2+5*2;){//title + 3 lines per fight max 10 fights
      rows.push([null]);
    }
    tournamentData.push([]);
    row++;
    tournamentData[row]=rows;
  }
}

function copyBody(source, destination){

    var totalElements = source.getNumChildren();
    for( var j = 0; j < totalElements; ++j ) {
      var element = source.getChild(j).copy();
      var type = element.getType();
      if( type == DocumentApp.ElementType.PARAGRAPH )
        destination.appendParagraph(element);
      else if( type == DocumentApp.ElementType.TABLE )
        destination.appendTable(element);
      else if( type == DocumentApp.ElementType.LIST_ITEM )
        destination.appendListItem(element);
      else
        throw new Error("According to the doc this type couldn't appear in the body: "+type);
    }


}
/*
//from table
function createCombatSerialLetter(tournamentData){

  const templateCombatDoc = DriveApp.getFileById('1QRNL9nPlNr1a5-j8eti2R1I4itmEDirY1IPlhqtQrT4');

  var files = appFolder.getFilesByName("Kämpfe");
  while (files.hasNext()) {//If there is another element in the iterator
    var thisFile = files.next();
    thisFile.setTrashed(true);
  };

  const newCombatDoc = templateCombatDoc.makeCopy(appFolder);
  newCombatDoc.setName("Kämpfe");

  var columnHeaders = tournamentData[0];
  

  const doc = SpreadsheetApp.openById(newCombatDoc.getId());
  var sheet = doc.getSheets()[0];

  var dataRange = sheet.getDataRange();
  //var activeRange = sheet.getActiveRange();
  //var dataRangeRows = dataRange.getNumRows();
  //var activeRangeRows = activeRange.getNumRows();

  var sourceRange = dataRange;// sheet.getRange(1,1,52,9);
  var rows = sourceRange.getNumRows();
  var columns = sourceRange.getNumColumns();
  var startRow = 1;

  for(var row=1;row<tournamentData.length;row++){
    var type = typeof(startRow);

    sourceRange = sheet.getRange(startRow, 1, rows, columns);
    if(row!= tournamentData.length-1){
      sourceRange.copyTo(sheet.getRange(startRow+rows, 1, rows, columns));
    }

//debug only...
    //var sourceRange = sheet.getDataRange();// sheet.getRange(1,1,52,9);
    var rowi = sourceRange.getRow();
    var coli = sourceRange.getColumn();
    rows = sourceRange.getNumRows();
    columns = sourceRange.getNumColumns();

    var values = sourceRange.getValues();

    for(var column=0;column<columnHeaders.length;column++){
      var search = '{'+columnHeaders[column]+'}';
      var rowdata = tournamentData[row];
      
      var replace = rowdata[column]? rowdata[column] : "";

      for(var searchrow=0;searchrow<values.length;searchrow++){
        for(var searchcolumn=0;searchcolumn<values[searchrow].length;searchcolumn++){
          var value = values[searchrow][searchcolumn];
          if(values[searchrow][searchcolumn] == search){
            values[searchrow][searchcolumn] = replace;
          }
        }
      }

      sourceRange.setValues(values);  
    }

    startRow += rows;
  }
    //copyBody(replacementBody, body);
}*/

