// ==UserScript==
// @name         Force 1080p for SoopLive Streams
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Force 1080p quality by modifying .m3u8 playlist responses
// @author       Your Name
// @match        *://www.sooplive.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Hook into XMLHttpRequest to intercept .m3u8 requests
    const originalOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        // Check if the request URL is for the HLS playlist
        if (url.includes("playlist.m3u8")) {
            console.log("Intercepted playlist.m3u8 request:", url);

            // Hook into the onreadystatechange callback
            this.addEventListener("readystatechange", function() {
                if (this.readyState === 4 && this.status === 200) {
                    console.log("Original .m3u8 playlist response received.");

                    // Log the original response
                    console.log("Original .m3u8 playlist content:", this.responseText);

                    // Modify the playlist to include only the 1080p variant
                    const modifiedResponse = this.responseText
                        .split("\n")
                        .filter(line => line.includes("1080") || line.startsWith("#"))
                        .join("\n");

                    // Log the modified response
                    console.log("Modified .m3u8 playlist content:", modifiedResponse);

                    // Override the responseText property to serve the modified playlist
                    Object.defineProperty(this, "responseText", { value: modifiedResponse });
                    console.log("Modified .m3u8 playlist to enforce 1080p.");
                }
            });
        }

        return originalOpen.apply(this, arguments);
    };
})();
