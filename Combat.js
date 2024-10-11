//-> wenn gerade Anzahl und mindestens ein 2-er Team vorhanden ist wird der Teamname angezeigt nicht der Kämpfername

var maxFightersPerGroup = 5;

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

  for(var i=0;i<combatColumns.length;i++){
    addToCombatList(combatColumns[i], combatCategories[i], sourceValues, data,tournamentData);
  }

  tournamentData = tournamentData[0].map((_, i) => tournamentData.map(row => row[i]));

  combatSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  combatTournamentSheet.getRange(1, 1, tournamentData.length, tournamentData[0].length).setValues(tournamentData);
}

function addToCombatList(column, categories, sourceValues, data, tournamentData){
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

    //-> Name für anzeige in Turnier, unten noch Name + Team aller kämpfenden
    data.push(titleMale);
    for(var j=0;j<tmpDataMale.length;j++){
      data.push(tmpDataMale[j]);
    }
    data.push(dataEmpty);
    createTournamentData(categories[i]+' '+male, tmpDataMale, tournamentData);

    data.push(titleFemale);
    for(var j=0;j<tmpDataFemale.length;j++){
      data.push(tmpDataFemale[j]);
    }
    data.push(dataEmpty);
    createTournamentData(categories[i]+' '+female, tmpDataFemale, tournamentData);
  }
}

function createTournamentData(category, fightersIn, tournamentData){
  var fighters = [];
  var teams = [];

  var hasTeams = false;
  var column = tournamentData.length-1;

  for(var i=0;i<fightersIn.length;i++){
    fighters.push([fightersIn[i][3],[fightersIn[i][0]+' - '+fightersIn[i][3]]]); //name & displayname for list
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
        if(teams[j][0] == fightersIn[i][0]){
          hasTeams = true;
          membercount[j]+=1;
          teams[j][1].push(fighters[i][1][0]);
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

    var rows = [];

    rows.push([category+' Gruppe'+(i+1)])
    var fightIndex = 0;
    for(;fightIndex<fights.length;fightIndex++){
      rows.push([fights[fightIndex][0][0]]);
      rows.push([fights[fightIndex][1][0]]);
      rows.push([null]);
    }
    
    //fill empty fights
    for(;rows.length<1+10*3;){//title + 3 lines per fight max 10 fights
      rows.push([null]);
    }

    //create list of fighters in round
    var fighterLines=0;
    if(fighters.length > 0){
      for(var fighterIndex=0;fighterIndex<group.length;fighterIndex++){
        var fighter = group[fighterIndex];

        for(var fighterIndex2=0;fighterIndex2<fighter[1].length;fighterIndex2++){
          rows.push([fighter[1][fighterIndex2]]);
          fighterLines ++;
        }
      }
    }

    
    //fill empty fighters
    for(;rows.length<1+10*3+5*3;){//title + 3 lines per fight max 10 fights
      rows.push([null]);
    }

    tournamentData.push([]);
    column++;
    tournamentData[column]=rows;
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
      rows.push([null]);
    }

    //fill empty rows
    for(;rows.length<1+10*3+5*3;){//title + 3 lines per fight max 10 fights
      rows.push([null]);
    }
    tournamentData.push([]);
    column++;
    tournamentData[column]=rows;
  }
}