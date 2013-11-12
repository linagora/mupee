'use strict';

var mockery = require('mockery'),
    testLogger = require('./test-logger'),
    fs = require('fs'),
    Path = require('path'),
    fixtures,
    updatesFixture;
require('chai').should();
describe('The ExtensionUpdates route', function() {
  var proxy;

  beforeEach(function() {
    mockery.enable({warnOnUnregistered: false, warnOnReplace: false, useCleanCache: true});
    mockery.registerMock('./logger', testLogger);
    mockery.registerMock('../logger', testLogger);
    mockery.registerMock('../../logger', testLogger);
    fixtures = require('./extension-fixtures');
    updatesFixture = require('./extension-source-version-fixtures');
  });

  it('should send 400 if no file is uploaded', function(done) {
    proxy = require('../../backend/routes/admin/extensions');

    proxy.uploadXpi({}, {
      send: function(data) {
        data.should.equal(400);
        done();
      }
    });
  });

  it('should send 400 if the upload isn\'t done with a _file_ element', function(done) {
    proxy = require('../../backend/routes/admin/extensions');

    proxy.uploadXpi({
      files: {
        uploadedFile: {}
      }
    }, {
      send: function(data) {
        data.should.equal(400);
        done();
      }
    });
  });

  it('should send 400 if uploaded file isn\'t a valid zip archive', function(done) {
    var Zip = function() { throw 'No, I\'m not a zip file!'; };

    mockery.registerMock('adm-zip', Zip);
    proxy = require('../../backend/routes/admin/extensions');

    proxy.uploadXpi({
      files: {
        file: {
          path: '/uploaded/extension'
        }
      }
    }, {
      send: function(data) {
        data.should.equal(400);
        done();
      }
    });
  });

  it('should send 400 if uploaded file does not have an install.rdf entry', function(done) {
    var Zip = function() {};
    Zip.prototype.getEntry = function() { return null; };

    mockery.registerMock('adm-zip', Zip);
    proxy = require('../../backend/routes/admin/extensions');

    proxy.uploadXpi({
      files: {
        file: {
          path: '/uploaded/extension'
        }
      }
    }, {
      send: function(data) {
        data.should.equal(400);
        done();
      }
    });
  });

  it('should send 400 if install.rdf cannot be parsed', function(done) {
    var Zip = function() {};
    Zip.prototype.getEntry = function() { return this; };
    Zip.prototype.readAsText = function() { return 'I\'m not a valid install.rdf stream!'; };

    mockery.registerMock('adm-zip', Zip);
    proxy = require('../../backend/routes/admin/extensions');

    proxy.uploadXpi({
      files: {
        file: {
          path: '/uploaded/extension'
        }
      }
    }, {
      send: function(data) {
        data.should.equal(400);
        done();
      }
    });
  });

  it('should send the parsed Extension metadata if the uploaded extension is valid', function(done) {
    var Zip = function() {};
    Zip.prototype.getEntry = function(entry) { return entry === 'install.rdf' ? this : null; };
    Zip.prototype.readAsText = function() { return fs.readFileSync(Path.join(__dirname, '/resources/lightning-1.2.2-install.rdf')); };

    var fsExtra = {
      copy: function() {}
    };

    var Storage = function() {};
    Storage.prototype.findByExtension = function(extension, callback) { callback(null); };
    Storage.prototype.save = function(extension, callback) { callback(null); };

    mockery.registerMock('fs-extra', fsExtra);
    mockery.registerMock('adm-zip', Zip);
    mockery.registerMock('../extension-storage', Storage);
    proxy = require('../../backend/routes/admin/extensions');

    proxy.uploadXpi({
      files: {
        file: {
          name: 'ltn122Linux.xpi',
          path: '/uploaded/extension'
        }
      }
    }, {
      send: function(data) {
        JSON.stringify(data).should.deep.equal(JSON.stringify(fixtures.ltn122Linux()));
        done();
      }
    });
  });

  it('should copy the uploaded extension to file storage if extension is unknown', function(done) {
    var Zip = function() {};
    Zip.prototype.getEntry = function(entry) { return entry === 'install.rdf' ? this : null; };
    Zip.prototype.readAsText = function() { return fs.readFileSync(Path.join(__dirname, '/resources/lightning-1.2.2-install.rdf')); };

    var fsExtra = {
      copy: function(oldPath, newPath) {
        newPath.should.equal('data/files/Extensions/{e2fda1a4-762b-4020-b5ad-a41df1933103}/1.2.2/ltn122Linux.xpi');
        done();
      }
    };

    var Storage = function() {};
    Storage.prototype.findByExtension = function(extension, callback) { callback(null); };
    Storage.prototype.save = function(extension, callback) { callback(null); };

    mockery.registerMock('fs-extra', fsExtra);
    mockery.registerMock('adm-zip', Zip);
    mockery.registerMock('../extension-storage', Storage);
    proxy = require('../../backend/routes/admin/extensions');

    proxy.uploadXpi({
      files: {
        file: {
          name: 'ltn122Linux.xpi',
          path: '/uploaded/extension'
        }
      }
    }, {
      send: function() {}
    });
  });

  it('should copy the uploaded extension to file storage if extension is know, but outdated', function(done) {
    var Zip = function() {};
    Zip.prototype.getEntry = function(entry) { return entry === 'install.rdf' ? this : null; };
    Zip.prototype.readAsText = function() { return fs.readFileSync(Path.join(__dirname, '/resources/lightning-1.2.2-install.rdf')); };

    var fsExtra = {
      copy: function(oldPath, newPath) {
        newPath.should.equal('data/files/Extensions/{e2fda1a4-762b-4020-b5ad-a41df1933103}/1.2.2/ltn122Linux.xpi');
        done();
      }
    };

    var Storage = function() {};
    Storage.prototype.findByExtension = function(extension, callback) { callback(null, [{ _id: 'id', localFile: { path: 'mupeeTestingFile' } }]); };
    Storage.prototype.save = function(extension, callback) { callback(null); };
    Storage.prototype.remove = function(id, callback) { callback(null); };

    mockery.registerMock('fs-extra', fsExtra);
    mockery.registerMock('adm-zip', Zip);
    mockery.registerMock('../extension-storage', Storage);
    proxy = require('../../backend/routes/admin/extensions');

    proxy.uploadXpi({
      files: {
        file: {
          name: 'ltn122Linux.xpi',
          path: '/uploaded/extension'
        }
      }
    }, {
      send: function() {}
    });
  });

  it('should remove outdated metadata if extension is know, but outdated', function(done) {
    var Zip = function() {};
    Zip.prototype.getEntry = function(entry) { return entry === 'install.rdf' ? this : null; };
    Zip.prototype.readAsText = function() { return fs.readFileSync(Path.join(__dirname, '/resources/lightning-1.2.2-install.rdf')); };

    var fsExtra = {
      copy: function() {}
    };

    var Storage = function() {};
    Storage.prototype.findByExtension = function(extension, callback) { callback(null, [{ _id: 'id', localFile: { path: 'mupeeTestingFile' } }]); };
    Storage.prototype.save = function(extension, callback) { callback(null); };
    Storage.prototype.remove = function(id, callback) { callback(null); done(); };

    mockery.registerMock('fs-extra', fsExtra);
    mockery.registerMock('adm-zip', Zip);
    mockery.registerMock('../../extension-storage', Storage);
    proxy = require('../../backend/routes/admin/extensions');

    proxy.uploadXpi({
      files: {
        file: {
          name: 'ltn122Linux.xpi',
          path: '/uploaded/extension'
        }
      }
    }, {
      send: function() {}
    });
  });

  it('should store metadata if extension is know, but outdated', function(done) {
    var Zip = function() {};
    Zip.prototype.getEntry = function(entry) { return entry === 'install.rdf' ? this : null; };
    Zip.prototype.readAsText = function() { return fs.readFileSync(Path.join(__dirname, '/resources/lightning-1.2.2-install.rdf')); };

    var fsExtra = {
      copy: function() {}
    };

    var Storage = function() {};
    Storage.prototype.findByExtension = function(extension, callback) { callback(null, [{ _id: 'id', localFile: { path: 'mupeeTestingFile' } }]); };
    Storage.prototype.save = function(extension, callback) { callback(null); done(); };
    Storage.prototype.remove = function(id, callback) { callback(null); };

    mockery.registerMock('fs-extra', fsExtra);
    mockery.registerMock('adm-zip', Zip);
    mockery.registerMock('../../extension-storage', Storage);
    proxy = require('../../backend/routes/admin/extensions');

    proxy.uploadXpi({
      files: {
        file: {
          name: 'ltn122Linux.xpi',
          path: '/uploaded/extension'
        }
      }
    }, {
      send: function() {}
    });
  });

  it('should store metadata if extension is unknown', function(done) {
    var Zip = function() {};
    Zip.prototype.getEntry = function(entry) { return entry === 'install.rdf' ? this : null; };
    Zip.prototype.readAsText = function() { return fs.readFileSync(Path.join(__dirname, '/resources/lightning-1.2.2-install.rdf')); };

    var fsExtra = {
      copy: function() {}
    };

    var Storage = function() {};
    Storage.prototype.findByExtension = function(extension, callback) { callback(null); };
    Storage.prototype.save = function(extension, callback) { callback(null); done(); };

    mockery.registerMock('fs-extra', fsExtra);
    mockery.registerMock('adm-zip', Zip);
    mockery.registerMock('../../extension-storage', Storage);
    proxy = require('../../backend/routes/admin/extensions');

    proxy.uploadXpi({
      files: {
        file: {
          name: 'ltn122Linux.xpi',
          path: '/uploaded/extension'
        }
      }
    }, {
      send: function() {}
    });
  });

  it('should compute the sha1 of the uploaded file before saving metadata', function(done) {
    var Zip = function() {};
    Zip.prototype.getEntry = function(entry) { return entry === 'install.rdf' ? this : null; };
    Zip.prototype.readAsText = function() { return fs.readFileSync(Path.join(__dirname, '/resources/lightning-1.2.2-install.rdf')); };

    var fsExtra = {
      copy: function() {}
    };

    var Storage = function() {};
    Storage.prototype.findByExtension = function(extension, callback) { callback(null); };
    Storage.prototype.save = function(extension, callback) {
      extension.localFile.hash.should.equal('sha1:1c75d05a0018eed4292b43c7f4663a79166761f1');
      callback(null);

      done();
    };

    mockery.registerMock('fs-extra', fsExtra);
    mockery.registerMock('adm-zip', Zip);
    mockery.registerMock('../../extension-storage', Storage);
    proxy = require('../../backend/routes/admin/extensions');

    proxy.uploadXpi({
      files: {
        file: {
          name: 'ltn122Linux.xpi',
          path: Path.join(__dirname, '/resources/sha1sum.test')
        }
      }
    }, {
      send: function() {}
    });
  });

  it('should do nothing if the extension is known and valid', function(done) {
    var Zip = function() {};
    Zip.prototype.getEntry = function(entry) { return entry === 'install.rdf' ? this : null; };
    Zip.prototype.readAsText = function() { return fs.readFileSync(Path.join(__dirname, '/resources/lightning-1.2.2-install.rdf')); };

    var fsExtra = {
      copy: function(oldPath, newPath) {
        throw 'This test should not call fs.copy()';
      }
    };
    var config = {
      download: {
        dir: '/tmp'
      }
    };

    var Storage = function() {};
    Storage.prototype.findByExtension = function(extension, callback) { callback(null, [{ _id: 'id', localFile: { path: 'mupeeTestingFile' } }]); done(); };
    Storage.prototype.save = function(extension, callback) { throw 'This test should not call Storage.save()'; };
    Storage.prototype.remove = function(id, callback) { throw 'This test should not call Storage.remove()'; };

    mockery.registerMock('fs-extra', fsExtra);
    mockery.registerMock('../../config', config);
    mockery.registerMock('adm-zip', Zip);
    mockery.registerMock('../../extension-storage', Storage);
    proxy = require('../../backend/routes/admin/extensions');

    fs.closeSync(fs.openSync('/tmp/mupeeTestingFile', 'w'));
    proxy.uploadXpi({
      files: {
        file: {
          name: 'ltn122Linux.xpi',
          path: '/uploaded/extension'
        }
      }
    }, {
      send: function() {}
    });
  });

  it('should correctly parse chrome.manifest if present (obm-connector-3.2.0.11, no binary-component)', function(done) {
    var fsExtra = {
      copy: function() {}
    };

    var Storage = function() {};
    Storage.prototype.findByExtension = function(extension, callback) { callback(null, null); };
    Storage.prototype.save = function(extension, callback) { callback(null, null); };
    Storage.prototype.remove = function(id, callback) { callback(null, null); };

    mockery.registerMock('fs-extra', fsExtra);
    mockery.registerMock('../../extension-storage', Storage);
    proxy = require('../../backend/routes/admin/extensions');

    proxy.uploadXpi({
      files: {
        file: {
          name: 'obm-connector-3.2.0.11.xpi',
          path: Path.join(__dirname, 'resources/extensions/obm-connector-3.2.0.11.xpi')
        }
      }
    }, {
      send: function(data) {
        data.hasBinaryComponent.should.be.false;
        done();
      }
    });
  });

  it('should correctly parse chrome.manifest if present (obm-connector-3.2.0.11, binary-component in root manifest)', function(done) {
    var fsExtra = {
      copy: function() {}
    };

    var Storage = function() {};
    Storage.prototype.findByExtension = function(extension, callback) { callback(null, null); };
    Storage.prototype.save = function(extension, callback) { callback(null, null); };
    Storage.prototype.remove = function(id, callback) { callback(null, null); };

    mockery.registerMock('fs-extra', fsExtra);
    mockery.registerMock('../../extension-storage', Storage);
    proxy = require('../../backend/routes/admin/extensions');

    proxy.uploadXpi({
      files: {
        file: {
          name: 'obm-connector-fakebinary-3.2.0.11.xpi',
          path: Path.join(__dirname, 'resources/extensions/obm-connector-fakebinary-3.2.0.11.xpi')
        }
      }
    }, {
      send: function(data) {
        data.hasBinaryComponent.should.be.true;
        done();
      }
    });
  });

  it('should correctly parse chrome.manifest if present (lightning-1.2.3.24obm, binary-component in sub-manifest)', function(done) {
    var fsExtra = {
      copy: function() {}
    };

    var Storage = function() {};
    Storage.prototype.findByExtension = function(extension, callback) { callback(null, null); };
    Storage.prototype.save = function(extension, callback) { callback(null, null); };
    Storage.prototype.remove = function(id, callback) { callback(null, null); };

    mockery.registerMock('fs-extra', fsExtra);
    mockery.registerMock('../../extension-storage', Storage);
    proxy = require('../../backend/routes/admin/extensions');

    proxy.uploadXpi({
      files: {
        file: {
          name: 'lightning-1.2.3.24obm-tb-mac.xpi',
          path: Path.join(__dirname, 'resources/extensions/lightning-1.2.3.24obm-tb-mac.xpi')
        }
      }
    }, {
      send: function(data) {
        data.hasBinaryComponent.should.be.true;
        done();
      }
    });
  });

  it('should correctly parse chrome.manifest if present (lightning-1.9.1, binary-component in sub-manifest)', function(done) {
    var fsExtra = {
      copy: function() {}
    };

    var Storage = function() {};
    Storage.prototype.findByExtension = function(extension, callback) { callback(null, null); };
    Storage.prototype.save = function(extension, callback) { callback(null, null); };
    Storage.prototype.remove = function(id, callback) { callback(null, null); };

    mockery.registerMock('fs-extra', fsExtra);
    mockery.registerMock('../../extension-storage', Storage);
    proxy = require('../../backend/routes/admin/extensions');

    proxy.uploadXpi({
      files: {
        file: {
          name: 'lightning-1.9.1-sm+tb-linux.xpi',
          path: Path.join(__dirname, 'resources/extensions/lightning-1.9.1-sm+tb-linux.xpi')
        }
      }
    }, {
      send: function(data) {
        data.hasBinaryComponent.should.be.true;
        done();
      }
    });
  });

  describe('The VersionCheck endpoint', function() {

    it('should send empty updates if there\'s an issue accessing the updates storage', function(done) {
      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback('TerribleFailure'); };

      mockery.registerMock('../extension-update-storage', UpdStorage);
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.ltn123TB17()
      }, {
        send: function(data) {
          data.should.equal(fs.readFileSync(Path.join(__dirname, '/resources/lightning-noupdates.rdf'), {encoding: 'utf-8'}));
          done();
        }
      });
    });

    it('should send empty updates if there\'s an issue accessing the extensions storage', function(done) {
      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, []); };

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback('TerribleFailure'); };

      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.ltn123TB17()
      }, {
        send: function(data) {
          data.should.equal(fs.readFileSync(Path.join(__dirname, '/resources/lightning-noupdates.rdf'), {encoding: 'utf-8'}));
          done();
        }
      });
    });

    it('should save a new extension-source-version if none exists yet', function(done) {
      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, []); };
      UpdStorage.prototype.save = function(extension, callback) {
        extension.should.not.have.property('_id');

        callback();
        done();
      };

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback(null, []); };

      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.ltn123TB17()
      }, {
        send: function(data) {}
      });
    });

    it('should update an existing extension-source-version if one already exists', function(done) {
      var ts = Date.now() - 1;

      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, [{ _id: 'ExistingId', timestamp: ts }]); };
      UpdStorage.prototype.save = function(extension, callback) {
        extension.should.have.property('_id', 'ExistingId');
        extension.timestamp.should.not.equal(ts);

        callback();
        done();
      };

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback(null, []); };

      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.ltn123TB17()
      }, {
        send: function(data) {}
      });
    });

    it('should send empty updates if no extensions exists in storage', function(done) {
      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, []); };
      UpdStorage.prototype.save = function(extension, callback) { callback(); };

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback(null, []); };

      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.ltn123TB17()
      }, {
        send: function(data) {
          data.should.equal(fs.readFileSync(Path.join(__dirname, '/resources/lightning-noupdates.rdf'), {encoding: 'utf-8'}));
          done();
        }
      });
    });

    it('should send empty updates if no extensions are compatible with target platform', function(done) {
      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, []); };
      UpdStorage.prototype.save = function(extension, callback) { callback(); };

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback(null, [fixtures.ltn122Linux(), fixtures.ltn191Windows()]); };

      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.ltn123TB17()
      }, {
        send: function(data) {
          data.should.equal(fs.readFileSync(Path.join(__dirname, '/resources/lightning-noupdates.rdf'), {encoding: 'utf-8'}));
          done();
        }
      });
    });

    it('should send empty updates if no extensions are compatible with target application', function(done) {
      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, []); };
      UpdStorage.prototype.save = function(extension, callback) { callback(); };

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback(null, [fixtures.ltn122Linux()]); };

      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.ltn123TB17()
      }, {
        send: function(data) {
          data.should.equal(fs.readFileSync(Path.join(__dirname, '/resources/lightning-noupdates.rdf'), {encoding: 'utf-8'}));
          done();
        }
      });
    });

    it('should send an update if an extension is compatible with target application and platform', function(done) {
      var ltn191Linux = fixtures.ltn191Linux();
      ltn191Linux.localFile = {
        path: 'Extensions/{e2fda1a4-762b-4020-b5ad-a41df1933103}/1.9.1/test.xpi',
        hash: 'sha1:1234'
      };

      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, []); };
      UpdStorage.prototype.save = function(extension, callback) { callback(); };

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback(null, [ltn191Linux]); };

      mockery.registerMock('../config', {
        server: {
          url: 'http://localhost',
          port: 1234
        }
      });
      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      mockery.registerMock('../rules/engine', {
        evaluate: function(candidate) {
          return candidate;
        }
      });
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.ltn123TB17()
      }, {
        send: function(data) {
          data.should.equal(fs.readFileSync(Path.join(__dirname, '/resources/lightning-1.9.1-localFile.rdf'), {encoding: 'utf-8'}));
          done();
        }
      });
    });

    it('should send the latest update if multiple extensions are compatible with target application and platform', function(done) {
      var ltn191Linux = fixtures.ltn191Linux();
      ltn191Linux.localFile = {
        path: 'Extensions/{e2fda1a4-762b-4020-b5ad-a41df1933103}/1.9.1/test.xpi',
        hash: 'sha1:1234'
      };

      var ltn192Linux = fixtures.ltn192Linux();
      ltn192Linux.localFile = {
        path: 'Extensions/{e2fda1a4-762b-4020-b5ad-a41df1933103}/1.9.2/test.xpi',
        hash: 'sha1:1234'
      };

      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, []); };
      UpdStorage.prototype.save = function(extension, callback) { callback(); };

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback(null, [ltn191Linux, ltn192Linux]); };

      mockery.registerMock('../config', {
        server: {
          url: 'http://localhost',
          port: 1234
        }
      });
      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      mockery.registerMock('../rules/engine', {
        evaluate: function(candidate) {
          candidate.updates.splice(1, 1);
          return candidate;
        }
      });
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.ltn123TB17()
      }, {
        send: function(data) {
          data.should.equal(fs.readFileSync(Path.join(__dirname, '/resources/lightning-1.9.2-localFile.rdf'), {encoding: 'utf-8'}));
          done();
        }
      });
    });

    it('should call engine.evaluate', function(done) {
      var ltn191Linux = fixtures.ltn191Linux();
      ltn191Linux.localFile = {
        path: 'Extensions/{e2fda1a4-762b-4020-b5ad-a41df1933103}/1.9.1/test.xpi',
        hash: 'sha1:1234'
      };

      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, []); };
      UpdStorage.prototype.save = function(extension, callback) { callback(); };

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback(null, [ltn191Linux]); };

      mockery.registerMock('../config', {
        server: {
          url: 'http://localhost',
          port: 1234
        }
      });
      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      mockery.registerMock('../rules/engine', {
        evaluate: function(candidate) {
          done();
          return candidate;
        }
      });
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.ltn123TB17()
      }, {
        send: function() {}
      });
    });

    it('should scrap available extension updates if client connects for the first time', function(done) {
      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, []); };
      UpdStorage.prototype.save = function(extension, callback) {};

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback(null, []); };

      var tasks = {
        addExtensionScraperTask: function() {
          done();
        }
      };

      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      mockery.registerMock('../background-tasks', tasks);
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.ltn123TB17()
      }, {
        send: function(data) {}
      });
    });

    it('should not scrap available extension updates if client already exists', function(done) {
      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, [{ _id: 'ExistingId' }]); };
      UpdStorage.prototype.save = function(extension, callback) {};

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback(null, []); };

      var tasks = {
        addExtensionScraperTask: function() {
          throw 'This test should not scrap!';
        }
      };

      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      mockery.registerMock('../background-tasks', tasks);
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.ltn123TB17()
      }, {
        send: function() {
          done();
        }
      });
    });

    it('should only send updates newer than client version', function(done) {
      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, []); };
      UpdStorage.prototype.save = function(extension, callback) { callback(); };

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback(null, [fixtures.ltn122Linux()]); };

      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      mockery.registerMock('../rules/engine', { evaluate: function(candidate) { return candidate; } });
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.ltn123TB17()
      }, {
        send: function(data) {
          data.should.equal(fs.readFileSync(Path.join(__dirname, '/resources/lightning-noupdates.rdf'), {encoding: 'utf-8'}));
          done();
        }
      });
    });

    it('should honor strictCompatibility flag', function(done) {
      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, []); };
      UpdStorage.prototype.save = function(extension, callback) { callback(); };

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback(null, [fixtures.obmConnector32011Strict()]); };

      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      mockery.registerMock('../rules/engine', { evaluate: function(candidate) { return candidate; } });
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.connector3209TB24()
      }, {
        send: function(data) {
          data.should.equal(fs.readFileSync(Path.join(__dirname, '/resources/obm-connector-noupdates.rdf'), {encoding: 'utf-8'}));
          done();
        }
      });
    });

    it('should honor hasBinaryComponent flag', function(done) {
      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, []); };
      UpdStorage.prototype.save = function(extension, callback) { callback(); };

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback(null, [fixtures.ltn191LinuxBinaryComp()]); };

      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      mockery.registerMock('../rules/engine', { evaluate: function(candidate) { return candidate; } });
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.ltn123TB24()
      }, {
        send: function(data) {
          data.should.equal(fs.readFileSync(Path.join(__dirname, '/resources/lightning-noupdates.rdf'), {encoding: 'utf-8'}));
          done();
        }
      });
    });

    it('should do strict version checking if extension has a binary component and doesn\'t set strict mode', function(done) {
      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, []); };
      UpdStorage.prototype.save = function(extension, callback) { callback(); };

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback(null, [fixtures.ltn122LinuxBinaryCompNoStrict()]); };

      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      mockery.registerMock('../rules/engine', { evaluate: function(candidate) { return candidate; } });
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.ltn10b1TB5()
      }, {
        send: function(data) {
          data.should.equal(fs.readFileSync(Path.join(__dirname, '/resources/lightning-noupdates.rdf'), {encoding: 'utf-8'}));
          done();
        }
      });
    });

    it('should do strict version checking for products with version < 10', function(done) {
      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, []); };
      UpdStorage.prototype.save = function(extension, callback) { callback(); };

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback(null, [fixtures.ltn10b2Linux()]); };

      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      mockery.registerMock('../rules/engine', { evaluate: function(candidate) { return candidate; } });
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.ltn10b1TB5()
      }, {
        send: function(data) {
          data.should.equal(fs.readFileSync(Path.join(__dirname, '/resources/lightning-noupdates.rdf'), {encoding: 'utf-8'}));
          done();
        }
      });
    });

    it('should do relaxed version checking for products with version >= 10', function(done) {
      var obmConnector32011 = fixtures.obmConnector32011();
      obmConnector32011.localFile = {
        path: 'Extensions/obm-connector@aliasource.fr/3.2.0.11/test.xpi',
        hash: 'sha1:1234'
      };

      var UpdStorage = function(db) {};
      UpdStorage.prototype.findByVersion = function(extension, callback) { callback(null, []); };
      UpdStorage.prototype.save = function(extension, callback) { callback(); };

      var Storage = function() {};
      Storage.prototype.findByExtension = function(extension, callback) { callback(null, [obmConnector32011]); };

      mockery.registerMock('../extension-update-storage', UpdStorage);
      mockery.registerMock('../extension-storage', Storage);
      mockery.registerMock('../rules/engine', { evaluate: function(candidate) { return candidate; } });
      proxy = require('../../backend/routes/extension-updates');

      proxy.versionCheck({
        query: updatesFixture.connector3209TB24()
      }, {
        send: function(data) {
          data.should.equal(fs.readFileSync(Path.join(__dirname, '/resources/obm-connector-3.2.0.11.rdf'), {encoding: 'utf-8'}));
          done();
        }
      });
    });

  });

  afterEach(function(done) {
    try {
      fs.unlinkSync('/tmp/mupeeTestingFile');
    } catch (e) {}
    mockery.resetCache();
    mockery.deregisterAll();
    mockery.disable();
    done();
  });
});
