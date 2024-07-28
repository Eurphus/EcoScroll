console.log('pause.js script loaded and running.');

window.pausedVideos = new WeakSet()

// Function to enforce pause and lock on a video element
function enforcePause(video) {
    if (video && !window.pausedVideos.has(video)) {
        video.pause();

        // Store the original play method
        if (!video.originalPlay) {
            video.originalPlay = video.play;
        }

        // Disable the play method
        video.play = function() {
            console.log("Play function disabled.");
        };

        // Hide controls to prevent user interaction
        video.controls = false;

        console.log('Video paused and lock enforced.');

        // Mark this video as paused
        window.pausedVideos.add(video);

        // Show a popup notification
        showPopup(video);
    } /*else if (window.pausedVideos.has(video)) {
        console.log('Video alr);
    } */ else {/*
        console.error('No video element found.');
        */
    }
}

// Function to show a popup notification
function showPopup() {
    let popup = document.createElement('div');
    popup.id = 'videoPausePopup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid black';
    popup.style.zIndex = '1000';
    popup.style.width = '1000px';  // Adjust the width as needed
    popup.style.height = '600px';
    popup.style.textAlign = 'center';
    popup.style.backgroundImage = 'url("https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXNuanJ1c2R5cWttdTlubW5pMGRiZmhlaTl3dTIxN2pqa215bzVwaiZlcD12MV9pbnRlcm5fZ2lmX2J5X2lkJmN0PWc/xUA7b9HAKGRDT3Rfsk/giphy.gif")';
    popup.style.backgroundSize = 'cover';
    popup.style.backgroundPosition = 'center';

    let message = document.createElement('p');
    message.id = 'countdownMessage';
    message.style.color = 'white';
    message.style.fontSize = '24px';
    message.style.textAlign = 'center';
    message.style.marginTop = '240px'; // Adjust to position the text vertically centered

    popup.appendChild(message);
    document.body.appendChild(popup);

    // Fetch the countdown value from the background script
    chrome.runtime.sendMessage({ action: 'getCountdown' }, (response) => {
        let countdown = response.countdown;
        message.innerText = `Take a deep breath and relax. Resuming in ${countdown} seconds.`;

        // Update the countdown every second
        let countdownInterval = setInterval( () => {
            chrome.runtime.sendMessage({ action: 'getCountdown' }, (response) => {
                let countdown = response.countdown;
                let date = response.date;
                if (date >= Number(new Date())) {
                    message.innerText = `Take a deep breath and relax. Resuming in ${countdown} seconds.`;
                } else {
                    pauseObserver.disconnect();
                    clearInterval(countdownInterval);
                }
            })
        }, 1000);
    });
}

// Disconnect the unpause observer if it exists
if (window.unpauseObserver) {
    window.unpauseObserver.disconnect();
    console.log('UnPause observer stopped.');
}

// Function to enforce pause and lock on all video elements
function lockAllVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        enforcePause(video);
    });
}

// Initial enforcement on existing video elements
lockAllVideos();

// Monitor for new video elements (e.g., if the user navigates to another video)
pauseObserver = new MutationObserver(() => {
    lockAllVideos();
});

pauseObserver.observe(document.body, { childList: true, subtree: true });

window.pauseObserver = pauseObserver; // Make sure it is accessible globally