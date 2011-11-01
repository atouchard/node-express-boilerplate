var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Comment = new Schema({
  title : String,
  author : String, 
  body : String,
  date : { type: Date, default : Date.now }
});

var Post = new Schema({
  title : { type : String, index: true, trim : true },
  author : String,
  date_created : { type : Date, default : Date.now },
  date_modified : {type : Date, default : Date.now },
  body : String,
  path : { type : String, index : true, unique : true, trim : true },
  comment : [Comment],
  state : { type : Number, default : 0 }
});

Post.path('path').validate(function(path) {
  var rule = /[a-zA-Z0-9_]/;
  return rule.test(path);
}, 'The Path must contains alphanumeric characters');

Post.path('title').validate(function(title) {
  var rule = /[a-zA-Z0-9]/;
  return rule.test(title);
}, 'The Title must contains alphanumeric characters');

Post.path('author').validate(function(author) {
  var rule = /[a-zA-Z0-9_]/;
  return rule.test(author);
}, 'The Author must contains alphanumeric characters');

module.exports = mongoose.model('Post', Post);