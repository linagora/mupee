#!/bin/bash

BASE_DIR=`dirname $0`

node $BASE_DIR/../app.js > /dev/null &
PROC=`echo $!`

pushd $BASE_DIR/../ > /dev/null
mocha --reporter spec
popd > /dev/null

kill -9 $PROC
