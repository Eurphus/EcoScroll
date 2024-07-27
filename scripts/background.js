chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo === 'complete' && tab.url){
        if (tab.url.includes('https://www.youtube.com/shorts/')){
            console.log('Contains')
        }
    }
})