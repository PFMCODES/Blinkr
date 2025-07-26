/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, PFMCODES Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

const webview = document.getElementById("webview");
const urlBar = document.getElementById("urlBar");
const moreBtn = document.getElementById("more");
const favicon = document.getElementById("favicon");
const moreMenu = document.getElementById("more-menu");


const reloadBtn = document.getElementById('refresh');
let Xicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" fill="white" width="26" height="26"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="white"></path></svg>`;

const reloadSVG = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 3V8M21 8H16M21 8L18 5.29168C16.4077 3.86656 14.3051 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.2832 21 19.8675 18.008 20.777 14" stroke="#f1f1f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`

window.addEventListener("dom-ready", () => {
    document.getElementById("new-window").addEventListener('click', () => {
      window.electronAPI.createWindow()
    })
    // Toggle menu on button click
    moreBtn.addEventListener("click", () => {
        moreMenu.classList.toggle("show");
    });

    // Optional: close menu when clicking outside
    window.addEventListener("click", (e) => {
        if (!moreBtn.contains(e.target) && !moreMenu.contains(e.target)) {
            moreMenu.classList.remove("show");
        }
    });

    // Hide menu on mouse leave
    moreMenu.addEventListener("mouseleave", () => {
        moreMenu.classList.remove("show");
    });

    // URL bar enter key
    urlBar.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            let input = urlBar.value.trim();

            const resolvedPath = resolveInternalURL(input);

            if (resolvedPath) {
            webview.src = resolvedPath;
            } else {
            // Treat as web search or URL
            if (!input.startsWith("http://") && !input.startsWith("https://")) {
                if (input.includes(" ")) {
                input = "https://google.com/search?q=" + encodeURIComponent(input);
                } else {
                input = "https://" + input;
                }
            }
            webview.src = input;
            }
        }
    });

    // Buttons - only run if `window.electronAPI` exists
    if (window.electronAPI) {
        document.getElementById("exit").addEventListener("click", () => {
            window.electronAPI.quitApp();
        });

        document.getElementById("back").addEventListener("click", () => {
            window.electronAPI.goBack();
        });

        document.getElementById("forward").addEventListener("click", () => {
            window.electronAPI.goForward();
        });

        document.getElementById("refresh").addEventListener("click", () => {
            window.electronAPI.reload();
        });
        document.getElementById("settings").addEventListener("click", () => {
            document.getElementById("webview").src = "./blinkr-pages/settings.html";
        });

        // Handle actual webview actions from main process
        window.electronAPI.onGoBack(() => webview.goBack());
        window.electronAPI.onGoForward(() => webview.goForward());
        window.electronAPI.onReload(() => webview.reload());
    } else {
        console.error("❌ window.electronAPI is not defined. Check preload.js and webPreferences.");
    }
});

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("new-window").addEventListener('click', () => {
      window.electronAPI.createWindow()
    })
    // Toggle menu on button click
    moreBtn.addEventListener("click", () => {
        moreMenu.classList.toggle("show");
    });


    // Optional: close menu when clicking outside
    window.addEventListener("click", (e) => {
        if (!moreBtn.contains(e.target) && !moreMenu.contains(e.target)) {
            moreMenu.classList.remove("show");
        }
    });

    // Hide menu on mouse leave
    moreMenu.addEventListener("mouseleave", () => {
        moreMenu.classList.remove("show");
    });

    // URL bar enter key
    document.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            let input = urlBar.value.trim();

            const resolvedPath = resolveInternalURL(input);

            if (resolvedPath) {
            webview.src = resolvedPath;
            } else {
            // Treat as web search or URL
            if (!input.startsWith("http://") && !input.startsWith("https://")) {
                if (input.includes(" ")) {
                input = "https://google.com/search?q=" + encodeURIComponent(input);
                } else {
                input = "https://" + input;
                }
            }
            webview.src = input;
            }
        }
    });

    // Buttons - only run if `window.electronAPI` exists
    if (window.electronAPI) {
        document.getElementById("exit").addEventListener("click", () => {
            window.electronAPI.quitApp();
        });

        document.getElementById("back").addEventListener("click", () => {
            window.electronAPI.goBack();
        });

        document.getElementById("forward").addEventListener("click", () => {
            window.electronAPI.goForward();
        });

        document.getElementById("refresh").addEventListener("click", () => {
            if (reloadBtn.innerHTML === reloadSVG) {
              window.electronAPI.reload();
            }
            else if (reloadBtn.innerHTML === Xicon) {
              window.electronAPI.stopReload();
            }
        });
        document.getElementById("settings").addEventListener("click", () => {
            document.getElementById("webview").src = "./blinkr-pages/settings.html";
        });

        // Handle actual webview actions from main process
        window.electronAPI.onGoBack(() => webview.goBack());
        window.electronAPI.onGoForward(() => webview.goForward());
        window.electronAPI.onReload(() => webview.reload());
    } else {
        console.error("❌ window.electronAPI is not defined. Check preload.js and webPreferences.");
    }
});

webview.addEventListener("did-navigate", (e) => {
    urlBar.value = e.url;
    if (e.url != "https://google.com/") {
        localStorage.setItem("tab", e.url)
    }
});

