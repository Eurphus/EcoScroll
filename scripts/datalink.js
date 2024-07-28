import * as mod from "./data.js";

// gets each scroll count for each platform and outputs it to the frontend

window.onload = setInterval(async function () {
    var instagramCount = await mod.getKey(mod.INSTAGRAM, 'count');
    document.getElementById("instagram-result").textContent = instagramCount + " Videos Watched";

    var youtubeCount = await mod.getKey(mod.YOUTUBE, 'count');
    document.getElementById("youtube-result").textContent = youtubeCount + " Videos Watched";

    var tiktokCount = await mod.getKey(mod.TIKTOK, 'count');
    document.getElementById("tiktok-result").textContent = tiktokCount + " Videos Watched";

    // var currentScrolls = await mod.getKey(mod.GLOBAL, 'count');
    // document.getElementById("scrolls-left").textContent = 
});
