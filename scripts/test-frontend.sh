#!/bin/bash

BASE_DIR=`dirname $0`
APP_DIR="$BASE_DIR/.."
NAVIGATOR="$1"

if [ "$NAVIGATOR" = "" ] ; then
  NAVIGATOR="PhantomJS"
fi


sh "$BASE_DIR/browserify.sh"

echo ""
echo "Starting Karma Server (http://karma-runner.github.io)"
echo "-------------------------------------------------------------------"

karma start --browsers "$NAVIGATOR" "$APP_DIR/test/config/karma.conf.js" $*
