const LINE_ACCESS_TOKEN = "M7mmLbUyvUMpSvCvARyISWhh1DVuMjeswicVrwAt8mj5YlDBefqgsTs3RH59siCZMuYpuCSg2Z/nUpNc2vTKhAx+5FAG4i95aehlio6056t3tL2EpRRdY2B1xetx3cwNdvABuiz6e4Ma7qKxmcUn7AdB04t89/1O/w1cDnyilFU="; // LINE Notifyのアクセストークンをここに入力
const CITY_ID = 1859171; // 神戸の都市ID
const CALENDAR_ID = 'primary'; // 主要なカレンダーを使用

function sendDailyCalendarAndWeatherToLine() {
  var today = new Date();
  today.setHours(0, 0, 0, 0); // 今日の0時0分0秒に設定
  var tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // 明日の0時0分0秒に設定

  var events = CalendarApp.getCalendarById(CALENDAR_ID).getEvents(today, tomorrow);
  var message = "今日の予定:\n";

  if (events.length === 0) {
    message += "今日は予定がありません。\n";
  } else {
    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      message += event.getTitle() + " - " + event.getStartTime().toLocaleTimeString() + "\n";
    }
  }

  // 天気予報を追加
  try {
    var response = UrlFetchApp.fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${CITY_ID}&appid=c97208a24f2b3d2a46e9f15f7ddcb5ff&units=metric`);
    if (response.getResponseCode() === 200) {
      var json = JSON.parse(response.getContentText());
      var today_info = json.list[0];
      var tomorrow_info = json.list[1];
    
      message += `\n今日の天気:\n`;
      message += `朝: ${today_info.weather[0].main} (気温: ${today_info.main.temp} °C)\n`;
      message += `昼: ${json.list[8].weather[0].main} (気温: ${json.list[8].main.temp} °C)\n`;
      message += `夜: ${json.list[16].weather[0].main} (気温: ${json.list[16].main.temp} °C)\n`;
    } else {
      message += "\n天気予報の取得に失敗しました。";
    }
  } catch (e) {
    message += `\n天気予報の取得に失敗しました: ${e.message}`;
  }

  sendToLine(message);
}

function sendToLine(text) {
  const token = LINE_ACCESS_TOKEN;
  const options = {
    "method": "post",
    "payload": JSON.stringify({
      "to": "U916f42b6d698639b78a026f10afc3288", // 通知を送信するユーザーIDをここに入力
      "messages": [
        {
          "type": "text",
          "text": text
        }
      ]
    }),
    "contentType": "application/json",
    "headers": {
      "Authorization": "Bearer " + token
    }
  };
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", options);
}
