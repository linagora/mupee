'use strict';

var chai = require("chai");
var expect = chai.expect;
var mockery = require("mockery");
var testLogger = require('./test-logger');
var backgroundTasks;
var musScraper;
var scheduler = require("../../backend/job-scheduler");

describe("The background tasks module", function() {

  var scraped = false;
  var schedulerRealAddJob = scheduler.addJob;
  
  before(function() {
    mockery.enable({warnOnUnregistered: false});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock("./mozilla-updates-server-scraper", function(foo, done){done();});
    backgroundTasks = require("../../backend/background-tasks");
  });

  describe("when there is a product client version to update", function() {
    
    var sourceVersionFixture = require("./source-version-fixtures");
    
    it("should take a client version and forward it to the scheduler", function(done) {
      scheduler.addJob = function(hash, job) {
        done();
      };
      
      backgroundTasks.addProductScraperTask(sourceVersionFixture.withEmptyUpdates());
    });
    
    it("should forward it with an hash and a function", function(done) {
      scheduler.addJob = function(hash, job) {
        expect(hash).to.equal("/Thunderbird/17.0.0/20090729225028/WINNT_x86-msvc/en-US/release/Windows_NT%206.0/default/default/update.xml");
        expect(job).to.be.a.function;
        done();
      };
      
      backgroundTasks.addProductScraperTask(sourceVersionFixture.withEmptyUpdates());
    });
  });
  
  after(function() {
    scheduler.addJob = schedulerRealAddJob;
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });
});