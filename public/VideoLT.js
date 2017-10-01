function onYouTubeIframeAPIReady() {
  const domElement = document.querySelector('div[ng-controller]');
  angular.element(domElement).controller().init();
}

class VideoLTController {
  constructor($timeout, $http) {
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    this.done = false;
    this.url = 'IsZLX6hW3wg';
    this.hashtag = '#ADP2017';
    this.date = new Date('2017-09-25 23:00');
    this.$timeout = $timeout;
    this.$http = $http;
    this.toggleLabel = 'Play';
    this.host = 'http://localhost:3000';
  }

  init() {
    this.player = new YT.Player("player", {
      height: "360",
      width: "640",
      videoId: this.url,
      events: {
        onStateChange: this.onPlayerStateChange.bind(this)
      }
    });
  }

  toggle() {
    this.toggleLabel === 'Play' ? this.play() : this.pause();
  }

  play() {
    this.toggleLabel = 'Pause';
    this.player.playVideo();

    var dateString = this.dateStr(this.date);
    var tomorrow = new Date(this.date.getTime() + 25 * 60 * 60 * 1000);
    const twitterURL = this.host + '/tweets?f=realtime&src=typd&q=' + encodeURIComponent(
      this.hashtag
      + ' since:' + dateString)
      + ' until:' + this.dateStr(tomorrow)
    ;
    console.log('twitterURL', twitterURL);
    var tweetsSection = document.querySelector('#live-tweets ol');
    this.$http.get(twitterURL)
      .then(function (result) {
        var statuses = result.data;
        for (var i = 0; i < statuses.length; ++i) {
          var status = statuses[i];
          /*twttr.widgets.createTweet(status.id, tweetsSection)
            .then(function (result) {
              console.log('Added tweet: ', status);
            })
            .catch(function (error) {
              console.log('Could not add tweet: ', error);
            });*/
          var li = document.createElement('li');
          var tweetDiv = document.createElement('div');
          tweetDiv.className = 'tweet';

          var date = document.createElement('time');
          date.innerText = status.created_at;
          tweetDiv.appendChild(date);

          var text = document.createElement('div');
          text.className = 'text';
          text.innerText = status.text;
          tweetDiv.appendChild(text);

          li.appendChild(tweetDiv);
          tweetsSection.appendChild(li);
        }
      })
      .catch(function (error) {
        console.log('error: ', error);
      });
  }

  dateStr(date) {
    var dateString = date.toISOString();
    dateString = dateString.substring(0, dateString.indexOf('T'));
//    dateString = dateString.replace('T', ' ').replace('.000Z', '');
    return dateString;
  }

  pause() {
    this.toggleLabel = 'Play';
    this.player.pauseVideo();
  }

  reset() {
    this.player.stopVideo();
  }

  onPlayerStateChange(event) {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        if (!this.done) {
          setTimeout(this.reset.bind(this), 6000);
          this.done = true;
        }
        break;
    }
  }
}

angular
  .module("VideoLT", [])
  .controller("VideoLTController", VideoLTController);
