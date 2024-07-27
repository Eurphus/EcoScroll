let count = 0;
let prev_url = '';
let timerStarted = false;
let intervalId;
let timeElapsed = 0;
let down_time = 0;
let time_limit = 20;
let count_limit = 5;
let injected = false;
let initial_run = true;
let countdown = 60;
let count_injected = false;

// Constants
const YOUTUBE = 1
const INSTAGRAM = 2
const TIKTOK = 3


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
        } else if(tab.url.includes('instagram.com/shorts')) {
            site = INSTAGRAM;
        } else {
            return;
        }
        let d = await getSiteJSON(site);
        console.log(d);
        let f = await getPreviousURL(site)
        console.log(f)

        if (initial_run === true) {
            prev_url = tab.url;
            initial_run = false;
        }
        if (prev_url !== tab.url) {
            count++;

            console.log('Contains', count);
        }

        if (!timerStarted) {
            timerStarted = true;


            intervalId = setInterval(() => {
                if (injected === false && count_injected === false){
                    timeElapsed++;
                    console.log(`Time elapsed: ${timeElapsed} seconds`);

                    // inject after 20 secs
                    if (timeElapsed >= time_limit) {
                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files: ['scripts/content.js']
                        }).then(() => {
                            console.log('Content script injected after time limit reached.');
                            injected = true
                            down_time = 0;

                        }).catch((error) => {
                            console.error('Error injecting content script:', error);
                            clearInterval(intervalId);
                            timerStarted = false;
                            timeElapsed = 0;
                        });
                    }
                } else {
                    down_time++;
                    console.log(`Time down: ${down_time} seconds`);

                }

            }, 1000); //1 second interval
        }

        //    count should be double of the actual limit
        if (count === count_limit) {
            count = 0;
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['scripts/content.js']
            }).then(() => {
                console.log('Content script injected after count limit reached');
                count_injected = true;
                down_time = 0;

            }).catch((error) => {
                console.error('Error injecting content script:', error);
                clearInterval(intervalId);
                timerStarted = false;
                timeElapsed = 0;
            });
        }

        prev_url = tab.url;
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

        chrome.storage.local.set({ youtube: json });
        chrome.storage.local.set({ instagram: json });
        chrome.storage.local.set({ tiktok: json });
    }
});

//////////////////////////////
// General Data Functions   //
//////////////////////////////

async function getSiteJSON(site) {
    let result;
    switch (site) {
        case YOUTUBE:
            result = await chrome.storage.local.get(['youtube']);
            break;
        case INSTAGRAM:
            result = await chrome.storage.local.get(["instagram"]);
            break;
        case TIKTOK:
            result = await chrome.storage.local.get(["tiktok"]);
            break;
        default:
            throw new Error('Unknown site selected')
    }

    return result;
}

////////////////////////////////
// Data Retrieval Functions   //
////////////////////////////////

async function getCount(site) {
    const result = await getSiteJSON(site)
    return result.youtube.previousUrl;
}

async function getPreviousURL(site) {
    const result = await getSiteJSON(site)
    return result.youtube.previousUrl;
}

async function getTimerStarted(site) {
    const result = await getSiteJSON(site)
    return result.youtube.timerStarted;
}

async function getIntervalId(site) {
    const result = await getSiteJSON(site)
    return result.youtube.intervalId;
}

async function getTimeElapsed(site) {
    const result = await getSiteJSON(site)
    return result.youtube.timeElapsed;
}

async function getDownTime(site) {
    const result = await getSiteJSON(site)
    return result.youtube.downTime;
}

async function getTimeLimit(site) {
    const result = await getSiteJSON(site)
    return result.youtube.timeLimit;
}

async function getCountLimit(site) {
    const result = await getSiteJSON(site)
    return result.youtube.countLimit;
}

async function getInjected(site) {
    const result = await getSiteJSON(site)
    return result.youtube.injected;
}

async function getInitialRun(site) {
    const result = await getSiteJSON(site)
    return result.youtube.initialRun;
}

async function getCountdown(site) {
    const result = await getSiteJSON(site)
    return result.youtube.countdown;
}

async function getCountInjected(site) {
    const result = await getSiteJSON(site)
    return result.youtube.countInjected;
}

//////////////////////////////
// Apply Data Functions     //
//////////////////////////////

function incrementCount(site) {
    switch (site) {
        case YOUTUBE:
            break;
        case INSTAGRAM:
            break;
        case TIKTOK:
            break;
    }
}