let count = 0;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('https://www.youtube.com/shorts/')) {
        count++;
        console.log(count);

        if (count === 10){
            count = 0;

            chrome.scripting.executeScript({
                target:{tabId: tabId},
                files:['content.js']
            })

        }
    }
});
