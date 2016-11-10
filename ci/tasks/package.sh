#!/bin/bash

set -e -x

ls -l
tar -cf ../package/binaries.tar ../binaries/
ls -l ../package/