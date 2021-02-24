![Archived](https://img.shields.io/badge/Current_Status-archived-blue?style=flat)

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

Here's the details:

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

By default, logging is done into ./log/mozilla-udpater.log.

What now?
---------

Mupee comes with a user friendly frontend which allow an administrator to manage Thunderbird and Firefox updates policies
by creating rules.

Open a browser to your mupee server (depending on the previous configuration) then choose one of the Mozilla products to handle.
The frontend is composed of:

- The default policy which applies to every clients.
- The list of clients who have requested an update.
- For each client, a specific policy that can be modified.

For now, 4 rules are available:

- Allow all upgrades: Mupee will accept every update. Mupee works as a simple proxy between the mozilla repository and the client.
- Deny all upgrades: Mupee will reject every update. Mupee works as a deny all firewall.
- Upgrade to latest release of a given branch: Mupee will return the latest update of to the specific given branch.
- Upgrade to latest release of the current branch: Mupee will return the latest update corresponding to the current major version of the client.

Mupee also comes with an extendable rules engine. We will deliver more informations about creating new rules very soon...

Contributing
------------

We love contributions, don't hesitate to send Pull requests!
The bug tracker is @ https://github.com/linagora/mupee/issues.

