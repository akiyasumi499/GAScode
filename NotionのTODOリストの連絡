function getNotionTasks() {
  var notionApiKey = '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';
  var databaseId = '19e3669b820481f584dac980e9bae64e';

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + notionApiKey,
      'Notion-Version': '2022-06-28'
    },
    payload: JSON.stringify({
      page_size: 10 // 取得するタスクの数
    })
  };

  var response = UrlFetchApp.fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, options);
  var data = JSON.parse(response.getContentText());
  return data.results.map(task => task.properties.Name.title[0].text.content);
}
function sendLineNotification(message) {
  var token = 'M7mmLbUyvUMpSvCvARyISWhh1DVuMjeswicVrwAt8mj5YlDBefqgsTs3RH59siCZMuYpuCSg2Z/nUpNc2vTKhAx+5FAG4i95aehlio6056t3tL2EpRRdY2B1xetx3cwNdvABuiz6e4Ma7qKxmcUn7AdB04t89/1O/w1cDnyilFU=';
  var userId = 'U916f42b6d698639b78a026f10afc3288';




  var url = 'https://api.line.me/v2/bot/message/push';
  var options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    payload: JSON.stringify({
      to: userId,
      messages: [{
        type: 'text',
        text: message
      }]
    })
  };

  UrlFetchApp.fetch(url, options);
}
