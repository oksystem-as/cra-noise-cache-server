#!/bin/bash

set -e -x

ls -l
cp -R ./bin ../binaries/
cp -R ./docs ../binaries/
cp ./config.yaml ../binaries/
cp ./package.json ../binaries/
cp ./Dockerfile ../binaries/
ls -l ../binaries/