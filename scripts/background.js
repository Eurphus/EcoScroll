import {
    decrementCountdown,
    getKey, incrementCount, incrementDownTime, incrementTimeElapsed,
    INSTAGRAM,
    setKey,
    TIKTOK,
    YOUTUBE
} from "./data.js";

// Non-Cache
let intervalId;


//////////////////////////////
// Listeners                //
//////////////////////////////

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        let site = 0
        if (tab.url.includes('tiktok.com/foryou') || (tab.url.includes('tiktok.com/@') && tab.url.includes('/video/'))) {
            site = TIKTOK;
        } else if (tab.url.includes('youtube.com/shorts')) {
            site = YOUTUBE;
        } else if (tab.url.includes('instagram.com/reels')) {
            site = INSTAGRAM;
        } else {
            return;
        }
        console.log(await getKey(site, 'count'));

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
                    if (timeElapsed >= await getKey(site, 'timeLimit')) {
                        chrome.scripting.executeScript({
                            target: {tabId: tabId},
                            files: ['scripts/content.js']
                        }).then(() => {
                            console.log('Content script injected after time limit reached.');
                            setKey(site, 'injected', true)
                            setKey(site, 'downTime', 0);
                            setKey(site, 'countdown', 10);
                        }).catch((error) => {
                            console.error('Error injecting content script:', error);
                            clearInterval(intervalId);
                            setKey(site, 'timerStarted', false);
                            setKey(site, 'timeElapsed', 0);
                        });
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
                        }).then(() => {
                            console.log('Content script injected to unpause.');
                            setKey(site, 'countInjected', false); // Allow future count-based injections
                            setKey(site, 'injected', false); // Allow future time-based injections
                            setKey(site, 'downTime', 0); // Reset downtime
                            setKey(site, 'currentlyPaused', true);
                            setKey(site, 'timeElapsed', 0);
                        }).catch((error) => {
                            console.error('Error injecting unpause content script:', error);
                            clearInterval(intervalId);
                            setKey(site, 'timeStarted', false);
                            setKey(site, 'timeElapsed', 0);
                        });
                    }
                }
            }, 1000); // 1 second interval
        }


        //    count should be double of the actual limit
        if (await getKey(site, 'count') === await getKey(site, 'countLimit')) {
            await setKey(site, 'count', 0)
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                files: ['scripts/content.js']
            }).then(() => {
                console.log('Content script injected after count limit reached');
                setKey(site, 'countInjected', true);
                setKey(site, 'downtime', 0);
            }).catch((error) => {
                console.error('Error injecting content script:', error);
                clearInterval(intervalId);
                setKey(site, 'timeStarted', false);
                setKey(site, 'timeElapsed', 0);
            });
        }

        await setKey(site, 'previousUrl', tab.url);
    }
});

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        chrome.tabs.create({
            active: true,
            url: "../pages/welcome.html"
        });
    } else if (details.reason === "update") {
        /* Disable until testing is done
        chrome.tabs.create({
            active:true
        })
        */
        let json = {
            count: 0,
            previousUrl: '',
            timerStarted: false,
            timeElapsed: 0,
            downTime: 0,
            timeLimit: 60,
            countLimit: 10,
            injected: true,
            initialRun: true,
            countdown: 60,
            countInjected: false,
            currentlyPaused: false
        }

        chrome.storage.local.set({youtube: json});
        chrome.storage.local.set({instagram: json});
        chrome.storage.local.set({tiktok: json});
    }
});