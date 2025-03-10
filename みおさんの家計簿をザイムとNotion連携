// Zaim APIキーとNotion APIキーを設定
const ZAIM_API_KEY = 'YOUR_ZAIM_API_KEY';
const ZAIM_API_SECRET = 'YOUR_ZAIM_API_SECRET';
const NOTION_API_KEY = 'YOUR_NOTION_API_KEY';
const NOTION_DATABASE_ID = 'YOUR_DATABASE_ID';

// Zaimからレシートデータを取得する関数
function fetchZaimReceipts() {
  const url = 'https://api.zaim.net/v2/home/money'; // ZaimのAPIエンドポイント
  const options = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + ZAIM_API_KEY,
    },
  };
  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());
  
  return data.money; // レシート情報を返す
}

// Notionにデータを送信する関数
function sendToNotion(receipts) {
  const url = 'https://api.notion.com/v1/pages';
  receipts.forEach(receipt => {
    const options = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + NOTION_API_KEY,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      payload: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          Name: { title: [{ text: { content: receipt.name } }] },
          Amount: { number: receipt.amount },
          Date: { date: { start: receipt.date } },
        },
      }),
    };
    UrlFetchApp.fetch(url, options);
  });
}

// メイン関数
function transferReceiptsToNotion() {
  const receipts = fetchZaimReceipts();
  sendToNotion(receipts);
}
