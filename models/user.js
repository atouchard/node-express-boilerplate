
// -- Module dependencies.
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var User = new Schema({
  username : { type : String, index : { unique : true } },
  password : String,
  date : { type : Date, default : Date.now },
  salt : String,
  role : { type : String, default : 'user' }
});

User.path('username').validate(function(username) {
  var rule = /^[a-zA-Z0-9\-_]{3,}$/;
  return rule.test(username);
}, 'User name must have at least 3 alphanumeric characters');

User.path('password').validate(function(password) {
  return password.length > 5 ;
}, 'Password must have at least 5 characters');

User.virtual('user.password')
  .set(function(pass) {
    console.log('VIRTUAL : ' + pass);
    this._password = pass;
    this.salt = this.makeSalt();
    this.password = this.encryptPassword(pass);
  })
  .get(function() {
    return this._password;
  });

User.method('authenticate', function(plainText) {
  return plainText === this.password;
});

User.method('makeSalt', function() {
  return Math.round((new Date().valueOf() * Math.random())) + '';
});

User.method('encryptPassword', function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
});

module.exports = mongoose.model('User', User);
