var configurationSheetName = 'Konfiguration';
var sourceSheetName = 'SwissCup2024';
var intermediateSheetName = 'Teilnehmer';
var quyenSheetName = 'Quyen';
var quyenSynchroSheetName = 'QuyenSynchro'
var combatSheetName = 'Combat'
var combatTournamentSheetName = 'Combat Turnier'
var songLuyenSheetName = 'Song Luyen'

var male = 'männlich';
var female = 'weiblich';

var sourceSheetTournamentDateCell = 'B2';

var ageColum = 'G'
var birthdateColum = 'C'

var genderColumn = 'B'
var nameColumn = 'D'

var clubColumn = 0;//'A'
var quyenColumns = [7,14,21,23] ;//['H','O','V','X']
var quyenWeaponColumns = [null,null,'W','Y']

var quyenSynchroColumns = [10,17,25];//['K','R','Z']
var quyenSynchroTeamColumns = [11,18,27];//['L','S','AB']
var quyenSynchroWeaponsColumns = [null,null,26];//[null,null,'AA']

var combatColumns = [8,15]; //['I','P']
var combatTeamColumns = ['J','Q']

var songLuyenColumns = [12,19,28];//['M','T','AC'];
var songLuyenTeamColumns = [13,20,30];//['N','U','AE'];
var songLuyenWeaponColumns = [null,null,29];//[null,null,'AD']
//unused atm: 'E', 'F', 'AF'

var quyenKidsCategories = []/*['A (7 – 8 Jahre bis 2. Cap Rot)',
  'B (9 – 10 Jahre bis 2. Cap Rot)',
  'C (11 – 12 Jahre bis 2. Cap Rot)',
  //todo missing D
  'D (7 – 8 Jahre ab 3. Cap Rot)',
  'E (9 – 10 Jahre ab 3. Cap Rot)',
  'F (11 – 12 Jahre ab 3. Cap Rot)',
];*/
var quyenAdultCategories = ['Erwachsene A (ab 16 Jahre bis 4. Cap Blau nur Männer)',
  'Erwachsene B (ab 16 Jahre bis 4. Cap Blau nur Frauen)',
  'Erwachsene C (ab 18 Jahre ab CN nur Männer)',
  'Erwachsene D (ab 18 Jahre ab CN nur Frauen)',
  'Junior A (13 – 15 Jahre bis 4. Cap Blau nur Jungs)',
  //todo missing B
];
var quyenWoodWeaponsCategories = ['Erwachsene H (ab 16 Jahre Frauen & Männer)',
  //todo missing ?
];
var quyenSteelWeaponsCategories = ['Erwachsene S (ab 16 Jahre Frauen & Männer)',
  //todo missing ?
];
//todo mixed gender categories -> manually
var quyenCategories = [quyenKidsCategories,quyenAdultCategories,quyenWoodWeaponsCategories,quyenSteelWeaponsCategories]

var quyenSynchroKidsCategories = ['Kid (9 – 12 Jahre ab 1. Cap Rot)',
];
var quyenSynchroAdultCategories = ['Junioren  (ab 13 Jahre)',
  'Erwachsene (ab 16 Jahren)',
  //todo missing B
];
var quyenSynchroWeaponsCategories = ['todo'
  //todo missing ?
];
//todo mixed gender categories -> manually
var quyenSynchroCategories = [quyenSynchroKidsCategories,quyenSynchroAdultCategories,quyenSynchroWeaponsCategories]

var songLuyenKidsCategories = ['Song Luyên – QKD (9 – 12 Jahre)',
];
var songLuyenAdultCategories = ['Song Luyên – QKD (13 – 15 Jahre Mädchen & Jungs)',
  'Song Luyên – QKD (ab 16 Jahre Frauen & Männer)',
  //todo missing B
];
var songLuyenWeaponsCategories = ['Song Luyên – CVD (ab 16 Jahre Frauen & Männer)'
  //todo missing ?
];
var songLuyenCategories = [songLuyenKidsCategories,songLuyenAdultCategories,songLuyenWeaponsCategories]

