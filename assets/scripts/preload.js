/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, PFMCODES Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

const { contextBridge, ipcRenderer } = require('electron');
const { existsSync } = require('fs');
const https = require("https");

contextBridge.exposeInMainWorld('electronAPI', {
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  quitApp: () => ipcRenderer.send('app-quit'),

  // Navigation actions for BrowserView
  goBack: () => ipcRenderer.send('go-back'),
  goForward: () => ipcRenderer.send('go-forward'),
  reload: () => ipcRenderer.send('reload'),
  stopReload: () => ipcRenderer.send('stop'),

  // Create new browser window
  createWindow: () => ipcRenderer.send('create-window'),

  // Listen for main-process-driven triggers (optional)
  onGoBack: (callback) => ipcRenderer.on('trigger-go-back', callback),
  onGoForward: (callback) => ipcRenderer.on('trigger-go-forward', callback),
  onReload: (callback) => ipcRenderer.on('trigger-reload', callback),

  // Favicon fetching from main
  getFaviconURL: (siteUrl) => ipcRenderer.invoke('get-favicon', siteUrl),
});

// Expose `fs.existsSync`
contextBridge.exposeInMainWorld('fs', {
  exists: (path) => existsSync(path),
});

// Favicon fetcher from Google (renderer side)
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
