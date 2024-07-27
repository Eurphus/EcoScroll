let count = 0;
let prev_url = ''
let timerStarted = false;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('https://www.youtube.com/shorts/')) {
        if (prev_url !== tab.url) {
            count++;
        }
        
        console.log('Contains', count);

        if (!timerStarted) {
            timerStarted = true;
            setTimeout(() => {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['scripts/content.js']
                }).then(() => {
                    console.log('Content script injected after 20 seconds.');
                }).catch((error) => {
                    console.error('Error injecting content script:', error);
                });
            }, 20000); //20 second Timer
        }

        // Count is double the limit since each short iterates twice.
        if (count === 6) {
            count = 0;
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['scripts/content.js']
            }).then(() => {
                console.log('Content script injected after count reached 6.');
            }).catch((error) => {
                console.error('Error injecting content script:', error);
            });
        }
        prev_url = tab.url
    }
});

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        chrome.tabs.create({
            active: true,
            url: "../pages/welcome.html"
        });
    } else if (details.reason === "update") {
        chrome.tabs.create({
            active:true
        })
    }
});
