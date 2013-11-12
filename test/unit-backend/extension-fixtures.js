'use strict';

var Extension = require('../../backend/extension').Extension;

exports.ltn10b2Linux = function() {
  return new Extension({
    id: '{e2fda1a4-762b-4020-b5ad-a41df1933103}',
    version: '1.2.2',
    name: 'Lightning',
    description: 'An integrated calendar for Thunderbird',
    creator: 'Mozilla Calendar Project',
    homepageURL: 'http://www.mozilla.org/projects/calendar/releases/lightning1.2.2.html',
    iconURL: 'chrome://calendar/skin/cal-icon32.png',
    targetPlatforms: ['Linux_x86-gcc3', 'Linux_x86_64-gcc3'],
    targetApplications: [{
      id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      minVersion: '3.0',
      maxVersion: '3.*'
    }]
  });
};

exports.ltn122Linux = function() {
  return new Extension({
    id: '{e2fda1a4-762b-4020-b5ad-a41df1933103}',
    version: '1.2.2',
    name: 'Lightning',
    description: 'An integrated calendar for Thunderbird',
    creator: 'Mozilla Calendar Project',
    homepageURL: 'http://www.mozilla.org/projects/calendar/releases/lightning1.2.2.html',
    iconURL: 'chrome://calendar/skin/cal-icon32.png',
    targetPlatforms: ['Linux_x86-gcc3', 'Linux_x86_64-gcc3'],
    targetApplications: [{
      id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      minVersion: '10.0',
      maxVersion: '10.*'
    }, {
      id: '{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}',
      minVersion: '2.7',
      maxVersion: '2.7.*'
    }]
  });
};

exports.ltn122LinuxBinaryComp = function() {
  return new Extension({
    id: '{e2fda1a4-762b-4020-b5ad-a41df1933103}',
    version: '1.2.2',
    name: 'Lightning',
    description: 'An integrated calendar for Thunderbird',
    creator: 'Mozilla Calendar Project',
    homepageURL: 'http://www.mozilla.org/projects/calendar/releases/lightning1.2.2.html',
    iconURL: 'chrome://calendar/skin/cal-icon32.png',
    targetPlatforms: ['Linux_x86-gcc3', 'Linux_x86_64-gcc3'],
    hasBinaryComponent: true,
    targetApplications: [{
      id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      minVersion: '10.0',
      maxVersion: '10.*'
    }, {
      id: '{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}',
      minVersion: '2.7',
      maxVersion: '2.7.*'
    }]
  });
};

exports.ltn122LinuxBinaryCompNoStrict = function() {
  return new Extension({
    id: '{e2fda1a4-762b-4020-b5ad-a41df1933103}',
    version: '1.2.2',
    name: 'Lightning',
    description: 'An integrated calendar for Thunderbird',
    creator: 'Mozilla Calendar Project',
    homepageURL: 'http://www.mozilla.org/projects/calendar/releases/lightning1.2.2.html',
    iconURL: 'chrome://calendar/skin/cal-icon32.png',
    targetPlatforms: ['Linux_x86-gcc3', 'Linux_x86_64-gcc3'],
    strictCompatibility: false,
    hasBinaryComponent: true,
    targetApplications: [{
      id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      minVersion: '10.0',
      maxVersion: '10.*'
    }, {
      id: '{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}',
      minVersion: '2.7',
      maxVersion: '2.7.*'
    }]
  });
};

exports.ltn122Windows = function() {
  return new Extension({
    id: '{e2fda1a4-762b-4020-b5ad-a41df1933103}',
    version: '1.2.2',
    name: 'Lightning',
    description: 'An integrated calendar for Thunderbird',
    creator: 'Mozilla Calendar Project',
    homepageURL: 'http://www.mozilla.org/projects/calendar/releases/lightning1.2.2.html',
    iconURL: 'chrome://calendar/skin/cal-icon32.png',
    targetPlatforms: ['WINNT'],
    targetApplications: [{
      id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      minVersion: '10.0',
      maxVersion: '10.*'
    }, {
      id: '{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}',
      minVersion: '2.7',
      maxVersion: '2.7.*'
    }]
  });
};

