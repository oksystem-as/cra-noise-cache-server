#!/bin/bash

set -e -x

apk add --no-cache curl
npm install -f json-diff

curl "http://hndocker.oksystem.local:58081/message/get/0018B2000000033A?token=kBPIDfNdSfk8fkATerBa6ct6yshdPbOX&order=desc&start=2014-01-01T01%3A01%3A01&limit=10" -o a.json
curl "http://hndocker.oksystem.local:58081/message/get/0018B2000000033A?token=kBPIDfNdSfk8fkATerBa6ct6yshdPbOX&order=desc&start=2014-01-01T01%3A01%3A01&limit=10" -o b.json

sh ./tmp/test/diff.sh a.json b.json