'use strict';

exports.xml = {};

exports.xml.validTwoPatches = function() {
  return '<update type="minor" version="3.5.3" extensionVersion="3.5.3" buildID="20090824101458" ' +
          'detailsURL="http://www.mozilla.com/en-US/firefox/3.5.3/releasenotes/">' +
            '<patch type="complete" URL="http://download.mozilla.org/?product=firefox-3.5.3-complete' +
                '&amp;os=win&amp;lang=en-US" hashFunction="SHA512" ' +
                'hashValue="f8abbaea98bd453b651c24025dbb8cea5908e532ca64ad7150e88778ccb77c0325341c0fecb' +
                'ec37f31f31cdf7e13955c28140725282d2ce7c4a37c89a25319a1" size="10728423"/>' +
            '<patch type="partial" URL="http://download.mozilla.org/?' +
                'product=firefox-3.5.3-partial-3.5.2&amp;os=win&amp;lang=en-US" hashFunction="SHA512" ' +
                'hashValue="20b133f1bd2025360bda8ef0c53132a5806dbd0606e0fe7c6d1291d1392532cc960262f87b0' +
                'c7d4fbe8f9bc9fba64ed28ecd89b664c17f51f98acdd76b26ea6a" size="2531877"/>' +
          '</update>';
};

exports.xml.validNoPatch = function() {
  return '<update type="minor" version="3.5.3" extensionVersion="3.5.3" buildID="20090824101458" ' +
                          'detailsURL="http://www.mozilla.com/en-US/firefox/3.5.3/releasenotes/">' +
        '</update>';
};

exports.xml.validAlternativeDataStructure = function() {
  return '<update type="minor" displayVersion="d3.5.3" appVersion="a3.5.3" platformVersion="p3.5.3" ' +
                          'buildID="20090824101458" ' +
                          'detailsURL="http://www.mozilla.com/en-US/firefox/3.5.3/releasenotes/">' +
          '</update>';
};
