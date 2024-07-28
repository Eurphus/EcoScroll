
//////////////////////////////
// Data Constants           //
//////////////////////////////
export const YOUTUBE = 1
export const INSTAGRAM = 2
export const TIKTOK = 3

//////////////////////////////
// General Data Functions   //
//////////////////////////////

export async function getSiteJSON(site) {
    let result;
    switch (site) {
        case YOUTUBE:
            result = (await chrome.storage.local.get(['youtube'])).youtube;
            break;
        case INSTAGRAM:
            result = (await chrome.storage.local.get(["instagram"])).instagram;
            break;
        case TIKTOK:
            result = (await chrome.storage.local.get(["tiktok"])).tiktok;
            break;
        default:
            throw new Error('Unknown site selected')
    }

    return result;
}

export async function getKey(site, key) {
    const result = await getSiteJSON(site);
    return result[key];
}

//////////////////////////////
// Apply Data Functions     //
//////////////////////////////

export async function applySetting(site, json) {
    switch (site) {
        case YOUTUBE:
            await chrome.storage.local.set({ youtube: json });
            break;
        case INSTAGRAM:
            await chrome.storage.local.set({ instagram: json });
            break;
        case TIKTOK:
            await chrome.storage.local.set({ tiktok: json })
            break;
    }
}

export async function setKey(site, key, input) {
    const result = await getSiteJSON(site);
    result[key] = input;
    applySetting(site, result);
}

export async function incrementCount(site) {
    let count = await getKey(site, 'count');
    count += 1;
    setCount(site, count);
}

export async function incrementTimeElapsed(site) {
    let time = await getKey(site, 'timeElapsed');
    time += 1;
    setTimeElapsed(site, time);
}

export async function incrementDownTime(site) {
    let time = await getKey(site, 'downTime');
    time += 1;
    setDownTime(site, time);
}

export async function decrementCountdown(site) {
    let time = await getKey(site, 'countdown');
    time -= 1;
    setCountdown(site, time);
}

export async function setCount(site, input) {
    const result = await getSiteJSON(site);
    result.count = input;
    applySetting(site, result);
}

export async function setPreviousURL(site, input) {
    const result = await getSiteJSON(site);
    result.previousUrl = input;
    applySetting(site, result);
}

export async function setTimerStarted(site, input) {
    const result = await getSiteJSON(site);
    result.timerStarted = input;
    applySetting(site, result);
}

export async function setTimeElapsed(site, input) {
    const result = await getSiteJSON(site);
    result.timeElapsed = input;
    applySetting(site, result);
}

export async function setDownTime(site, input) {
    const result = await getSiteJSON(site);
    result.downTime = input;
    applySetting(site, result);
}

export async function setTimeLimit(site, input) {
    const result = await getSiteJSON(site);
    result.timeLimit = input;
    applySetting(site, result);
}

export async function setCountLimit(site, input) {
    const result = await getSiteJSON(site);
    result.countLimit = input;
    applySetting(site, result);
}

export async function setInjected(site, input) {
    const result = await getSiteJSON(site);
    result.injected = input;
    applySetting(site, result);
}

export async function setInitialRun(site, input) {
    const result = await getSiteJSON(site);
    result.initialRun = input;
    applySetting(site, result);
}

export async function setCountdown(site, input) {
    const result = await getSiteJSON(site);
    result.countdown = input;
    applySetting(site, result);
}

export async function setCountInjected(site, input) {
    const result = await getSiteJSON(site);
    result.countInjected = input;
    applySetting(site, result);
}

export async function setCurrentlyPaused(site, input) {
    const result = await getSiteJSON(site);
    result.currentlyPaused = input;
    applySetting(site, result);
}
