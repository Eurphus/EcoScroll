import {
    decrementCountdown,
    getKey, incrementCount, incrementDownTime, incrementTimeElapsed,
    INSTAGRAM,
    setKey,
    TIKTOK,
    YOUTUBE,
} from "./data.js";

import { default_json } from "../config.js";
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
            const countdown = await getKey(site, 'countdown');
            sendResponse({ countdown: countdown });
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
        console.log('test');

        if (await getKey(site, 'initialRun') === true) {
            await setKey(site, 'previousUrl', tab.url);
            await setKey(site, 'initialRun', false)
        }

        if (await getKey(site, 'previousUrl') !== tab.url) {
            await incrementCount(site)
            console.log('Contains', await getKey(site, 'count'));
        }

        if (!(await getKey(site, 'timerStarted'))) {
            setKey(site, 'timerStarted', true)
            intervalId = setInterval(async () => {
                if (await getKey(site, 'injected') === false && await getKey(site, 'countInjected') === false) {
                    await incrementTimeElapsed(site)
                    const timeElapsed = await getKey(site, 'timeElapsed');
                    console.log(`Time elapsed: ${timeElapsed} seconds`);

                    // inject after 20 secs
                    if (timeSelected === true){
                        if (timeElapsed >= await getKey(site, 'timeLimit')) {
                            chrome.scripting.executeScript({
                                target: {tabId: tabId},
                                files: ['scripts/pause.js']
                            }).then(async () => {
                                console.log('Content script injected after time limit reached.');
                                await setKey(site, 'injected', true);
                                await setKey(site, 'countInjected', true);
                                await setKey(site, 'countdown', 15);
                                await setKey(site, 'timeElapsed', 0);
                            }).catch(async (error) => {
                                console.error('Error injecting content script:', error);
                                clearInterval(intervalId);
                                setKey(site, 'timerStarted', false);
    
                            });
                        }
                    }
                    
                } else {
                    await incrementDownTime(site);
                    await decrementCountdown(site);
                    console.log(`Time down: ${await getKey(site, 'downTime')} seconds`);
                    console.log(`Countdown: ${await getKey(site, 'countdown')} seconds`);

                    // Unpause after countdown reaches zero
                    if (await getKey(site, 'countdown') <= 0) {
                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files: ['scripts/unpause.js']
                        }).then(async () => {
                            console.log('Content script injected to unpause.');
                            await setKey(site, 'countInjected', false); // Allow future count-based injections
                            await setKey(site, 'injected', false); // Allow future time-based injections
                            await setKey(site, 'currentlyPaused', true);
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

        //    count should be double of the actual limit
        if (countSelected === true){
            if (await getKey(site, 'count') === await getKey(site, 'countLimit')) {
                await setKey(site, 'count', 0)
                chrome.scripting.executeScript({
                    target: {tabId: tabId},
                    files: ['scripts/pause.js']
                }).then(async () => {
                    console.log('Content script injected after count limit reached');
                    await setKey(site, 'injected', true);
                    await setKey(site, 'currentlyPaused', true);
                    await setKey(site, 'countdown', 15);
                }).catch(async (error) => {
                    console.error('Error injecting content script:', error);
                    clearInterval(intervalId);
                    await setKey(site, 'timeStarted', false);
                    await setKey(site, 'timeElapsed', 0);
                });
            }
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

/**
 * Detects if it is a eligible website, assigns id.
 *
 * @param url
 * @returns {number|null}
 */
function determineSite(url) {
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
function setConfig() {
    chrome.storage.local.set({ youtube: default_json });
    chrome.storage.local.set({ instagram: default_json });
    chrome.storage.local.set({ tiktok: default_json });
}