var config = {};

config.twitter = {};
config.twitter.user_name = process.env.TWITTER_USER || 'username';
config.twitter.password=  process.env.TWITTER_PASSWORD || 'password';

config.mongodb = {};
config.mongodb.connection =  'mongodb://mongo';


module.exports = config;