Mozilla Updater
===============

About
-----

Mupee acts as a proxy between the Mozilla.org update servers and your corporate Mozilla software. Using it, you can
allow/deny updates of Mozilla products per version. As an example, you can tell Mupee to allow
updates of Thunderbird up to the last minor version of the 17 branch, but not switch to the 24 branch.

Requirements
------------

Mozilla updater proxy needs:

- node.js version >= 0.10.x
- a MongoDB server
- an internet connection to the Mozilla update servers

How to use it
-------------

        npm install mupee
        cd node_modules/mupee
        npm start

It will start the server with some default values (1234 as the server port or 27017 as the mongodb server port).

On your Mozilla softwares (Thunderbird and Firefox), add a setting :

    app.update.url.override=http://[your proxy IP address or hostname]/update/3/%PRODUCT%/%VERSION%/%BUILD_ID%/%BUILD_TARGET%/%LOCALE%/%CHANNEL%/%OS_VERSION%/%DISTRIBUTION%/%DISTRIBUTION_VERSION%/update.xml

How to configure it
-------------------

Rename ./conf/config.json.sample to ./conf/config.json.

Here's the details :

        {
          "download" : {
            "dir" : "./data/files",                               // default path to store mozilla updates.
            "autoCache" : true                                    // not implemented yet
          },
          "database" : {
            "url" : "mongodb://localhost:27017/mozilla-updater",  // mongodb server location
            "options" : {                                         // options for the mongodb driver
              "auto_reconnect" : true,
              "w" : 1,
              "journal" : true,
              "fsync" : true,
              "safe" : true
            }
          },
          "fetch" : {
            "remoteHost" : "https://aus3.mozilla.org/update/3",  // remote mozilla repository
            "autoCache" : true                                   // not implemented yet
          },
          "server" : {
            "port" : 1234,                                       // default node server port
            "url" : "http://localhost"
          },
          "log" : {                                              // loggin options
            "file" : {
              "enabled" : true,
              "filename" : "./log/mozilla-updater.log",
              "level" : "info",
              "handleExceptions" : true,
              "json" : false,
              "prettyPrint" : true,
              "colorize" : false
            },
            "console" : {
              "enabled" : true,
              "level" : "debug",
              "handleExceptions" : true,
              "json" : false,
              "prettyPrint" : true,
              "colorize" : true
            }
          }
        }

By default, logging are done into ./log/mozilla-udpater.log.

Contributing
------------

We love contributions, don't hesitate to send Pull requests !
The bug tracker is @ https://github.com/linagora/mupee/issues.

