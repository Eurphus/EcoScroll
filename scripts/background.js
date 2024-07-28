import {
    getCount,
    getCountInjected, getCountLimit,
    getDownTime, getInjected, getPreviousURL,
    getTimeElapsed, getTimeLimit, getTimerStarted, incrementCount, incrementDownTime, incrementTimeElapsed,
    INSTAGRAM, setCount,
    setCountInjected,
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
        } else if (tab.url.includes('instagram.com/shorts')) {
            site = INSTAGRAM;
        } else {
            return;
        }
        console.log('test');

        if (await setInitialRun(site, true)) {
            await setPreviousURL(site, tab.url);
            await setInitialRun(site, false)
        }

        if (await getPreviousURL(site) !== tab.url) {
            await incrementCount(site)
            console.log('Contains', await getCount(site));
        }

        if (!(await getTimerStarted(site))) {
            setTimerStarted(site, true)
            intervalId = setInterval(async () => {
                if (await getInjected(site) === false && await getCountInjected(site) === false) {
                    await incrementTimeElapsed(site)
                    const timeElapsed = await getTimeElapsed(site)
                    console.log(`Time elapsed: ${timeElapsed} seconds`);

                    // inject after 20 secs
                    if (timeElapsed >= await getTimeLimit(site)) {
                        chrome.scripting.executeScript({
                            target: {tabId: tabId},
                            files: ['scripts/content.js']
                        }).then(() => {
                            console.log('Content script injected after time limit reached.');
                            setInjected(site, true)
                            setDownTime(site, 0);

                        }).catch((error) => {
                            console.error('Error injecting content script:', error);
                            clearInterval(intervalId);
                            setTimerStarted(false);
                            setTimeElapsed(site, 0);
                        });
                    }
                } else {
                    await incrementDownTime(site);
                    console.log(`Time down: ${await getDownTime(site)} seconds`);
                }

            }, 1000); //1 second interval
        }


        //    count should be double of the actual limit
        if (await getCount(site) === await getCountLimit(site)) {
            await setCount(site, 0)
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                files: ['scripts/content.js']
            }).then(() => {
                console.log('Content script injected after count limit reached');
                setCountInjected(site, true);
                setDownTime(site, 0);
            }).catch((error) => {
                console.error('Error injecting content script:', error);
                clearInterval(intervalId);
                setTimerStarted(site, false);
                setTimeElapsed(site, 0);
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
        /* Disable until testing is done
        chrome.tabs.create({
            active:true
        })
        */
        let json = {
            count: 0,
            previousUrl: '',
            timerStarted: false,
            intervalId: -1,
            timeElapsed: 0,
            downTime: 0,
            timeLimit: 0,
            countLimit: 0,
            injected: true,
            initialRun: true,
            countdown: 60,
            countInjected: false
        }

        chrome.storage.local.set({youtube: json});
        chrome.storage.local.set({instagram: json});
        chrome.storage.local.set({tiktok: json});
    }
});