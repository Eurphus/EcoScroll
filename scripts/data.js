
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
    setKey(site, 'count', count);
}

export async function incrementTimeElapsed(site) {
    let time = await getKey(site, 'timeElapsed');
    time += 1;
    setKey(site, 'timeElapsed', time);
}

export async function incrementDownTime(site) {
    let time = await getKey(site, 'downTime');
    time += 1;
    setKey(site, 'downTime', time);
}

export async function decrementCountdown(site) {
    let time = await getKey(site, 'countdown');
    time -= 1;
    setKey(site, 'countdown', time);
}
