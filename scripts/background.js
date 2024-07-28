import {
    decrementCountdown,
    getCount, getCountdown,
    getCountInjected, getCountLimit,
    getDownTime, getInjected, getPreviousURL,
    getTimeElapsed, getTimeLimit, getTimerStarted, incrementCount, incrementDownTime, incrementTimeElapsed,
    INSTAGRAM, setCount, setCountdown,
    setCountInjected, setCurrentlyPaused,
    setDownTime, setInitialRun, setInjected, setPreviousURL, setTimeElapsed,
    setTimerStarted,
    TIKTOK,
    YOUTUBE
} from "./data.js";

// Cache Stored
/*let countdown = 60;
let timeElapsed = 0; //
let down_time = 0; //
let count = 0
let time_limit = 20;
let count_limit = 5;
let prev_url = '';
let timerStarted = false;*/

// Non-Cache
let intervalId;
let injected = false;
let initial_run = true;
let count_injected = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getCountdown') {
        (async () => {
            const site = determineSite(sender.tab.url);
            const countdown = await getCountdown(site);
            sendResponse({ countdown: countdown });
        })();
        return true; // Indicates that the response is sent asynchronously
    }
});

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

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        let site = determineSite(tab.url);
        if (site === null) {
            return;
        }
        console.log('test');

        if (await setInitialRun(site, true)) {
            await setPreviousURL(site, tab.url);
            await setInitialRun(site, false);
        }

        if (await getPreviousURL(site) !== tab.url) {
            await incrementCount(site);
            console.log('Contains', await getCount(site));
        }

        if (!(await getTimerStarted(site))) {
            setTimerStarted(site, true);
            intervalId = setInterval(async () => {
                if (await getInjected(site) === false && await getCountInjected(site) === false) {
                    await incrementTimeElapsed(site);
                    const timeElapsed = await getTimeElapsed(site);
                    console.log(`Time elapsed: ${timeElapsed} seconds`);

                    // inject after 20 secs
                    if (timeElapsed >= await getTimeLimit(site)) {
                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files: ['scripts/pause.js']
                        }).then(async () => {
                            await console.log('Content script injected after time limit reached.');
                            await setInjected(site, true);
                            await setCountInjected(site, true);
                            await setDownTime(site, 0);
                            await setCountdown(site, 10);
                            await setTimeElapsed(site, 0);
                        }).catch(async (error) => {
                            console.error('Error injecting content script:', error);
                            await clearInterval(intervalId);
                            await setTimerStarted(site, false);
                            await setTimeElapsed(site, 0);
                        });
                    }
                } else {
                    await incrementDownTime(site);
                    await decrementCountdown(site);
                    console.log(`Time down: ${await getDownTime(site)} seconds`);
                    console.log(`Countdown: ${await getCountdown(site)} seconds`);

                    // Unpause after countdown reaches zero
                    if (await getCountdown(site) <= 0) {
                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files: ['scripts/unpause.js']
                        }).then(async () => {
                            console.log('Content script injected to unpause.');
                            await setCountInjected(site, false); // Allow future count-based injections
                            await setInjected(site, false); // Allow future time-based injections
                            await setDownTime(site, 0); // Reset downtime
                            await setCurrentlyPaused(site, true);
                            await setTimeElapsed(site, 0);
                        }).catch(async (error) => {
                            console.error('Error injecting unpause content script:', error);
                            await clearInterval(intervalId);
                            await setTimerStarted(site, false);
                            await setTimeElapsed(site, 0);
                        });
                    }
                }
            }, 1000); // 1 second interval
        }

        // Count should be double of the actual limit
        if (await getCount(site) === await getCountLimit(site)) {
            await setCount(site, 0);
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['scripts/pause.js']
            }).then(async () => {
                await console.log('Content script injected after count limit reached');
                await setInjected(site, false); // Allow future time-based injections
                await setDownTime(site, 0); // Reset downtime
                await setCurrentlyPaused(site, true);
                await setTimeElapsed(site, 0);
            }).catch(async (error) => {
                console.error('Error injecting content script:', error);
                await clearInterval(intervalId);
                await setTimerStarted(site, false);
                await setTimeElapsed(site, 0);
            });
        }

        await setPreviousURL(site, tab.url);
    }
});

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        chrome.tabs.create({
            active: true,
            url: "../pages/welcome.html"
        });
    } else if (details.reason === "update") {
        let json = {
            count: 0,
            previousUrl: '',
            timerStarted: false,
            intervalId: -1,
            timeElapsed: 0,
            downTime: 0,
            timeLimit: 15,
            countLimit: 5,
            injected: false,
            initialRun: true,
            countdown: 15,
            countInjected: false,
            currentlyPaused: false
        };

        chrome.storage.local.set({ youtube: json });
        chrome.storage.local.set({ instagram: json });
        chrome.storage.local.set({ tiktok: json });
    }
});
