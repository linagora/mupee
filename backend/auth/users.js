'use strict';

var passport = require('passport'),
    crypto = require('crypto');

passport.serializeUser(function(user, done) { done(null, user.username); });
passport.deserializeUser(function(username, done) { done(null, { username: username }); });

var users;

try {
  users = require('../../conf/users.json').users;
} catch (err) {
  users = [];
}

module.exports = exports = function(username, password, done) {
  for (var i in users) {
    var user = users[i];

    if (user.username === username && user.password === crypto.createHash('sha1').update(password).digest('hex')) {
      return done(null, { username: username });
    }
  }

  return done(null, false, { message: 'invalid username or password'});
};
