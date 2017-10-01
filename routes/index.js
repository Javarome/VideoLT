var express = require('express');
var router = express.Router();
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

router.get('/tweets', function(req, res, next) {
  client.get('search/tweets', req.query, function(error, tweets, response) {
    if (!error) {
      console.log('Found ' + tweets.length + ' tweets');
      res.send(tweets.statuses);
    }
  });
});

module.exports = router;