exports.ltn191Linux = function() {
  return new Extension({
    id: '{e2fda1a4-762b-4020-b5ad-a41df1933103}',
    version: '1.9.1',
    name: 'Lightning',
    description: 'An integrated calendar for Thunderbird',
    creator: 'Mozilla Calendar Project',
    homepageURL: 'http://www.mozilla.org/projects/calendar/releases/lightning1.2.2.html',
    iconURL: 'chrome://calendar/skin/cal-icon32.png',
    targetPlatforms: ['Linux_x86-gcc3', 'Linux_x86_64-gcc3'],
    targetApplications: [{
      id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      minVersion: '17.0',
      maxVersion: '17.*'
    }, {
      id: '{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}',
      minVersion: '2.7',
      maxVersion: '2.7.*'
    }]
  });
};

exports.ltn191LinuxBinaryComp = function() {
  return new Extension({
    id: '{e2fda1a4-762b-4020-b5ad-a41df1933103}',
    version: '1.9.1',
    name: 'Lightning',
    description: 'An integrated calendar for Thunderbird',
    creator: 'Mozilla Calendar Project',
    homepageURL: 'http://www.mozilla.org/projects/calendar/releases/lightning1.2.2.html',
    iconURL: 'chrome://calendar/skin/cal-icon32.png',
    targetPlatforms: ['Linux_x86-gcc3', 'Linux_x86_64-gcc3'],
    hasBinaryComponent: true,
    targetApplications: [{
      id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      minVersion: '17.0',
      maxVersion: '17.*'
    }, {
      id: '{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}',
      minVersion: '2.7',
      maxVersion: '2.7.*'
    }]
  });
};

exports.ltn192Linux = function() {
  return new Extension({
    id: '{e2fda1a4-762b-4020-b5ad-a41df1933103}',
    version: '1.9.2',
    name: 'Lightning',
    description: 'An integrated calendar for Thunderbird',
    creator: 'Mozilla Calendar Project',
    homepageURL: 'http://www.mozilla.org/projects/calendar/releases/lightning1.2.2.html',
    iconURL: 'chrome://calendar/skin/cal-icon32.png',
    targetPlatforms: ['Linux_x86-gcc3', 'Linux_x86_64-gcc3'],
    targetApplications: [{
      id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      minVersion: '17.0',
      maxVersion: '17.*'
    }, {
      id: '{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}',
      minVersion: '2.7',
      maxVersion: '2.7.*'
    }]
  });
};

exports.ltn191Windows = function() {
  return new Extension({
    id: '{e2fda1a4-762b-4020-b5ad-a41df1933103}',
    version: '1.9.1',
    name: 'Lightning',
    description: 'An integrated calendar for Thunderbird',
    creator: 'Mozilla Calendar Project',
    homepageURL: 'http://www.mozilla.org/projects/calendar/releases/lightning1.2.2.html',
    iconURL: 'chrome://calendar/skin/cal-icon32.png',
    targetPlatforms: ['WINNT'],
    targetApplications: [{
      id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      minVersion: '17.0',
      maxVersion: '17.*'
    }, {
      id: '{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}',
      minVersion: '2.7',
      maxVersion: '2.7.*'
    }]
  });
};

exports.obmConnector32011 = function() {
  return new Extension({
    id: 'obm-connector@aliasource.fr',
    version: '3.2.0.11',
    name: 'OBM Connector',
    description: 'OBM Calendar provider',
    creator: 'Linagora Group',
    homepageURL: 'http://obm.org/doku.php?id=obmmozillacalendar',
    iconURL: 'chrome://obm-extension/skin/icons/ico_connecteur_32.png',
    targetPlatforms: [],
    targetApplications: [{
      id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      minVersion: '2.0',
      maxVersion: '17.*'
    }]
  });
};

