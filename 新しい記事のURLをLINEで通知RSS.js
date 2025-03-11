const LINE_ACCESS_TOKEN = 'YOUR_LINE_ACCESS_TOKEN'; // LINEのチャンネルアクセストークンを設定
const TARGET_USER_ID = 'TARGET_USER_ID'; // 通知したいLINEのユーザーID
const RSS_FEED_URL = 'YOUR_RSS_FEED_URL'; // RSSフィードのURLを設定

// LINEにメッセージを送信する関数
function sendMessage(userId, message) {
  const url = 'https://api.line.me/v2/bot/message/push';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + LINE_ACCESS_TOKEN
  };
  const payload = JSON.stringify({
    'to': userId,
    'messages': [{'type': 'text', 'text': message}]
  });
  const options = {
    'method': 'post',
    'headers': headers,
    'payload': payload
  };
  
  UrlFetchApp.fetch(url, options);
}

// RSSフィードをチェックして新しい記事があるか確認する関数
function checkForNewArticles() {
  const response = UrlFetchApp.fetch(RSS_FEED_URL);
  const xml = XmlService.parse(response.getContentText());
  const items = xml.getRootElement().getChild('channel').getChildren('item');
  const lastCheck = PropertiesService.getScriptProperties().getProperty('lastCheck') || '';
  let newLastCheck = lastCheck;

  items.forEach(item => {
    const title = item.getChild('title').getText();
    const link = item.getChild('link').getText();
    const pubDate = new Date(item.getChild('pubDate').getText());

    if (pubDate > new Date(lastCheck)) {
      sendMessage(TARGET_USER_ID, `新しい記事: ${title}\nURL: ${link}`);
      if (pubDate > new Date(newLastCheck)) {
        newLastCheck = pubDate.toISOString();
      }
    }
  });

  PropertiesService.getScriptProperties().setProperty('lastCheck', newLastCheck);
}

// 定期的にRSSフィードをチェックするトリガーを設定する関数
function createTrigger() {
  ScriptApp.newTrigger('checkForNewArticles')
           .timeBased()
           .everyMinutes(30) // 30分ごとに実行
           .create();
}

// 初回実行時にトリガーを作成
function setup() {
  createTrigger();
  PropertiesService.getScriptProperties().setProperty('lastCheck', new Date().toISOString());
}
