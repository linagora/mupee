/* global setInterval: true */

'use strict';

var mockery = require('mockery'),
    testLogger = require('./test-logger'),
    expect = require('chai').expect;


describe('The Periodic Tasks module', function() {
  var periodicTasks;
  var realSetInterval = setInterval;
  var config = {
    fetch: {
      refreshInterval: 3
    },
    scheduler: {
      maxParallelTasks: 3
    }
  };

  beforeEach(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    require('../../backend/mongo-provider');
    mockery.registerMock('./config', config);
    periodicTasks = require('../../backend/periodic-tasks');
  });

  it('should set an interval', function() {
    setInterval = function(callback, time) {
      expect(callback).to.be.a.function;
      expect(time).to.be.a.number;
      setInterval = realSetInterval;
    };
    periodicTasks.start();
  });

  it('should take the interval from the configuration file', function() {
    setInterval = function(callback, time) {
      expect(callback).to.be.a.function;
      expect(time).to.be.a.number;
      expect(time).to.equal(3 * 60 * 60 * 1000);
      setInterval = realSetInterval;
    };
    periodicTasks.start();
  });

  it('should use a default of 24 (hours) when the configuration is bad', function() {
    setInterval = function(callback, time) {
      expect(callback).to.be.a.function;
      expect(time).to.be.a.number;
      expect(time).to.equal(24 * 60 * 60 * 1000);
      setInterval = realSetInterval;
    };
    config.fetch.refreshInterval = 'not a number !';
    periodicTasks.start();
  });


  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });
});
