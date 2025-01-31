var configurationSheetName = 'Konfiguration';

var sourceSheetFile = '';
var sourceSheetName = 'SwissCup2024';
var destinationSheetName = 'QKD Generiert'
var intermediateSheetName = 'Teilnehmer';
var quyenSheetName = 'Quyen';
var quyenSynchroSheetName = 'QuyenSynchro'
var combatSheetName = 'Combat'
var combatTournamentSheetName = 'Combat Turnier'
var songLuyenSheetName = 'Song Luyen'

var startrowforsourcedata = 5; //erste Zeile der 'Nutzdaten'

var male = 'männlich';
var female = 'weiblich';

var sourceSheetTournamentDateCell = 'B2'; //wo ist das Datum gespeichert

var ageColum = 'G'
var birthdateColum = 'C'

var genderColumn = 'B'
var nameColumn = 'D'
var nameColumnId = 0;//'D'

var clubColumn = 'F';//'A'
var clubColumnId = 0;//'A'

var rankColumn = 'G';//'G'
var rankColumnId = 0;//'G'

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
var appSheet = SpreadsheetApp.getActiveSpreadsheet(); //app stuff
var appFile = DriveApp.getFileById(appSheet.getId());
var appFolder = appFile.getParents().next();

//create destination folder if it does not exist
var datestring = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd.MM.yyyy");
var folders = appFolder.getFoldersByName('QKD Generiert '+datestring);
if(!folders.hasNext()){
  appFolder.createFolder('QKD Generiert '+datestring);
}
var destFolder = appFolder.getFoldersByName('QKD Generiert '+datestring).next();

var spreadsheet;


var initialized = false;

function fillArray(sourceData, column, startRow){
  var array = [];
  for(var i=startRow;i<sourceData.length && sourceData[i][column];i++){
    array.push(sourceData[i][column])
  }
  return array;
}

function init(replacesheet){
  if(initialized) return;

  var config = appSheet.getSheetByName(configurationSheetName).getDataRange().getValues();

  var column = 0;
  sourceSheetFile = config[1][column++]
  sourceSheetName = config[1][column++]
  destinationSheetName = config[1][column++]
  sourceSheetTournamentDateCell = config[1][column++];

  ageColumName = config[1][column++]
  birthdateColum = config[1][column++]
  nameColumn = config[1][column++]
  clubColumn = config[1][column++]

  nameColumnId = nameColumn.charCodeAt(0) - 65;
  clubColumnId = clubColumn.charCodeAt(0) - 65;
  rankColumnId = rankColumn.charCodeAt(0) - 65;

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
  combatWeaponsCategories = fillArray(config, 4, startRow);

  var startRow = 40;
  songLuyenColumns = fillArray(config, 0, startRow);
  songLuyenTeamColumns = fillArray(config, 1, startRow);
  songLuyenWeaponColumns = fillArray(config, 2, startRow);

  songLuyenKidsCategories = fillArray(config, 3, startRow);
  songLuyenAdultCategories = fillArray(config, 4, startRow);
  songLuyenWeaponsCategories = fillArray(config, 5, startRow);


  var existing_spreadsheet = destFolder.getFilesByName(destinationSheetName);
  if(!existing_spreadsheet.hasNext()){
    var resource = {
      title: destinationSheetName,
      mimeType: MimeType.GOOGLE_SHEETS,
      parents: [{ id: destFolder.getId() }]
    };
    Drive.Files.insert(resource);
  }

  spreadsheet = SpreadsheetApp.open(destFolder.getFilesByName(destinationSheetName).next());

  initialized = true;
}
