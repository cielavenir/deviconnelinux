// original: app.asar/tyrano/libs/blob.js

// On environments other than Windows, stripping 3rd / in file:/// causes js error when the current directory is not /
// On macOS, it does produce by running `./DevilConnection.app/Contents/MacOS/DevilConnection_prod`
// Reported as https://steamcommunity.com/app/3054820/discussions/1/685242695859571714/

async function readAsArrayBuffer(path) {
  // for built
  if (window.api) {
    const prefixToStrip = process.platform == 'win32' ? /^file:\/\/\// : /^file:\/\// // If not Windows, do not strip 3rd /

    const newPath = path.startsWith('file:///')
      ? decodeURI(path.replace(prefixToStrip, '')) // file:/// から始まる場合は取り除く
      : path.match(/^(.+?:|\/)/)
      ? decodeURI(path) // 絶対パスの場合はそのまま使う
      : window.api.returnAppPath() + '/' + decodeURI(path) // 相対パスの場合は絶対パスに変換する
    return window.api.readFileBin(newPath)
  }

  // for non-built
  const response = await fetch(path, {
    headers: [['Content-Type', 'image/png']],
  })
  if (!response.ok) {
    throw 'failed to load: ' + path
  }

  return response.arrayBuffer()
}

