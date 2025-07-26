/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, PFMCODES Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-mode' : 'light-mode';
document.body.classList.add(theme);

document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const para = document.getElementById('input').value.trim();
        if (isValidURL(para)) {
            // Add protocol if missing
            const url = para.startsWith("http://") || para.startsWith("https://") ? para : "http://" + para;
            window.location.href = url;
        } else {
            window.location.href = `https://pfmcodes.onrender.com/apps/blinkr-search/search/?q=${encodeURIComponent(para)}`;
        }
    }
});

function isValidURL(input) {
    try {
        new URL(input);
        return true;
    } catch (e) {
        return false;
    }
}