'use strict';

var chai = require('chai'),
    expect = chai.expect,
    mockery = require('mockery');

describe('The "users" authentication module', function() {

  before(function() {
    mockery.enable({warnOnUnregistered: false, useCleanCache: true});
  });

  it('should deny access if there\'s no database', function(done) {
    var usersAuth = require('../../backend/auth/users');

    usersAuth('user', 'secret', function(err, result) {
      expect(err).to.be.null;
      expect(result).to.be.false;
      done();
    });
  });

  it('should deny access if there\'s no users in the database', function(done) {
    mockery.registerMock('../../conf/users.json', { users: [] });

    var usersAuth = require('../../backend/auth/users');

    usersAuth('user', 'secret', function(err, result) {
      expect(err).to.be.null;
      expect(result).to.be.false;
      done();
    });
  });

  it('should deny access if the user is not in the database', function(done) {
    mockery.registerMock('../../conf/users.json', { users: [{
      username: 'user1',
      password: 'e5e9fa1ba31ecd1ae84f75caaa474f3a663f05f4'
    }] });

    var usersAuth = require('../../backend/auth/users');

    usersAuth('user2', 'secret', function(err, result) {
      expect(err).to.be.null;
      expect(result).to.be.false;
      done();
    });
  });

  it('should deny access if the wrong password is supplied', function(done) {
    mockery.registerMock('../../conf/users.json', { users: [{
      username: 'user1',
      password: 'e5e9fa1ba31ecd1ae84f75caaa474f3a663f05f4'
    }] });

    var usersAuth = require('../../backend/auth/users');

    usersAuth('user1', 'invalidPassword', function(err, result) {
      expect(err).to.be.null;
      expect(result).to.be.false;
      done();
    });
  });

  it('should allow access if credentials are ok', function(done) {
    mockery.registerMock('../../conf/users.json', { users: [{
      username: 'user1',
      password: 'e5e9fa1ba31ecd1ae84f75caaa474f3a663f05f4'
    }] });

    var usersAuth = require('../../backend/auth/users');

    usersAuth('user1', 'secret', function(err, result) {
      expect(err).to.be.null;
      expect(result).to.deep.equal({
        username: 'user1'
      });
      done();
    });
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
  });

  after(function() {
    mockery.disable();
  });

});
