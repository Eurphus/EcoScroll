import { INSTAGRAM, YOUTUBE, TIKTOK, getKey } from "./data.js";

// gets each scroll count for each platform and outputs it to the frontend

window.onload = setInterval(async function () {
    let instagramCount = await getKey(INSTAGRAM, 'shortsWatched');
    document.getElementById("instagram-result").textContent = instagramCount + " Videos Watched";

    let youtubeCount = await getKey(YOUTUBE, 'shortsWatched');
    document.getElementById("youtube-result").textContent = youtubeCount + " Videos Watched";

    let tiktokCount = await getKey(TIKTOK, 'shortsWatched');
    document.getElementById("tiktok-result").textContent = tiktokCount + " Videos Watched";

    // var currentScrolls = await getKey(GLOBAL, 'count');
    // document.getElementById("scrolls-left").textContent = 
}, 200);
