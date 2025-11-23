/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, PFMCODES Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const axios = require("axios");
const cheerio = require("cheerio");

let mainWindow;

function createWindow() {
  const isDev = !app.isPackaged;

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    autoHideMenuBar: true,
    show: false,
    icon: path.join(__dirname, '..', '..', 'assets', 'images', 'logo.png'),
    webPreferences: {
      devTools: true, // ✅ allow DevTools, we’ll attach custom window
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      webviewTag: true,
      sandbox: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
    }
  });

  const indexPath = isDev
    ? path.join(__dirname, '../../src/index.html')
    : 'src/index.html';

  mainWindow.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  mainWindow.loadFile(indexPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });
  
}

app.whenReady().then(() => {
  createWindow();
});
ipcMain.on('create-window', () => createWindow());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('webview-go-back', (event) => {
  event.sender.send('trigger-webview-go-back');
});

ipcMain.on('webview-go-forward', (event) => {
  event.sender.send('trigger-webview-go-forward');
});

ipcMain.on('webview-reload', (event) => {
  event.sender.send('trigger-webview-reload');
});

ipcMain.on('webview-stop-reload', (event) => {
  event.sender.send('trigger-webview-stop');
});

ipcMain.handle('get-app-info', () => {
  return {
    version: app.getVersion(),
    engine: 'Chromium',
    platform: os.platform()
  };
});

// Placeholder update function
async function updateBlinkr() {
  const win = new BrowserWindow({
    width: 500,
    height: 700,
    simpleFullscreen: true,
    autoHideMenuBar: true,
    icon: "assets/images/logo.png", // use 'icon' here instead of win.setIcon()
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('src/Update.html');
  win.once('ready-to-show', () => {
    win.maximize();
    win.show();
  });
}

ipcMain.handle('get-favicon', async (_event, siteUrl) => {
  try {
    if (siteUrl.startsWith("http")) {
      // Fetch HTML of the page
      const htmlRes = await axios.get(siteUrl, {
        timeout: 5000,
        maxRedirects: 5,
        validateStatus: () => true, // Allow non-200 responses
      });
      const $ = cheerio.load(htmlRes.data);

      // Get favicon link
      let iconHref =
        $('link[rel="icon"]').attr('href') ||
        $('link[rel="shortcut icon"]').attr('href') ||
        $('link[rel="apple-touch-icon"]').attr('href') ||
        '/favicon.ico';

      // Resolve relative URLs
      const baseUrl = htmlRes.request?.res?.responseUrl || siteUrl;
      const iconUrl = iconHref.startsWith('http')
        ? iconHref
        : new URL(iconHref, baseUrl).href;

      // Fetch the favicon
      const iconRes = await axios.get(iconUrl, { responseType: 'arraybuffer', timeout: 5000 });
      const contentType = iconRes.headers['content-type'] || 'image/png';
      const base64 = Buffer.from(iconRes.data, 'binary').toString('base64');

      return `data:${contentType};base64,${base64}`;
    }

    // Handle local file:// pages
    if (siteUrl.startsWith("file://")) {
      let filePath = new URL(siteUrl).pathname;
      if (process.platform === "win32" && filePath.startsWith("/")) filePath = filePath.slice(1);
      filePath = decodeURIComponent(filePath);

      const htmlContent = fs.readFileSync(filePath, "utf-8");
      const $ = cheerio.load(htmlContent);

      let iconHref =
        $('link[rel="icon"]').attr('href') ||
        $('link[rel="shortcut icon"]').attr('href') ||
        $('link[rel="apple-touch-icon"]').attr('href') ||
        "favicon.ico";

      const iconPath = path.resolve(path.dirname(filePath), iconHref);

      if (fs.existsSync(iconPath)) {
        const iconData = fs.readFileSync(iconPath);
        const ext = path.extname(iconPath).slice(1);
        const mimeType = ext === "ico" ? "image/x-icon" : `image/${ext}`;
        const base64 = Buffer.from(iconData).toString("base64");

        return `data:${mimeType};base64,${base64}`;
      } else {
        console.warn("Local favicon not found:", iconPath);
      }
    }
  } catch (e) {
    console.warn("Failed to fetch favicon:", siteUrl, e.message);
  }

  // Fallback
  try {
    const fallbackPath = "./assets/images/default-favicon.svg";
    const fallbackData = fs.readFileSync(fallbackPath);
    const base64 = Buffer.from(fallbackData).toString("base64");
    return `data:image/svg+xml;base64,${base64}`;
  } catch (e) {
    console.error("Failed to load fallback favicon", e.message);
    return '';
  }
});
