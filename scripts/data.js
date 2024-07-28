
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Data Constants                                                                                                     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const YOUTUBE = 1
export const INSTAGRAM = 2
export const TIKTOK = 3

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// General Data Functions                                                                                             //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Returns the JSON site key-value.
 *
 * @param site
 * @returns {Promise<*>}
 */
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

/**
 * Gets a specific key in the sites JSON
 *
 * @param site
 * @param key
 * @returns {Promise<*>}
 */
export async function getKey(site, key) {
    const result = await getSiteJSON(site);
    return result[key];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Data Modifiers                                                                                                     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Sets the site key-value pair with a provided JSON.
 *
 * @param site
 * @param json
 * @returns {Promise<void>}
 */
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

/**
 * Assigns value to provided key in the site JSON.
 *
 * This is achieved by getting the JSON, modifying by the provided key/input, then applying change.
 *
 * @param site
 * @param key
 * @param input
 * @returns {Promise<void>}
 */
export async function setKey(site, key, input) {
    const result = await getSiteJSON(site);
    result[key] = input;
    applySetting(site, result);
}

/**
 * Increments the count key. Useful for counting number of content accessed.
 *
 * @param site
 * @returns {Promise<void>}
 */
export async function incrementCount(site) {
    let count = await getKey(site, 'count');
    count += 1;
    setKey(site, 'count', count);
}

/**
 * Increments the timeElapsed key. Usedful for time tracking.
 *
 * @param site
 * @returns {Promise<void>}
 */
export async function incrementTimeElapsed(site) {
    let time = await getKey(site, 'timeElapsed');
    time += 1;
    setKey(site, 'timeElapsed', time);
}

/**
 * Increments the downtime key. Useful for time tracking.
 *
 * @param site
 * @returns {Promise<void>}
 */
export async function incrementDownTime(site) {
    let time = await getKey(site, 'downTime');
    time += 1;
    setKey(site, 'downTime', time);
}

/**
 * Decrements the countdown key.
 *
 * @param site
 * @returns {Promise<void>}
 */
export async function decrementCountdown(site) {
    let time = await getKey(site, 'countdown');
    time -= 1;
    setKey(site, 'countdown', time);
}
