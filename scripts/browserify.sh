#!/bin/bash

BASE_DIR=`dirname $0`
APP_DIR="$BASE_DIR/.."

browserify "$APP_DIR/frontend/js/product.src.js" -o "$APP_DIR/frontend/js/product.js"

