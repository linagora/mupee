'use strict';

var os = require('os'),
    ChromeManifest = require('./chrome-manifest').ChromeManifest,
    ManifestInstruction = require('./chrome-manifest').ManifestInstruction,
    BinaryComponentInstruction = require('./chrome-manifest').BinaryComponentInstruction;

var parsers = {
  'manifest': function(args) {
    return new ManifestInstruction({
      path: args[1],
      flags: args.slice(2)
    });
  },
  'binary-component': function(args) {
    return new BinaryComponentInstruction({
      path: args[1],
      flags: args.slice(2)
    });
  }
};

exports = module.exports = function parseChromeManifest(manifest, callback) {
  if (!manifest) {
    return callback('Cannot parse empty manifest data');
  }

  var instructions = [];

  try {
    manifest.split(os.EOL).forEach(function(line) {
      if (line[0] === '#') {
        return;
      }

      var tokens = line.split(/\s+/);

      if (parsers[tokens[0]]) {
        instructions.push(parsers[tokens[0]](tokens));
      }
    });
  } catch (err) {
    return callback('Invalid manifest data (' + err + ')');
  }

  callback(null, new ChromeManifest({ instructions: instructions }));
};
