import {
    YOUTUBE,
    INSTAGRAM,
    TIKTOK,
    getKey,
    setKey,
    incrementCount,
    getDate, getDuration,
} from "./data.js";

import {default_global_json, default_json} from "../config.js";
// Non-Cache
let intervalId; // Temp variable

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Listeners                                                                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * Listen to custom message sent at runtime.
 * Allows tracking of countdown tabs
 *
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getCountdown') {
        (async () => {
            const site = determineSite(sender.tab.url);
            let date = await getKey(site, 'countdown')
            let countdown = getDuration(date);

            // Corrects errors with poor predication and overflow due to late updating
            if (countdown < 0 || countdown > await getKey(site, 'countdownMax')) {
                countdown = 0;
            }
            sendResponse({ countdown: countdown, date: date });
        })();
        return true; // Indicates that the response is sent asynchronously
    }
});

/**
 * Main tab tracker.
 * Detects updates in tabs, determines if it is a eligible site and actions appropriately
 *
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        let site = determineSite(tab.url);
        if (site === null) {
            return;
        }

        // If the last URL is different, increment the count
        // Requirement to avoid
        if (await getKey(site, 'previousUrl') !== tab.url
            && !((tab.url.includes('tiktok.com/@') && (tab.url.includes('/video/'))))) {
            await incrementCount(site)
            await setKey(site, 'previousUrl', tab.url);
        }

        if (await getKey(site, 'countSelected') === true
                && await getKey(site, 'count') === await getKey(site, 'countLimit')) {
            await setKey(site, 'count', 0)
            await pause(site, tabId);
        } else if (!(await getKey(site, 'timerStarted'))) {
            await setKey(site, 'timerStarted', true)
            intervalId = setInterval(async () => {
                if (await getKey(site, 'injected') === false && await getKey(site, 'countInjected') === false) {
                    let timeElapsed = await getKey(site, 'timeElapsed');
                    if (timeElapsed === 0) {
                        console.log("Elapse Set");
                        await setKey(site, 'timeElapsed', Number(new Date()));
                        timeElapsed = await getKey(site, 'timeElapsed');
                    }
                    timeElapsed = getDuration(timeElapsed);
                    console.log(`Time elapsed: ${timeElapsed} seconds`);
                    await setKey(site, 'timeUsed', timeElapsed);

                    // inject after 20 secs
                    if (await getKey(site, 'timeSelected') === true
                        && timeElapsed >= await getKey(site, 'timeLimit')) {
                        await pause(site, tabId);
                    }
                } else {
                    //console.log(`Time down: ${await getKey(site, 'downTime')} seconds`);
                    console.log(`Countdown: ${getDuration(await getKey(site, 'countdown'))} seconds`);

                    // Unpause after countdown futureDate <= current date
                    if (await getKey(site, 'countdown') <= Number(new Date())) {
                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files: ['scripts/unpause.js']
                        }).then(async () => {
                            console.log('Content script injected to unpause.');
                            await setKey(site, 'countInjected', false); // Allow future count-based injections
                            await setKey(site, 'injected', false); // Allow future time-based injections
                            //await setKey(site, 'downTime', 0); // Reset downtime
                            await setKey(site, 'timeElapsed', 0);
                        }).catch(async (error) => {
                            console.error('Error injecting unpause content script:', error);
                            clearInterval(intervalId);
                            await setKey(site, 'timeStarted', false);
                            await setKey(site, 'timeElapsed', 0);
                        });
                    }
                }
            }, 1000); // 1 second interval
        }

        await setKey(site, 'previousUrl', tab.url);
    }
});

/**
 * Runs on installation or update of the extension
 * Sets up initial permissions & welcome, along with updates
 *
 */
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        chrome.tabs.create({
            active: true,
            url: "../pages/welcome.html"
        });
        setConfig();
    } else if (details.reason === "update") {
        setConfig();
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Helper Functions                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function pause(site, tabId) {
    await setKey(site, 'countdown', getDate(await getKey(site, 'countdownMax'))); // Current date plus the max seconds
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['scripts/pause.js']
    }).then(async () => {
        console.log('Content script injected after time limit reached.');
        await setKey(site, 'injected', true);
        await setKey(site, 'countInjected', true);
        await setKey(site, 'timeElapsed', 0);
    }).catch(async (error) => {
        console.error('Error injecting content script:', error);
        clearInterval(intervalId);
        await setKey(site, 'timerStarted', false);
        await setKey(site, 'timeElapsed', 0);
    });
}
/**
 * Detects if it is a eligible website, assigns id.
 *
 * @param url
 * @returns {number|null}
 */
export function determineSite(url) {
    if (url.includes('tiktok.com/foryou') || (url.includes('tiktok.com/@') && url.includes('/video/'))) {
        return TIKTOK;
    } else if (url.includes('youtube.com/shorts')) {
        return YOUTUBE;
    } else if (url.includes('instagram.com/reels')) {
        return INSTAGRAM;
    } else {
        return null;
    }
}

/**
 * Sets the default json object for the sites.
 *
 * @returns {void}
 */
export function setConfig() {
    chrome.storage.local.set({ youtube: default_json });
    chrome.storage.local.set({ instagram: default_json });
    chrome.storage.local.set({ tiktok: default_json });
    chrome.storage.local.set({ global: default_global_json });
}