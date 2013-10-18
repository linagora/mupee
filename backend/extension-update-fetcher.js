'use strict';

var request = require('request'),
    parser = require('libxml-to-js'),
    config = require('./config'),
    ExtensionSourceVersion = require('./extension-source-version').ExtensionSourceVersion,
    ExtensionUpdate = require('./extension-source-version').ExtensionUpdate;

exports.fetch = function(version, callback) {
  request({
    uri: config.fetch.extensionsRemoteHost,
    qs: {
      reqVersion: version.reqVersion,
      id: version.id,
      version: version.version,
      status: version.status,
      appID: version.appID,
      appVersion: version.appVersion,
      appOS: version.appOS,
      appABI: version.appABI,
      currentAppVersion: version.currentAppVersion,
      maxAppVersion: version.maxAppVersion,
      locale: version.locale,
      updateType: version.updateType,
      compatMode: version.compatMode
    }
  }, function(err, res, body) {
    if (err) {
      return callback(err, version);
    }

    /*
<?xml version="1.0"?>
<RDF:RDF xmlns:RDF="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:em="http://www.mozilla.org/2004/em-rdf#">
    <RDF:Description about="urn:mozilla:extension:{e2fda1a4-762b-4020-b5ad-a41df1933103}">
        <em:updates>
            <RDF:Seq>
                <RDF:li resource="urn:mozilla:extension:{e2fda1a4-762b-4020-b5ad-a41df1933103}:1.9.1"/>
            </RDF:Seq>
        </em:updates>
    </RDF:Description>

    <RDF:Description about="urn:mozilla:extension:{e2fda1a4-762b-4020-b5ad-a41df1933103}:1.9.1">
        <em:version>1.9.1</em:version>
        <em:targetApplication>
            <RDF:Description>
                <em:id>{3550f703-e582-4d05-9a08-453d09bdfdc6}</em:id>
                <em:minVersion>17.0</em:minVersion>
                <em:maxVersion>17.*</em:maxVersion>
                <em:updateLink>https://addons.cdn.mozilla.net/storage/public-staging/2313/lightning-1.9.1-sm+tb-linux.xpi</em:updateLink>
                <em:updateInfoURL>https://addons.mozilla.org/versions/updateInfo/1428980/%APP_LOCALE%/</em:updateInfoURL>
                <em:updateHash>sha256:5f190e99ce21de00a173bf37e0b76904a0306756075e72c779c42cee65cde4c6</em:updateHash>
            </RDF:Description>
        </em:targetApplication>
    </RDF:Description>
</RDF:RDF>
     */
    parser(body, function(parseErr, rdf) {
      if (parseErr) {
        return callback(parseErr, version);
      }

      if (!rdf || !rdf['RDF:Description'] || !rdf['RDF:Description'].length || rdf['RDF:Description'].length < 2) {
        return callback(null, version);
      }

      var musVersion = new ExtensionSourceVersion(version);
      var description = rdf['RDF:Description'][1]; // First one is the list of updates
      var targetApplication = description['em:targetApplication']['RDF:Description'];

      musVersion.addUpdate(new ExtensionUpdate({
        version: description['em:version'],
        targetApplication: {
          id: targetApplication['em:id'],
          minVersion: targetApplication['em:minVersion'],
          maxVersion: targetApplication['em:maxVersion'],
          updateLink: targetApplication['em:updateLink'],
          updateInfoURL: targetApplication['em:updateInfoURL'],
          updateHash: targetApplication['em:updateHash']
        }
      }));

      callback(null, musVersion);
    });
  });
};
