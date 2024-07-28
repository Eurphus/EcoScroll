
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Data Constants                                                                                                     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const YOUTUBE = 1
export const INSTAGRAM = 2
export const TIKTOK = 3
export const GLOBAL = 4

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// General Data Functions                                                                                             //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Returns the JSON site key-value.
 *
 * @param site
 * @returns {Promise<*>}
 */
async function getSiteJSON(site) {
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
        case GLOBAL:
            result = (await chrome.storage.local.get(["global"])).global
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

/**
 * Gets current date plus addition seconds in number format
 *
 * @param addition
 * @returns {number}
 */
export function getDate(addition) {
    let date = Number(new Date());
    date += addition * 1000 // addition represents seconds, converts to ms
    return date;
}

/**
 * Returns the number of seconds left of a duration
 *
 * @param futureDate
 * @returns {number}
 */
export function getDuration(futureDate) {
    let date = Number(new Date());

    let duration= Math.abs(futureDate - date)
    duration /= 1000;
    duration = Math.round(duration);
    return duration
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
        case GLOBAL:
            await chrome.storage.local.set({ global: json })
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
    await applySetting(site, result);
}

/**
 * Updates the shortsCount.
 *
 * @returns {Promise<void>}
 */
export async function updateShortsCount(site) {
    let count = await getKey(site, 'shortsWatched');
    count += 1;
    await setKey(site, 'shortsWatched', count);
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
    await setKey(site, 'count', count);
    await updateShortsCount(site);
    await updateShortsCount(GLOBAL);
}

