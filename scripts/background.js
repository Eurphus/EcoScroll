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


//////////////////////////////
// Listeners                //
//////////////////////////////


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('https://www.youtube.com/shorts/')) {
        if (initial_run === true){
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
// Data Functions           //
//////////////////////////////

