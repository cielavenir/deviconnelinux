#!/bin/bash

if [ "$(uname -s)" != "Linux" ]; then
    echo "kernel not Linux (official installation should suffice?)"
    exit 1
fi
if [ "$(uname -m)" != "x86_64" ]; then
    echo "arch not x86_64"
    exit 1
fi

SCRIPT_DIR=$(dirname $(realpath $0))
INSTALL_DIR=${SCRIPT_DIR}/deviconnelinux
APP_ASAR="app.asar"

if [ -f "${SCRIPT_DIR}/config.sh" ]; then
    . "${SCRIPT_DIR}/config.sh"
fi

mkdir -p "${INSTALL_DIR}"
wget https://github.com/electron/electron/releases/download/v39.2.7/electron-v39.2.7-linux-x64.zip
7z x -o${INSTALL_DIR} electron-v39.2.7-linux-x64.zip
rm electron-v39.2.7-linux-x64.zip

cp -r data/resources "${INSTALL_DIR}/"

# prepare app.asar.unpacked from npm, in case the file is dropped
wget -O - "$(wget -O - https://registry.npmjs.org/steamworks.js/0.4.0 | jq -r .dist.tarball)" | tar xz package/dist
mkdir -p "${INSTALL_DIR}/resources/resources/app.asar.unpacked/node_modules/steamworks.js"
cp -r package/dist "${INSTALL_DIR}/resources/resources/app.asar.unpacked/node_modules/steamworks.js/"
rm -rf package

cp "${APP_ASAR}" "${INSTALL_DIR}/resources/resources/app.asar"
