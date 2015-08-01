var config = require('./config');
var mongodb = require('mongodb');


var MongoClient = mongodb.MongoClient;

var url = config.mongodb.connection;


MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to mongodb');

    var collection = db.collection('creets');

    var cursor = collection.find();

    cursor.each(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log('Fetched:', doc);
      }
      
      //Close connection
      db.close();
    });


  }
});