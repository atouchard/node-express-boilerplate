
// -- Module dependencies.
var Post = require('../models/post'),
    settings = require('../conf/configuration').settings;

/**
 * Init routing
 */
module.exports.init = function(app) {};

/**
 * Route to create a new article
 */
module.exports.new = function(req, res) {
  res.render('articles/new', {
    locals: {
      article: {}
    },
    head_title: settings.siteName + ' | Create Article'
  });
};

/**
 * Route index
 */
module.exports.index = function(req, res) {
  res.render('index', {
    head_title: settings.siteName + ' | Articles'
  });
};

/**
 * Route to get all messages
 */
module.exports.all = function(req, res) {
  Post.find(function(err, posts) {
    if (err) { throw err; }
    res.render('articles/index', {
      locals: {
        articles: posts
      },
      head_title: settings.siteName + ' | Articles'
    });
  });
};

/**
 * Route to a specific article
 */
module.exports.find = function(req, res) {
  Post.findOne({ 'path' : req.params.id }, function (err, post) {
    if (err) { throw err; }
    var date = formatDate(post.date_created);
    res.render('articles/show', {
      locals: {
        article: post,
        date : date
      },
      head_title: settings.siteName + ' | Article ' + post.title
    });
  });
};

/**
 * Route to edit a article
 */
module.exports.edit = function(req, res) {
  Post.findOne({ 'path' : req.params.id }, function (err, post) {
    if (err) { throw err; }
    req.flash('info', ['Your article has been updated']);
    res.render('articles/edit', {
      locals: {
        article: post
      },
      head_title: settings.siteName + ' | Article edit'
    });
  });
};

/**
 * Route to create an article
 */
module.exports.create = function(req, res) {
  var post = new Post(req.body.article);
  
  post.save(function(err) {
    if (err) {
      flashMongoose(req, res, err);
      res.redirect('/articles');
    }
    else {
      req.flash('info', ['Your article has been created']);
      res.redirect('/articles/' + post.path);
    }
  });
};

/**
 * Route to update an article
 */
module.exports.set = function(req, res) {
  Post.update({_id : req.params.id}, req.body.article, { multi: true }, function(err) {
    if (err) { throw err; }
    res.redirect('/articles/' + req.body.article.path);
  });
};

/**
 * Route to remove an article
 */
module.exports.remove = function(req, res) {
  Post.remove({path : req.params.id}, function(err) {
    if (err) { throw err; }
    res.redirect('/articles');
  });
};

function flashMongoose(req, res, err) {
  var t = err.errors;
  for (var u in t) { 
    req.flash('error', t[u].type);
  }
}

function formatDate(date) {
  var d = new Date(date);
  var day = d.getDate();
  var month = d.getMonth() + 1;
  var year = d.getFullYear();
  return day + '/' + month + '/' + year;
}