var combatKidsCategories = [
'Combat A (7 – 8 Jahre Alle nur Mädchen)',
'Combat B (9 – 10 Jahre bis 2. Cap Rot nur Mädchen)',
'Combat C (9 – 10 Jahre ab 3. Cap Rot nur Mädchen)',
'Combat D (11 – 12 Jahre bis 2. Cap Rot nur Mädchen)',
'Combat E (11 – 12 Jahre ab 3. Cap Rot nur Mädchen)',
'Combat F (7 – 8 Jahre Alle nur Knaben)',
'Combat G (9 – 10 Jahre bis 2. Cap Rot nur Knaben)',
//todo missing H
'Combat I (11 – 12 Jahre bis 2. Cap Rot nur Knaben)',
'Combat J (11 – 12 Jahre ab 3. Cap Rot nur Knaben)',
  //todo missing ?
];

var combatAdultCategories = [
  'Erwachsene A (ab 16 Jahre bis 3. Cap nur Frauen)',
  'Erwachsene B (ab 16 Jahre bis 3. Cap nur Männer)',
  'Erwachsene C (ab 16 Jahre Ab 4. Cap nur Frauen)',
  'Erwachsene D (ab 16 Jahre Ab 4. Cap nur Männer)',
  //todo missing Junior A
  'Junior B (13 – 15 Jahre bis 3. Cap nur Jungs)',
  //todo missing ?
];

var combatCategories = [combatKidsCategories,combatAdultCategories]

var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

var initialized = false;

function fillArray(sourceData, column, startRow){
  var array = [];
  for(var i=startRow;i<sourceData.length && sourceData[i][column];i++){
    array.push(sourceData[i][column])
  }
  return array;
}

function init(){
  if(initialized) return;
  var config = spreadsheet.getSheetByName(configurationSheetName).getDataRange().getValues();
  configurationSheetName = config[1][1]
  sourceSheetTournamentDateCell = config[1][2];

  ageColum = config[1][3]
  birthdateColum = config[1][4]
  nameColumn = config[1][5]
  clubColumn = config[1][6]

  var startRow = 5;
  quyenColumns = fillArray(config, 0, startRow);
  quyenWeaponColumns = fillArray(config, 1, startRow);
  quyenKidsCategories=fillArray(config, 2, startRow);
  quyenAdultCategories=fillArray(config, 3, startRow);
  quyenWoodWeaponsCategories=fillArray(config, 4, startRow);
  quyenSteelWeaponsCategories=fillArray(config, 5, startRow);

  var startRow = 15;
  quyenSynchroColumns = fillArray(config, 0, startRow);
  quyenSynchroTeamColumns = fillArray(config, 1, startRow);
  quyenSynchroWeaponsColumns = fillArray(config, 2, startRow);
  quyenSynchroKidsCategories = fillArray(config, 3, startRow);
  quyenSynchroAdultCategories = fillArray(config, 4, startRow);
  quyenSynchroWeaponsCategories = fillArray(config, 5, startRow);

  var startRow = 25;
  combatColumns = fillArray(config, 0, startRow);
  combatTeamColumns = fillArray(config, 1, startRow);
  combatKidsCategories = fillArray(config, 2, startRow);
  combatAdultCategories = fillArray(config, 3, startRow);

  var startRow = 40;
  songLuyenColumns = fillArray(config, 0, startRow);
  songLuyenTeamColumns = fillArray(config, 1, startRow);
  songLuyenWeaponColumns = fillArray(config, 2, startRow);

  songLuyenKidsCategories = fillArray(config, 3, startRow);
  songLuyenAdultCategories = fillArray(config, 4, startRow);
  songLuyenWeaponsCategories = fillArray(config, 5, startRow);
  initialized = true;

}
