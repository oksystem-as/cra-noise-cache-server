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
cp ./Dockerfile ../binaries/
cp ./start.bat ../binaries/
cp ./0004A30B0019B046.json ../binaries/
cp ./0004A30B0019B1CA.json ../binaries/
cp ./0004A30B0019D0EA.json ../binaries/
ls -l ../binaries/