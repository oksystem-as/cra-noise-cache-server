#!/bin/bash

set -e -x

ls -l
npm install
npm run typings install
npm run grunt
ls -l
cp ./bin ../binaries/
cp ./docs ../binaries/
cp ./config.yaml ../binaries/
cp ./package.json ../binaries/
cp ./dist ../binaries/
