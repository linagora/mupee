'use strict';

var chai = require('chai'),
    expect = chai.expect,
    mockery = require('mockery'),
    testLogger = require('./test-logger'),
    backgroundTasks,
    scheduler,
    db = require('../../backend/mongo-provider'),
    fixtures,
    UpdateStorage,
    ExtensionUpdateStorage,
    storage,
    async = require('async');

describe('The background tasks module', function() {
  var schedulerRealAddJob;

  before(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    mockery.registerMock('./mozilla-updates-server-scraper', function(foo, done) { done(); });
    scheduler = require('../../backend/job-scheduler');
    schedulerRealAddJob = scheduler.addJob;
    fixtures = require('./fixtures/background-tasks');
    UpdateStorage = require('../../backend/update-storage');
    storage = new UpdateStorage(db);
    backgroundTasks = require('../../backend/background-tasks');
  });

  describe('when there is a product client version to update', function() {

    var sourceVersionFixture = require('./source-version-fixtures');

    it('should take a client version and forward it to the scheduler', function(done) {
      scheduler.addJob = function() {
        done();
      };

      backgroundTasks.addProductScraperTask(sourceVersionFixture.withEmptyUpdates());
    });

    it('should forward it with an hash and a function', function(done) {
      scheduler.addJob = function(hash, job) {
        expect(hash).to.equal('/Thunderbird/17.0.0/20090729225028/WINNT_x86-msvc/en-US/release/Windows_NT%206.0/default/default/update.xml');
        expect(job).to.be.a.function;
        done();
      };

      backgroundTasks.addProductScraperTask(sourceVersionFixture.withEmptyUpdates());
    });
  });

  describe('when there is an extension version to update', function() {
    var extensionSourceVersionFixtures = require('./extension-source-version-fixtures');

    it('should take an extension version and forward it to the scheduler', function(done) {
      scheduler.addJob = function() {
        done();
      };

      backgroundTasks.addExtensionScraperTask(extensionSourceVersionFixtures.ltn123TB17());
    });

    it('should forward it with an hash and a function', function(done) {
      scheduler.addJob = function(hash, job) {
        expect(hash).to.equal('{e2fda1a4-762b-4020-b5ad-a41df1933103}/1.2.3/{3550f703-e582-4d05-9a08-453d09bdfdc6}/17.0.2/Linux/x86_64-gcc3/fr');
        expect(job).to.be.a.function;
        done();
      };

      backgroundTasks.addExtensionScraperTask(extensionSourceVersionFixtures.ltn123TB17());
    });
  });

  after(function() {
    scheduler.addJob = schedulerRealAddJob;
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });
});

describe('the refreshProductUpdates method of the backgroundTasks module', function() {
  var toScrap = [];
  var svs;
  var realAddProductScraperTask = null;

  before(function(done) {
    mockery.enable({warnOnUnregistered: false});
    mockery.registerMock('./logger', testLogger);
    scheduler = require('../../backend/job-scheduler');
    fixtures = require('./fixtures/background-tasks');
    svs = fixtures.sources();
    UpdateStorage = require('../../backend/update-storage');
    storage = new UpdateStorage(db);
    backgroundTasks = require('../../backend/background-tasks');

    var asyncTasks = svs.map(function(sourceversion) {
      return function(callback) {
        storage.save(sourceversion, callback);
      };
    });

    db.collection('source-versions').drop(function(err) {
      async.parallel(asyncTasks, function(errs) {
        if (errs && errs.length) {
          throw new Error('Unable to inject test data');
        }
        done();
      });
    });
  });

  it('should ask the addProductScraperTask to add tasks for every SourceVersion of the database', function(done) {
    var addProductScraperTask = function(version) {
      toScrap.push(version);
      if (svs.length === toScrap.length) {
        expect(versionHash(svs)).to.equal(versionHash(toScrap));
        done();
      } else if (svs.length < toScrap.length) {
        throw new Error('More versions to scrap than versions in datastore');
      }
    };
    var versionHash = function(table) {
      var hash = table.map(function(element) {
        return element.version + '-' + element.buildID;
      });
      hash.sort();
      return hash.join(',');
    };

    realAddProductScraperTask = backgroundTasks.addProductScraperTask;
    backgroundTasks.addProductScraperTask = addProductScraperTask;

    backgroundTasks.refreshProductUpdates();
  });

  after(function(done) {
    db.collection('source-versions').drop(done);
    backgroundTasks.addProductScraperTask = realAddProductScraperTask;
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

});

describe('the refreshExtensionsUpdates method of the backgroundTasks module', function() {
  var toScrap = [];
  var esvs;
  var realAddExtensionScraperTask = null;

  before(function(done) {
    mockery.enable({warnOnUnregistered: false});
    mockery.registerMock('./logger', testLogger);
    scheduler = require('../../backend/job-scheduler');
    fixtures = require('./fixtures/background-tasks');
    esvs = fixtures.extensions();
    ExtensionUpdateStorage = require('../../backend/extension-update-storage');
    backgroundTasks = require('../../backend/background-tasks');

    var storage = new ExtensionUpdateStorage(db);

    var asyncTasks = esvs.map(function(extensionSourceVersion) {
      return function(callback) {
        storage.save(extensionSourceVersion, callback);
      };
    });

    db.collection('extension-source-versions').drop(function(err) {
      async.parallel(asyncTasks, function(errs) {
        if (errs && errs.length) {
          throw new Error('Unable to inject test data');
        }
        done();
      });
    });
  });

  it('should ask the addExtensionScraperTask to add tasks for every ExtensionSourceVersion in the database', function(done) {
    var addExtensionScraperTask = function(version) {
      toScrap.push(version);
      if (esvs.length === toScrap.length) {
        expect(versionHash(esvs)).to.equal(versionHash(toScrap));
        done();
      } else if (esvs.length < toScrap.length) {
        throw new Error('More versions to scrap than versions in datastore');
      }
    };
    var versionHash = function(table) {
      var hash = table.map(function(element) {
        return element.version + '-' + element.buildID;
      });
      hash.sort();
      return hash.join(',');
    };

    realAddExtensionScraperTask = backgroundTasks.addExtensionScraperTask;
    backgroundTasks.addExtensionScraperTask = addExtensionScraperTask;

    backgroundTasks.refreshExtensionUpdates();
  });

  after(function(done) {
    db.collection('extension-source-versions').drop(done);
    backgroundTasks.addProductScraperTask = realAddExtensionScraperTask;
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

});
