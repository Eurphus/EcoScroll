import {INSTAGRAM, YOUTUBE, TIKTOK, GLOBAL, getKey, setKey} from "./data.js";

// gets each scroll count for each platform and outputs it to the frontend

window.onload = setInterval(async function () {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // watchedShorts Elements                                                                                         //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let instagramCount = await getKey(INSTAGRAM, 'shortsWatched');
    document.getElementById("instagram-result").textContent = instagramCount + " Videos Watched";

    let youtubeCount = await getKey(YOUTUBE, 'shortsWatched');
    document.getElementById("youtube-result").textContent = youtubeCount + " Videos Watched";

    let tiktokCount = await getKey(TIKTOK, 'shortsWatched');
    document.getElementById("tiktok-result").textContent = tiktokCount + " Videos Watched";

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Remaining Limits                                                                                               //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let minutesEnabled = await getKey(YOUTUBE, 'timeSelected');
    if (minutesEnabled) {
        let timeUsed = await getKey(YOUTUBE, 'timeUsed');
        let timeLimit = await getKey(YOUTUBE, 'timeLimit');
        let remaining = timeLimit - timeUsed;
        document.getElementById("minutes-left").textContent = `${remaining} Seconds Left`
    } else {
        document.getElementById("minutes-left").textContent = "Disabled";
    }
    let scrollEnabled = await getKey(YOUTUBE, 'countSelected');
    if (scrollEnabled) {
        let countUsed = await getKey(YOUTUBE, 'count');
        let countLimit = await getKey(YOUTUBE, 'countLimit');
        let remaining = countLimit - countUsed;

        document.getElementById("scrolls-left").textContent = `${remaining} Scrolls Left`
    } else {
        document.getElementById("scrolls-left").textContent = "Disabled";
    }
}, 200);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Configure Settings                                                                                             //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function setAllValues() {
    if (document.getElementById("control-by-time").checked === true) {
        let timeLimit = document.getElementById("time-limit").value;
        await setKey(YOUTUBE, "time-limit", timeLimit);
    }

    if (document.getElementById("control-by-quantity").checked === true) {
        let scrollLimit = document.getElementById("quantity-limit").value;
        await setKey(YOUTUBE, "quantity-limit", scrollLimit);
    }

    let breakTime = document.getElementById("pop-up-duration");
    await setKey(YOUTUBE, "break-time", breakTime);
}
