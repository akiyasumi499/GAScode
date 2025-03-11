function getSubscribedChannels() {
  var results = YouTube.Subscriptions.list('snippet', {
    'mine': true,
    'maxResults': 5000
  });

  var channelIds = [];

  if (results.items && results.items.length > 0) {
    for (var i = 0; i < results.items.length; i++) {
      var item = results.items[i];
      var channelId = item.snippet.resourceId.channelId;
      Logger.log('Subscribed to Channel ID: ' + channelId);
      channelIds.push(channelId);
    }
  }

  // 次のページの結果を取得するための処理
  while (results.nextPageToken) {
    results = YouTube.Subscriptions.list('snippet', {
      'mine': true,
      'maxResults': 5000,
      'pageToken': results.nextPageToken
    });

    if (results.items && results.items.length > 0) {
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
  var results = YouTube.Search.list('snippet', {
    'channelId': channelId,
    'order': 'date',
    'publishedAfter': todayStr + 'T00:00:00Z',
    'maxResults': 5000
  });

  var videoIds = [];

  if (results.items && results.items.length > 0) {
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
    var response = YouTube.PlaylistItems.insert(requestData, 'snippet');
    Logger.log('Video added to playlist: ' + videoId);
  });
}



function main() {
  var channelIds = getSubscribedChannels();
  var playlistId = 'PLd4dsbwAm4kE_2YCo32a-qjW7NWsHxlZT';  // 追加先の再生リストID

  channelIds.forEach(function(channelId) {
    var videoIds = getLatestVideos(channelId);
    if (videoIds.length > 0) {
      addVideosToPlaylist(videoIds, playlistId);
    }
  });
}





















