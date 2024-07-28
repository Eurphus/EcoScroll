import { INSTAGRAM, YOUTUBE, TIKTOK, getKey } from "./data.js";

// gets each scroll count for each platform and outputs it to the frontend

window.onload = setInterval(async function () {

    // shortWatched elements
    let instagramCount = await getKey(INSTAGRAM, 'shortsWatched');
    document.getElementById("instagram-result").textContent = instagramCount + " Videos Watched";

    let youtubeCount = await getKey(YOUTUBE, 'shortsWatched');
    document.getElementById("youtube-result").textContent = youtubeCount + " Videos Watched";

    let tiktokCount = await getKey(TIKTOK, 'shortsWatched');
    document.getElementById("tiktok-result").textContent = tiktokCount + " Videos Watched";

    // Bottom left, minutes/scrolls left
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


    // var currentScrolls = await getKey(GLOBAL, 'count');
    // document.getElementById("scrolls-left").textContent = 
}, 200);
