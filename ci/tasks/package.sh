#!/bin/bash

set -e -x

ls -l
tar -cf ../package/binaries.tar ./
ls -l ../package/