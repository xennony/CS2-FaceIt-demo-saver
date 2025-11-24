# FACEIT Demo Downloader (Fix)

A simple **userscript** for  browser that adds a reliable demo download button on FACEIT match pages.

## Problem
The standard “Watch Demo” button on the FACEIT website often doesn’t work:
* Infinite loading (spinner)
* Browser blocking the popup window
* Cloudflare-related errors

## Solution
This script adds an **Watch demo (FIX)** button next to the standard one.  
It works differently:
1. Extracts the match ID from the URL  
2. Directly queries the public FACEIT API  
3. Retrieves a direct download link and starts the download

## Installation

You need a userscript manager extension.

1. **Install Tampermonkey** for your browser

2. **Add the script:**
   * Click the Tampermonkey icon → “Create a new script”
   * Copy the code from the `script.js` file in this repository/
   * Paste it into the editor and press `Ctrl + S` to save

## How to use
1. Open the lobby of any finished FACEIT match (CS2)
2. Click watch demo button
3. Place the unzipped file in the path `game\csgo`
