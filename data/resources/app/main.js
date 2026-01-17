// main.js ChatGPT-assisted, presented by @cielavenir
// license: CC0 (public domain)

// launcher.mjs (ESM)
import { app, BrowserWindow, Menu, protocol } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM has no __dirname, we must reconstruct it:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));
const appPath = path.join(__dirname, 'resources', 'app.asar');
app.setAppPath(appPath);

app.whenReady().then(() => {
  protocol.interceptFileProtocol('file', (request, callback) => {
    // Parse URL properly
    const url = new URL(request.url);

    // Convert URL → filesystem path
    let filePath = fileURLToPath(url);

    // Optional: normalize / secure
    filePath = path.normalize(filePath);

    if (filePath.endsWith('electron_latest.js')) {
      callback(path.join(__dirname, 'app', 'electron_latest_patched.js'));
    } else if (filePath.endsWith('tyrano/libs/blob.js')) {
      callback(path.join(__dirname, 'app', 'blob_patched.js'));
    } else {
      callback(filePath);
    }
    return true;
  })
})

app.on('browser-window-created', (_, win) => {
  win.webContents.once('dom-ready', () => {
    // win.webContents.openDevTools({ mode: 'detach' });
  });
});

// Load the packed app.asar
await import(path.join(appPath, 'main.js'));

