function createDailyNote() {
  var templateFile = DriveApp.getFileById('1utYDYjWZ27ZdyQ7d85NP78DDFb7EQqGTHfshpOC0AA0');
  var folder = DriveApp.getFolderById('1DvYUE3g1FJxf1QvAy6z-WcQ8AHhm-dUJ');

  var today = new Date();
  var formattedDate = Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var newFileName = 'Daily Note - ' + formattedDate;
  
  // テンプレートファイルの内容を読み込む
  var doc = DocumentApp.openById(templateFile.getId());
  var content = doc.getBody().getText();
  
  // 新しいファイルをMarkdown形式で作成し、内容を書き込む
  var blob = Utilities.newBlob(content, 'text/markdown', newFileName + '.md');
  folder.createFile(blob);
}

function createTrigger() {
  ScriptApp.newTrigger('createDailyNote')
           .timeBased()
           .everyDays(1)
           .atHour(8)
           .create();
}
