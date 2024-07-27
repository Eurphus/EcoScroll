let count = 0;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('https://www.youtube.com/shorts/')) {
        count++;
        console.log('Contains', count);

        //Double actual limit to count
        if (count === 4) {
            count = 0;  
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['scripts/content.js']
            }).then(() => {
                console.log('Content script injected.');
            }).catch((error) => {
                console.error('Error injecting content script:', error);
            });
        }
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
