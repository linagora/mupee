Mozilla Updater
===============

About
-----

The mozilla updater server act (will act...) as a proxy between the Mozilla.org update servers and your corporate Mozilla software. Using it, you can allow/deny updates of Mozilla products per version. As an example, you can tell your mozilla updater proxy to allow updates of Thunderbird up to the last minor version of the 17 branch, but not switch to the 24 branch.

The proxy also handles (will also handle...) the management of extensions updates.

Requirements
------------

Mozilla updater proxy needs:

- node.js version 10.x
- a MongoDB server
- an internet connection to the Mozilla update servers

How to use it
-------------

- unpack the software
- change directory to the software directory
- npm install
- run 

        node update-proxy.js
from the command line

On your Mozilla softwares (Thunderbird and Firefox), add a setting :

    app.update.url.override=http://[your proxy IP address or hostname]/update/3/%PRODUCT%/%VERSION%/%BUILD_ID%/%BUILD_TARGET%/%LOCALE%/%CHANNEL%/%OS_VERSION%/%DISTRIBUTION%/%DISTRIBUTION_VERSION%/update.xml

Contributing
------------

We love contributions, don't hesitate to send Pull requests ! The bug tracker is @ http://ci-obm.linagora.com/jira/browse/MU .