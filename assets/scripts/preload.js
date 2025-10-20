/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, PFMCODES Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

const { contextBridge, ipcRenderer } = require('electron');
const { existsSync } = require('fs');
const https = require("https");

contextBridge.exposeInMainWorld('electronAPI', {
  // ---- App Control ----
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  quitApp: () => ipcRenderer.send('app-quit'),
  createWindow: () => ipcRenderer.send('create-window'),

  // ---- Navigation (Renderer → Main) ----
  goBack: () => ipcRenderer.send('webview-go-back'),
  goForward: () => ipcRenderer.send('webview-go-forward'),
  reload: () => ipcRenderer.send('webview-reload'),
  stopReload: () => ipcRenderer.send('webview-stop-reload'),

  // ---- Navigation (Main → Renderer) ----
  onGoBack: (callback) => ipcRenderer.on('trigger-webview-go-back', callback),
  onGoForward: (callback) => ipcRenderer.on('trigger-webview-go-forward', callback),
  onReload: (callback) => ipcRenderer.on('trigger-webview-reload', callback),
  onStopReload: (callback) => ipcRenderer.on('trigger-webview-stop', callback),

  // ---- Favicon fetching ----
  getFaviconURL: (siteUrl) => ipcRenderer.invoke('get-favicon', siteUrl),
});

// ---- Expose fs.existsSync ----
contextBridge.exposeInMainWorld('fs', {
  exists: (path) => existsSync(path),
});

// ---- Optional: Favicon fetcher (Google) ----
contextBridge.exposeInMainWorld("blinkrAPI", {
  getFavicon: (domain) =>
    new Promise((resolve) => {
      const url = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
      https.get(url, (res) => {
        let data = [];
        res.on("data", (chunk) => data.push(chunk));
        res.on("end", () => {
          const base64 = Buffer.concat(data).toString("base64");
          resolve(`data:image/png;base64,${base64}`);
        });
      }).on("error", (err) => {
        console.error("Favicon fetch failed:", err.message);
        resolve(null);
      });
    }),
});
