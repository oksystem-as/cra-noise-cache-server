#!/bin/bash

set -e -x

apk add --no-cache curl
npm install -g json-diff

curl "https://api.pripoj.me/message/get/0018B2000000033A?token=kBPIDfNdSfk8fkATerBa6ct6yshdPbOX&order=desc&start=2014-01-01T01%3A01%3A01&limit=10" -o a.json
curl "http://127.0.0.1:8080/message/get/0018B2000000033A?token=kBPIDfNdSfk8fkATerBa6ct6yshdPbOX&order=desc&start=2014-01-01T01%3A01%3A01&limit=10" -o b.json

sh ./tmp/test/diff.sh a.json b.json