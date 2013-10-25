#!/bin/bash

BASE_DIR=`dirname $0`
NAVIGATOR="$1"

if [ "$NAVIGATOR" = "" ] ; then
  NAVIGATOR="PhantomJS"
fi

echo ""
echo "Starting Karma Server (http://karma-runner.github.io)"
echo "-------------------------------------------------------------------"

karma start --browsers "$NAVIGATOR" $BASE_DIR/../test/config/karma.conf.js $*
