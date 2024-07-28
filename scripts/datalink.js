import { INSTAGRAM, YOUTUBE, TIKTOK, getKey } from "./data.js";

// gets each scroll count for each platform and outputs it to the frontend

window.onload = setInterval(async function () {
    let instagramCount = await getKey(INSTAGRAM, 'shortsWatched');
    document.getElementById("instagram-result").textContent = instagramCount + " Videos Watched";

    let youtubeCount = await getKey(YOUTUBE, 'shortsWatched');
    document.getElementById("youtube-result").textContent = youtubeCount + " Videos Watched";

    let tiktokCount = await getKey(TIKTOK, 'shortsWatched');
    document.getElementById("tiktok-result").textContent = tiktokCount + " Videos Watched";

    var currentScrolls = await getKey(GLOBAL, 'count');
    var maxScrolls = await getKey(GLOBAL, "quantity-limit");
    document.getElementById("scrolls-left").textContent = toString(maxScrolls - currentScrolls) + " Scrolls Left";

    // var currentTime = await getKey(GLOBAL, '')
}, 200);


// functions for setting values

async function setAllValues() {
    if (document.getElementById("control-by-time").checked == true) {
        var timeLimit = document.getElementById("time-limit").value;
        await mod.setKey(mod.GLOBAL, "time-limit", timeLimit);
    }

    if (document.getElementById("control-by-quantity").checked == true) {
        var scrollLimit = document.getElementById("quantity-limit").value;
        await mod.setKey(mod.GLOBAL, "quantity-limit", scrollLimit);
    }

    var breakTime = document.getElementById("pop-up-duration");
    await mod.setKey(mod.GLOBAL, "break-time", breakTime);
}