exports.obmConnector32011Strict = function() {
  return new Extension({
    id: 'obm-connector@aliasource.fr',
    version: '3.2.0.11',
    name: 'OBM Connector',
    description: 'OBM Calendar provider',
    creator: 'Linagora Group',
    homepageURL: 'http://obm.org/doku.php?id=obmmozillacalendar',
    iconURL: 'chrome://obm-extension/skin/icons/ico_connecteur_32.png',
    strictCompatibility: 'true',
    targetPlatforms: [],
    targetApplications: [{
      id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      minVersion: '2.0',
      maxVersion: '17.*'
    }]
  });
};

exports.obmConnector32011Darwin = function() {
  return new Extension({
    id: 'obm-connector@aliasource.fr',
    version: '3.2.0.11',
    name: 'OBM Connector',
    description: 'OBM Calendar provider',
    creator: 'Linagora Group',
    homepageURL: 'http://obm.org/doku.php?id=obmmozillacalendar',
    iconURL: 'chrome://obm-extension/skin/icons/ico_connecteur_32.png',
    targetPlatforms: ['Darwin'],
    targetApplications: [{
      id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      minVersion: '2.0',
      maxVersion: '17.*'
    }]
  });
};

exports.obmConnector32011Linux = function() {
  return new Extension({
    id: 'obm-connector@aliasource.fr',
    version: '3.2.0.11',
    name: 'OBM Connector',
    description: 'OBM Calendar provider',
    creator: 'Linagora Group',
    homepageURL: 'http://obm.org/doku.php?id=obmmozillacalendar',
    iconURL: 'chrome://obm-extension/skin/icons/ico_connecteur_32.png',
    targetPlatforms: ['Linux'],
    targetApplications: [{
      id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      minVersion: '2.0',
      maxVersion: '17.*'
    }]
  });
};

exports.obmConnector32011Linux_x64 = function() {
  return new Extension({
    id: 'obm-connector@aliasource.fr',
    version: '3.2.0.11',
    name: 'OBM Connector',
    description: 'OBM Calendar provider',
    creator: 'Linagora Group',
    homepageURL: 'http://obm.org/doku.php?id=obmmozillacalendar',
    iconURL: 'chrome://obm-extension/skin/icons/ico_connecteur_32.png',
    targetPlatforms: ['Linux_x86_64-gcc3'],
    targetApplications: [{
      id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      minVersion: '2.0',
      maxVersion: '17.*'
    }]
  });
};

exports.obmConnector32011Win_All = function() {
  return new Extension({
    id: 'obm-connector@aliasource.fr',
    version: '3.2.0.11',
    name: 'OBM Connector',
    description: 'OBM Calendar provider',
    creator: 'Linagora Group',
    homepageURL: 'http://obm.org/doku.php?id=obmmozillacalendar',
    iconURL: 'chrome://obm-extension/skin/icons/ico_connecteur_32.png',
    targetPlatforms: ['WINNT_x86-msvc', 'WINNT_x86_64-msvc'],
    targetApplications: [{
      id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      minVersion: '2.0',
      maxVersion: '17.*'
    }]
  });
};

exports.frDict45 = function() {
  return new Extension({
    id: 'fr-dicollecte@dictionaries.addons.mozilla.org',
    version: '4.5',
    name: 'Dictionnaires français',
    description: 'Quatre dictionnaires français : «Moderne», «Classique», «Réforme 1990», «Classique &amp; Réforme 1990»',
    creator: 'Olivier R.',
    homepageURL: 'http://www.dicollecte.org/',
    iconURL: null,
    targetPlatforms: [],
    targetApplications: [{
      id: '{ec8030f7-c20a-464f-9b0e-13a3a9e97384}',
      minVersion: '4.0',
      maxVersion: '14.*'
    }, {
      id: '{3550f703-e582-4d05-9a08-453d09bdfdc6}',
      minVersion: '5.0',
      maxVersion: '14.*'
    }, {
      id: '{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}',
      minVersion: '2.1',
      maxVersion: '2.11.*'
    }]
  });
};
