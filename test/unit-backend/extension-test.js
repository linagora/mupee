'use strict';

var expect = require('chai').expect;

var Extension = require('../../backend/extension').Extension,
    fixtures = require('./extension-fixtures');

describe('An Extension', function() {

  it('should throw an exception if canBeInstalledOn is called with no platform', function(done) {
    try {
      fixtures.obmConnector32011().canBeInstalledOn();
    } catch (e) {
      done();
    }
  });

  it('should throw an exception if canBeInstalledOn is called with a null platform', function(done) {
    try {
      fixtures.obmConnector32011().canBeInstalledOn(null);
    } catch (e) {
      done();
    }
  });

  it('should throw an exception if canBeInstalledOnOSAndArch is called with no os or architecture', function(done) {
    try {
      fixtures.obmConnector32011().canBeInstalledOnOSAndArch();
    } catch (e) {
      done();
    }
  });

  it('should throw an exception if canBeInstalledOnOSAndArch is called with a null os', function(done) {
    try {
      fixtures.obmConnector32011().canBeInstalledOnOSAndArch(null, 'x86_64-gcc3');
    } catch (e) {
      done();
    }
  });

  it('should throw an exception if canBeInstalledOnOSAndArch is called with a null architecture', function(done) {
    try {
      fixtures.obmConnector32011().canBeInstalledOnOSAndArch('Linux', null);
    } catch (e) {
      done();
    }
  });

  it('should delegate to canBeInstalledOn from canBeInstalledOnOSAndArch', function(done) {
    Extension.prototype.originalCanBeInstalledOn = Extension.prototype.canBeInstalledOn;
    Extension.prototype.canBeInstalledOn = function(platform) {
      Extension.prototype.canBeInstalledOn = Extension.prototype.originalCanBeInstalledOn;

      platform.should.equal('Linux_x86_64-gcc3');
      done();
    };

    fixtures.obmConnector32011().canBeInstalledOnOSAndArch('Linux', 'x86_64-gcc3');
  });

  it('can be installed on any platform if it does not specify \'targetPlatforms\' property', function() {
    expect(fixtures.obmConnector32011().canBeInstalledOn('Linux_x86_64-gcc3')).to.be.true;
    expect(fixtures.obmConnector32011().canBeInstalledOn('Linux_x86-gcc3')).to.be.true;
    expect(fixtures.obmConnector32011().canBeInstalledOn('Darwin_ppc-gcc3')).to.be.true;
    expect(fixtures.obmConnector32011().canBeInstalledOn('Darwin_ppc_x64-gcc3')).to.be.true;
    expect(fixtures.obmConnector32011().canBeInstalledOn('WINNT_x86-msvc')).to.be.true;
    expect(fixtures.obmConnector32011().canBeInstalledOn('WINNT_x86_64-msvc')).to.be.true;
    expect(fixtures.obmConnector32011().canBeInstalledOn('CuttingEdgeNewPlatform_x64')).to.be.true;
  });

  it('can be installed on any flavor of Linux if it specifies \'Linux\' as a target platform', function() {
    expect(fixtures.obmConnector32011Linux().canBeInstalledOn('Linux_x86_64-gcc3')).to.be.true;
    expect(fixtures.obmConnector32011Linux().canBeInstalledOn('Linux_x86-gcc3')).to.be.true;
    expect(fixtures.obmConnector32011Linux().canBeInstalledOn('Darwin_ppc-gcc3')).to.be.false;
    expect(fixtures.obmConnector32011Linux().canBeInstalledOn('Darwin_ppc_x64-gcc3')).to.be.false;
    expect(fixtures.obmConnector32011Linux().canBeInstalledOn('WINNT_x86-msvc')).to.be.false;
    expect(fixtures.obmConnector32011Linux().canBeInstalledOn('WINNT_x86_64-msvc')).to.be.false;
    expect(fixtures.obmConnector32011Linux().canBeInstalledOn('CuttingEdgeNewPlatform_x64')).to.be.false;
  });

  it('can be installed on any flavor of Darwin if it specifies \'Darwin\' as a target platform', function() {
    expect(fixtures.obmConnector32011Darwin().canBeInstalledOn('Linux_x86_64-gcc3')).to.be.false;
    expect(fixtures.obmConnector32011Darwin().canBeInstalledOn('Linux_x86-gcc3')).to.be.false;
    expect(fixtures.obmConnector32011Darwin().canBeInstalledOn('Darwin_ppc-gcc3')).to.be.true;
    expect(fixtures.obmConnector32011Darwin().canBeInstalledOn('Darwin_ppc_x64-gcc3')).to.be.true;
    expect(fixtures.obmConnector32011Darwin().canBeInstalledOn('WINNT_x86-msvc')).to.be.false;
    expect(fixtures.obmConnector32011Darwin().canBeInstalledOn('WINNT_x86_64-msvc')).to.be.false;
    expect(fixtures.obmConnector32011Darwin().canBeInstalledOn('CuttingEdgeNewPlatform_x64')).to.be.false;
  });

  it('can be installed on an explicit platform only if specified as a target platform', function() {
    expect(fixtures.obmConnector32011Linux_x64().canBeInstalledOn('Linux_x86_64-gcc3')).to.be.true;
    expect(fixtures.obmConnector32011Linux_x64().canBeInstalledOn('Linux_x86-gcc3')).to.be.false;
    expect(fixtures.obmConnector32011Linux_x64().canBeInstalledOn('Darwin_ppc-gcc3')).to.be.false;
    expect(fixtures.obmConnector32011Linux_x64().canBeInstalledOn('Darwin_ppc_x64-gcc3')).to.be.false;
    expect(fixtures.obmConnector32011Linux_x64().canBeInstalledOn('WINNT_x86-msvc')).to.be.false;
    expect(fixtures.obmConnector32011Linux_x64().canBeInstalledOn('WINNT_x86_64-msvc')).to.be.false;
    expect(fixtures.obmConnector32011Linux_x64().canBeInstalledOn('CuttingEdgeNewPlatform_x64')).to.be.false;
  });

  it('can be installed on an explicit platform only if multiple version are specified as target platforms', function() {
    expect(fixtures.obmConnector32011Win_All().canBeInstalledOn('Linux_x86_64-gcc3')).to.be.false;
    expect(fixtures.obmConnector32011Win_All().canBeInstalledOn('Linux_x86-gcc3')).to.be.false;
    expect(fixtures.obmConnector32011Win_All().canBeInstalledOn('Darwin_ppc-gcc3')).to.be.false;
    expect(fixtures.obmConnector32011Win_All().canBeInstalledOn('Darwin_ppc_x64-gcc3')).to.be.false;
    expect(fixtures.obmConnector32011Win_All().canBeInstalledOn('WINNT_x86-msvc')).to.be.true;
    expect(fixtures.obmConnector32011Win_All().canBeInstalledOn('WINNT_x86_64-msvc')).to.be.true;
    expect(fixtures.obmConnector32011Win_All().canBeInstalledOn('CuttingEdgeNewPlatform_x64')).to.be.false;
  });

  it('should find a target application of OBM Connector 3.2.0.11 if given Thunderbird/10.0.12', function() {
    var app = fixtures.obmConnector32011().getCompatibleTargetApplication('{3550f703-e582-4d05-9a08-453d09bdfdc6}', '10.0.12');

    expect(app).to.exist;
    expect(app.id).to.equal('{3550f703-e582-4d05-9a08-453d09bdfdc6}');
  });

  it('should find a target application of OBM Connector 3.2.0.11 if given Thunderbird/2.0.0.24', function() {
    var app = fixtures.obmConnector32011().getCompatibleTargetApplication('{3550f703-e582-4d05-9a08-453d09bdfdc6}', '2.0.0.24');

    expect(app).to.exist;
    expect(app.id).to.equal('{3550f703-e582-4d05-9a08-453d09bdfdc6}');
  });

  it('should find a target application of OBM Connector 3.2.0.11 if given Thunderbird/17.0.2', function() {
    var app = fixtures.obmConnector32011().getCompatibleTargetApplication('{3550f703-e582-4d05-9a08-453d09bdfdc6}', '17.0.2');

    expect(app).to.exist;
    expect(app.id).to.equal('{3550f703-e582-4d05-9a08-453d09bdfdc6}');
  });

  it('should not find any target application of OBM Connector 3.2.0.11 if given Thunderbird/1.0', function() {
    expect(fixtures.obmConnector32011().getCompatibleTargetApplication('{3550f703-e582-4d05-9a08-453d09bdfdc6}', '1.0')).to.not.exist;
  });

  it('should find a target application of OBM Connector 3.2.0.11 if given Thunderbird/24.1', function() {
    var app = fixtures.obmConnector32011().getCompatibleTargetApplication('{3550f703-e582-4d05-9a08-453d09bdfdc6}', '24.1');

    expect(app).to.exist;
    expect(app.id).to.equal('{3550f703-e582-4d05-9a08-453d09bdfdc6}');
  });

  it('should not find any target application of OBM Connector 3.2.0.11 in strict mode if given Thunderbird/24', function() {
    expect(fixtures.obmConnector32011Strict().getCompatibleTargetApplication('{3550f703-e582-4d05-9a08-453d09bdfdc6}', '24')).to.not.exist;
  });

  it('should not find any target application of Lightning 1.2.2 with binary component if given Thunderbird/17', function() {
    expect(fixtures.ltn122LinuxBinaryComp().getCompatibleTargetApplication('{3550f703-e582-4d05-9a08-453d09bdfdc6}', '17')).to.not.exist;
  });

  it('should not find any target application of Lightning 1.0b2 if given Thunderbird/4', function() {
    expect(fixtures.ltn10b2Linux().getCompatibleTargetApplication('{3550f703-e582-4d05-9a08-453d09bdfdc6}', '4')).to.not.exist;
  });

  it('should not find any target application of OBM Connector 3.2.0.11 if given Firefox/24', function() {
    expect(fixtures.obmConnector32011().getCompatibleTargetApplication('{ec8030f7-c20a-464f-9b0e-13a3a9e97384}', '24')).to.not.exist;
  });

  it('should find a target application of Lightning 1.2.2 if given SeeMonkey/2.7.1', function() {
    var app = fixtures.ltn122Linux().getCompatibleTargetApplication('{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}', '2.7.1');

    expect(app).to.exist;
    expect(app.id).to.equal('{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}');
  });

  it('should find a target application of Lightning 1.2.2 if given Thunderbird/10.0.12', function() {
    var app = fixtures.ltn122Linux().getCompatibleTargetApplication('{3550f703-e582-4d05-9a08-453d09bdfdc6}', '10.0.12');

    expect(app).to.exist;
    expect(app.id).to.equal('{3550f703-e582-4d05-9a08-453d09bdfdc6}');
  });

  it('should find a target application of OBM Connector 3.2.0.11 if given Thunderbird', function() {
    var app = fixtures.obmConnector32011().getCompatibleTargetApplication('{3550f703-e582-4d05-9a08-453d09bdfdc6}');

    expect(app).to.exist;
    expect(app.id).to.equal('{3550f703-e582-4d05-9a08-453d09bdfdc6}');
  });

  it('should not find any target application of OBM Connector 3.2.0.11 if given Firefox', function() {
    expect(fixtures.obmConnector32011().getCompatibleTargetApplication('{ec8030f7-c20a-464f-9b0e-13a3a9e97384}')).to.not.exist;
  });

});
