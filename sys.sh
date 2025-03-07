#!/bin/sh

set -euo pipefail

apk -U update
apk -U upgrade
rm -rf /var/cache/apk/*

adduser --disabled-password user

chmod +x /application/entrypoint.sh

npm install -g npm@latest
npm install && npm cache clean --force

npm i sharp
npm rebuild --arch=x64 --platform=linux --libc=musl sharp
npm run build

cp -r /application/ /home/user
rm -r /application/*

chown -R user /home/user/application/
chmod -R 772 /home/user/application/.next
chmod -R 777 /home/user/application/.logs