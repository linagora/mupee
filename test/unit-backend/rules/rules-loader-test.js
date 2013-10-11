var expect = require('chai').expect;

var loader = require('../../../backend/rules/rules-loader');

describe('The Rule Loader module', function() {
  describe('dynamically loads modules from file system and', function() {
    it('should fail on non-existing path', function(done) {
      loader.loadModules('./none', '/../thisisanonexisting/path', Object, function(err, modules) {
        expect(err).not.to.be.null;
        done();
      });
    });

    it('should fail if path is not a directory', function(done) {
      loader.loadModules('./conditions', './backend/rules/rule.js', Object, function(err, modules) {
        expect(err).not.to.be.null;
        done();
      });
    });

    it('should succeed and provide modules if it is a directory', function(done) {
      loader.loadModules('./conditions', './backend/rules/conditions/', Object, function(err, modules) {
        expect(err).to.be.null;
        expect(modules).to.be.an.object;
        done();
      });
    });
  });

  it('should load actions from the backend/rules/actions directory', function(done) {
    loader.loadActions(function(err, actions) {
      expect(err).to.be.null;
      expect(actions).to.be.an.object;
      expect(Object.keys(actions).length).to.be.at.least(1);
      done();
    });
  });

  it('should load conditions from the backend/rules/condtions directory', function(done) {
    loader.loadConditions(function(err, conditions) {
      expect(err).to.be.null;
      expect(conditions).to.be.an.object;
      expect(Object.keys(conditions).length).to.be.at.least(1);
      done();
    });
  });
});

