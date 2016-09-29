#!/bin/bash

set -e -x

ls -l
npm install
npm run typings install
npm run grunt
ls -l
