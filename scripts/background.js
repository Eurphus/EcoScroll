let count = 0;
let prev_url = '';
let timerStarted = false;
let intervalId;
let timeElapsed = 0;
let down_time = 0;
let time_limit = 10;
let count_limit = 3
let injected = false;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('https://www.youtube.com/shorts/')) {
        if (prev_url !== tab.url) {
            count++;
        }
        
        console.log('Contains', count);

    
        if (!timerStarted) {
            timerStarted = true;
            
        
            intervalId = setInterval(() => {
                if (injected === false){
                    timeElapsed++;
                    console.log(`Time elapsed: ${timeElapsed} seconds`);

                    // inject after 20 secs
                    if (timeElapsed >= time_limit) {
                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files: ['scripts/content.js']
                        }).then(() => {
                            console.log('Content script injected after 20 seconds.');
                            injected = true
                            
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
                console.log('Content script injected after count reached 6.');
                clearInterval(intervalId); 
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
        chrome.tabs.create({
            active:true
        })
    }
});
