const apiKeyIndex = 0;
const apiKeys = ['YOUR_API_KEY_1', 'YOUR_API_KEY_2', 'YOUR_API_KEY_3'];

function getYouTubeApiUrl(endpoint, params) {
  const baseUrl = 'https://www.googleapis.com/youtube/v3/' + endpoint;
  params.key = apiKeys[apiKeyIndex];
  const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
  return `${baseUrl}?${queryString}`;
}

function switchApiKey() {
  apiKeyIndex = (apiKeyIndex + 1) % apiKeys.length;
}

function fetchFromYouTubeApi(endpoint, params) {
  const url = getYouTubeApiUrl(endpoint, params);
  const response = UrlFetchApp.fetch(url);
  const json = JSON.parse(response.getContentText());
  return json;
}

function getSubscribedChannels() {
  var results, errorMessage;
  var maxResultsPerPage = 100;
  var retryCount = 0;
  var maxRetries = 3;

  do {
    try {
      results = fetchFromYouTubeApi('subscriptions', {
        'part': 'snippet',
        'mine': true,
        'maxResults': maxResultsPerPage
      });
      break; // 成功した場合はループを抜ける
    } catch (e) {
      Logger.log('Error: ' + e.message);
      if (e.message.includes('quota') && retryCount < maxRetries) {
        Logger.log('Retrying in 15 minutes...');
        Utilities.sleep(1000 * 60 * 15); // 15分待機
        retryCount++;
        switchApiKey(); // APIキーを切り替え
      } else {
        errorMessage = 'API call quota exceeded. Please wait and try again later.';
        return errorMessage;
      }
    }
  } while (retryCount < maxRetries);

  var channelIds = [];
  if (results && results.items && results.items.length > 0) {
    for (var i = 0; i < results.items.length; i++) {
      var item = results.items[i];
      var channelId = item.snippet.resourceId.channelId;
      Logger.log('Subscribed to Channel ID: ' + channelId);
      channelIds.push(channelId);
    }
  }

  while (results.nextPageToken) {
    retryCount = 0;
    do {
      try {
        results = fetchFromYouTubeApi('subscriptions', {
          'part': 'snippet',
          'mine': true,
          'maxResults': maxResultsPerPage,
          'pageToken': results.nextPageToken
        });
        break; // 成功した場合はループを抜ける
      } catch (e) {
        Logger.log('Error: ' + e.message);
        if (e.message.includes('quota') && retryCount < maxRetries) {
          Logger.log('Retrying in 15 minutes...');
          Utilities.sleep(1000 * 60 * 15); // 15分待機
          retryCount++;
          switchApiKey(); // APIキーを切り替え
        } else {
          errorMessage = 'API call quota exceeded. Please wait and try again later.';
          return errorMessage;
        }
      }
    } while (retryCount < maxRetries);

    if (results && results.items && results.items.length > 0) {
      for (var i = 0; i < results.items.length; i++) {
        var item = results.items[i];
        var channelId = item.snippet.resourceId.channelId;
        Logger.log('Subscribed to Channel ID: ' + channelId);
        channelIds.push(channelId);
      }
    }
  }

  return channelIds;
}

function getLatestVideos(channelId) {
  var today = new Date();
  var todayStr = Utilities.formatDate(today, 'JST', 'yyyy-MM-dd');
  var results, errorMessage;
  var retryCount = 0;
  var maxRetries = 3;
  
  do {
    try {
      results = fetchFromYouTubeApi('search', {
        'part': 'snippet',
        'channelId': channelId,
        'order': 'date',
        'publishedAfter': todayStr + 'T00:00:00Z',
        'maxResults': 100
      });
      break; // 成功した場合はループを抜ける
    } catch (e) {
      Logger.log('Error: ' + e.message);
      if (e.message.includes('quota') && retryCount < maxRetries) {
        Logger.log('Retrying in 15 minutes...');
        Utilities.sleep(1000 * 60 * 15); // 15分待機
        retryCount++;
        switchApiKey(); // APIキーを切り替え
      } else {
        errorMessage = 'API call quota exceeded. Please wait and try again later.';
        return errorMessage;
      }
    }
  } while (retryCount < maxRetries);

  var videoIds = [];

  if (results && results.items && results.items.length > 0) {
    for (var i = 0; i < results.items.length; i++) {
      var item = results.items[i];
      var videoId = item.id.videoId;
      Logger.log('Latest Video ID: ' + videoId);
      videoIds.push(videoId);
    }
  }

  return videoIds;
}

function addVideosToPlaylist(videoIds, playlistId) {
  videoIds.forEach(function(videoId) {
    var requestData = {
      'snippet': {
        'playlistId': playlistId,
        'resourceId': {
          'kind': 'youtube#video',
          'videoId': videoId
        }
      }
    };
    try {
      var response = fetchFromYouTubeApi('playlistItems', {
        'part': 'snippet'
      }, requestData);
      Logger.log('Video added to playlist: ' + videoId);
    } catch (e) {
      Logger.log('Error adding video to playlist: ' + e.message);
    }
  });
}

function main() {
  var channelIds = getSubscribedChannels();
  if (typeof channelIds === 'string') {
    Logger.log(channelIds);
    return;
  }
  
  var playlistId = 'PLd4dsbwAm4kE_2YCo32a-qjW7NWsHxlZT';  // 追加先の再生リストID

  channelIds.forEach(function(channelId) {
    var videoIds = getLatestVideos(channelId);
    if (typeof videoIds === 'string') {
      Logger.log(videoIds);
      return;
    }
    
    if (videoIds.length > 0) {
      addVideosToPlaylist(videoIds, playlistId);
    }
  });
}
