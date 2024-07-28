////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Configure Settings                                                                                             //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import {YOUTUBE, INSTAGRAM, TIKTOK, setKey} from "./data.js";

async function setAllValues() {

    await setKey(YOUTUBE, "timeSelected", document.getElementById("control-by-time").checked);
    let timeLimit = Number(document.getElementById("time-limit").value);
    await setKey(YOUTUBE, "timeLimit", timeLimit);

    await setKey(YOUTUBE, "countSelected", document.getElementById("control-by-quantity").checked);
    let countLimit = Number(document.getElementById("quantity-limit").value);
    await setKey(YOUTUBE, "countLimit", countLimit);


    let breakTime = Number(document.getElementById("pop-up-duration").value);
    await setKey(YOUTUBE, "countdownMax", breakTime);
}

document.getElementById("submit-button").addEventListener('click', setAllValues);
