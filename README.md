# 🌐 Blinkr — A Simple, Fast & Modern Web Browser

**Blinkr** is a custom desktop web browser made using [Electron](https://www.electronjs.org/). It’s designed to be fast, lightweight, and easy to use. Built by the **PFMCODES** team, it gives you a modern browsing experience — made with love and care.

---

## ✨ What Can Blinkr Do?

- ✅ Open websites just like Chrome or Edge
- 🖼️ Has a clean and modern look
- 🌓 Dark and light themes
- 🪟 Open multiple windows
- 🛠️ Great for developers too (local files, dev tools)
- 🔐 No data tracking — private and safe

---

## 💻 How to Use It(Do Not Recomended, if you're not experienced)

### 📦 What You Need

Before you start, make sure you have:

- [Node.js](https://nodejs.org/) installed (v18 or higher)
- Basic understanding of how to use a terminal or command prompt

### 🔧 Steps to Run Blinkr

1. Open your terminal
2. Type these commands one by one:

```bash
git clone https://github.com/PFMCODES/blinkr.git
cd blinkr
npm install
npm run start
```

This will open the development version of Blinkr.

## 📂 Project Structure (Simple Overview)

| File/Folder    | Purpose                               |
| -------------- | ------------------------------------- |
| `src/`         | Browser UI and frontend code          |
| `main.js`      | Main Electron process (app logic)     |
| `preload.js`   | Connects frontend with backend safely |
| `assets/`      | Icons and images, css files and js files                      |
| `package.json` | Project metadata and scripts          |


## 🔧 Build (Optional)

To build a desktop .exe version for Windows:

```bash
npm run build:release
```

> Output will be in the `dist/` folder.


## 📜 License
MIT License © 2025 PFMCODES Org & Blinkr Team
> ⚠️ We are not responsible for copies downloaded from unofficial websites.

## 🤝 Contribute

Want to help build Blinkr?
- Report a bug or issues
- Suggest Issues
- clone, fix/change and pull request, we might even hire you for the development of Blinkr