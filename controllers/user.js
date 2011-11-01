
// -- Module dependencies.
var User = require('../models/user');

/**
 * Route to the login page
 */
module.exports.login = function(req, res) {
  res.render('user/index', {
    username: req.session.login
  });
};

/**
 *
 */
module.exports.connection = function(req, res) {
  User.findOne({ username: req.body.user.username }, function(err, user) {
    if (err) { throw err; }
    if (user && user.authenticate(req.body.user.password)) {
      req.session.user_id = user.id;
      res.redirect('/');
    }
    else {
      req.flash('error', 'Incorrect');
      res.redirect('/login');
    }
  });
};

/**
 *
 */
module.exports.new = function(req, res) {
  res.render('user/new', {
    user: new User(),
    main_title: 'Openbox | Create account'
  });
};

/**
 * Route to create a user
 */
module.exports.create = function(req, res, next) {
  var user = new User(req.body.user);

  if (req.body.user.password != req.body.password_confirm) {
    req.flash('error', ['Type the same password']);
    res.redirect('/login/create');
    return;
  }

  user.save(function(err) {
    if (err) {
      flashMongoose(req, res, err);
      res.redirect('/login/create');
    }
    else {
      req.flash('info', ['Your account has been created']);
      req.session.user_id = user.id;
      res.redirect('/');
    }
  });
};

/**
 *
 */
module.exports.checkSession = function(req, res, next) {
  if (req.session.user_id) {
    User.findById(req.session.user_id, function(err, user) {
      if (err) { next(err); }
      if (user) {
        req.currentUser = user;
        next();
      }
    });
  }
  else {
    next();
  }
};

/**
 * Delete session on logout
 */
module.exports.logout = function(req, res, next) {
  if (req.session) {
    res.clearCookie();
    req.session.destroy(function() {
      res.redirect('/');
    });
  }
};

/**
 *
 */
function flashMongoose(req, res, err) {
  var t = err.errors;
  for (var u in t) {
    req.flash('error', t[u].type);
  }
}