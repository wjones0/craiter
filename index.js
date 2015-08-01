// var config = require('./config');
var mongodb = require('mongodb');
var feed = require("feed-read");
var Twitter = require('twitter');



var config = {};

config.twitter = {};
config.twitter.consumer_key = process.env.TWITCONSUMERKEY;
config.twitter.consumer_secret = process.env.TWITCONSUMERSECRET;
config.twitter.access_token_key = process.env.TWITTOKENKEY;
config.twitter.access_token_secret = process.env.TWITTOKENSEC;
	  
	  
config.mongodb = {};
config.mongodb.connection =  process.env.MONGOCONN;





var MongoClient = mongodb.MongoClient;

var url = config.mongodb.connection;


function processUser(user, saveCallBack) {

  for (var i = 0; i < user.search_strings.length; i++) {
    // console.log(user.search_strings[i].search);
    var jsonString = JSON.stringify(user.posts);
    
    var searchparam = user.search_strings[i];
    
    feed(searchparam.search, function (err, articles) {
      if (err) throw err;
      console.log(user.username + " " + articles.length + " posts total");
      for (var j = 0; j < articles.length; j++) {
        // console.log(articles[j].link);
        if (jsonString.indexOf(articles[j].link) > -1) {
          // console.log("your key or value exists!");
        } else {
          user.posts.push({"url":articles[j].link});
          tweet(user.username, searchparam.name, articles[j]);
        }
      }
        // console.log(user.posts);
        saveCallBack(user);
        // save user
    });
  }

}

function tweet(username, searchname, post)
{
 
    var client = new Twitter({
      consumer_key: config.twitter.consumer_key,
      consumer_secret: config.twitter.consumer_secret,
      access_token_key: config.twitter.access_token_key,
      access_token_secret: config.twitter.access_token_secret
    });
       
    var dmText = searchname + ": " + post.link;
    console.log("tweeting " + username);
    client.post('direct_messages/new', {screen_name: username, text: dmText},  function(error, tweet, response){
      if(error) throw error;
      // console.log(tweet);  // Tweet body. 
      // console.log(response);  // Raw response object. 
    });

}




MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to mongodb');

    var collection = db.collection('creets');

    var cursor = collection.find();
    cursor.count(function(err,count) {
      var savesPending = count;

      if(count == 0){
        db.close();
        return;
      }

      console.log("Users to process: " + count);

      var saveFinished = function(){
        savesPending--;
        if(savesPending == 0){
          db.close();
        }
      }
      
      var saveUser = function (doc) {
        collection.save(doc, {safe:true}, saveFinished);
      }

      cursor.each(function (err, doc) {
        if (doc != null) {
          processUser(doc, saveUser);
        }
      });
    })
  }
});