webview.addEventListener("did-navigate-in-page", (e) => {
    urlBar.value = e.url;
});

const overlay = document.createElement("div");

// Style the overlay as a blank white screen
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.backgroundColor = "white";
overlay.style.zIndex = "9999";
overlay.style.display = "none";
document.body.appendChild(overlay);

// Show for 0.01 seconds on start loading
webview.addEventListener("did-start-loading", () => {
  reloadBtn.innerHTML = Xicon
});

webview.addEventListener("did-stop-loading", () => {
    reloadBtn.innerHTML = reloadSVG
});

webview.addEventListener("did-fail-load", (event) => {
  // Ignore blank pages or intentional redirects
  if (event.validatedURL && event.errorCode !== -3) {
    console.warn("Page failed to load:", event.errorDescription);
    webview.src = "./blinkr-pages/404.html";
    urlBar.value == event.url
  }
});


const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const applyTheme = (isDark) => {
  document.body.classList.remove("dark-mode", "light-mode");
  document.body.classList.add(isDark ? "dark-mode" : "light-mode");
  window.electronAPI.reload();
};

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
applyTheme(mediaQuery.matches); // initial check
mediaQuery.addEventListener('change', (e) => applyTheme(e.matches)); // listen for changes

webview.addEventListener("did-navigate", (e) => {
  const url = e.url;

  // Get current history from localStorage
  let history = [];
  try {
    const raw = localStorage.getItem("history");
    if (raw) history = JSON.parse(raw);
  } catch (err) {
    console.warn("⚠️ History format invalid. Resetting history.");
  }

  // Add URL if not duplicate
  if (!history.includes(url)) {
    history.push(url);
    localStorage.setItem("history", JSON.stringify(history));
  }

  // UI updates
  if (url.endsWith("blinkr-pages/settings.html")) {
    urlBar.value = "blinkr://settings";
     favicon.src = "../assets/images/logo.png"
  } else if (url.endsWith("blinkr-pages/version.html")) {
    urlBar.value = "blinkr://version";
      favicon.src = "../assets/images/logo.png"
  }
  else if (url.endsWith("blinkr-pages/history.html")) { 
    urlBar.value = "blinkr://history"
      favicon.src = "../assets/images/logo.png"
  } else if (url.endsWith("blinkr-pages/new.html")) {
      favicon.src = "../assets/images/logo.png"
     urlBar.value = "";
  } else {
    urlBar.value = url;
    if (!url.includes("google.com")) {
      localStorage.setItem("tab", url);
    }
  }
});

function resolveInternalURL(input) {
  if (input.startsWith("blinkr://")) {
    switch (input) {
      case "blinkr://settings":  favicon.src = "../assets/images/logo.png"; return "./blinkr-pages/settings.html";
      case "blinkr://downloads":  favicon.src = "../assets/images/logo.png"; return "./blinkr-pages/downloads.html";
      case "blinkr://history":  favicon.src = "../assets/images/logo.png"; return "./blinkr-pages/history.html";
      case "blinkr://bookmark":  favicon.src = "../assets/images/logo.png"; return "./blinkr-pages/bookmarks.html";
      case "blinkr://new":  favicon.src = "../assets/images/logo.png"; return "./blinkr-pages/new.html"
      case "blinkr://version":
      case "blinkr://":  favicon.src = "../assets/images/logo.png"; return "./blinkr-pages/version.html";
      default:  favicon.src = "../assets/images/logo.png"; return "./blinkr-pages/404.html";
    }
  }
  return null;
}


webview.addEventListener("will-navigate", (e) => {
  const url = e.url;
  if (url.startsWith("blinkr://")) {
    e.preventDefault(); // cancel default
    const resolved = resolveInternalURL(url);
    if (resolved) {
      webview.src = resolved;
    } else {
      webview.src = "./blinkr-pages/404.html";
    }
  }
});

webview.addEventListener("did-finish-load", async () => {
  try {
    const PageName = webview.getTitle();
    const url = webview.src;
    document.querySelector("title").innerText = `Blinkr - ${PageName}`;
    
    const icon = await getFaviconURL(url);  // ✅ await the promise
    console.log("Favicon:", icon);
    favicon.src = icon || "../assets/images/default-favicon.svg";
  } catch (err) {
    console.error("Failed to load favicon:", err.message);
    favicon.src = "../assets/images/logo.png";
  }
});

async function getFaviconURL(siteUrl) {
  if (siteUrl.startsWith("blinkr://")) {
     return "../assets/images/logo.png"
  }
  else {
    try {
      return await window.electronAPI.getFaviconURL(siteUrl);
    }
    catch {
      return "../assets/images/default-favicon.svg";
    }
  }
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "r") {
    e.preventDefault()
    window.electronAPI.reload()
  }
  if (e.ctrlKey && e.key.toLowerCase() === "r") {
    e.preventDefault()
    window.electronAPI.reload()
  }
  if (e.shiftKey && e.ctrlKey && e.key.toLowerCase() === "i") {
    webview.openDevTools();
  }
  if (e.shiftKey && e.ctrlKey && e.key.toLowerCase() === "j") {
    webview.openDevTools();
  }
  if (e.key === "F12") {
    webview.openDevTools();
  }
});