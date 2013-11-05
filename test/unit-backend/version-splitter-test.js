'use strict';

var expect = require('chai').expect,
    mockery = require('mockery'),
    testLogger = require('./test-logger');

describe('The Version Splitter module', function() {

  var versionSplitter;

  before(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    versionSplitter = require('../../backend/version-splitter');
  });

  it('should extract the branch out of the version', function() {
    var version = '10.0.34esr';
    var branch = versionSplitter.getBranch(version);
    expect(branch).to.be.a.number;
    expect(branch).to.equal(10);
  });

  it('should return null if the version is null', function() {
    var version = null;
    var branch = versionSplitter.getBranch(version);
    expect(branch).to.be.null;
  });

  after(function() {
    mockery.deregisterAll();
    mockery.disable();
    mockery.resetCache();
  });
});
