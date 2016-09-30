#!/bin/bash

set -e -x

ls -l
npm install
npm run typings install
npm run grunt
ls -l
cp -R ./bin ../binaries/
cp -R ./docs ../binaries/
cp -R ./dist ../binaries/
cp ./config.yaml ../binaries/
cp ./package.json ../binaries/
ls -l ../binaries/