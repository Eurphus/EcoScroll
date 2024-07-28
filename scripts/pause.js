console.log('pause.js script loaded and running.');

var pauseObserver; // Ensure pauseObserver is globally scoped
var pausedVideos = new WeakSet(); // Track paused videos

// Function to enforce pause and lock on a video element
function enforcePause(video) {
    if (video && !pausedVideos.has(video)) {
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
        pausedVideos.add(video);

        // Show a popup notification
        showPopup(video);
    } else if (pausedVideos.has(video)) {
        console.log('Video already paused, skipping:', video);
    } else {
        console.error('No video element found.');
    }
}

// Function to show a popup notification
function showPopup(video) {
    var popup = document.createElement('div');
    popup.id = 'videoPausePopup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid black';
    popup.style.zIndex = '1000';
    popup.style.width = '700px';  // Adjust the width as needed
    popup.style.height = '500px';

    var message = document.createElement('p');
    message.id = 'countdownMessage';
    popup.appendChild(message);

    document.body.appendChild(popup);

    // Fetch the countdown value from the background script
    chrome.runtime.sendMessage({ action: 'getCountdown' }, function(response) {
        var countdown = response.countdown || 10; // Default to 10 seconds if not set

        message.innerText = `Video paused. Resuming in ${countdown} seconds.`;

        // Update the countdown every second
        var countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                message.innerText = `Video paused. Resuming in ${countdown} seconds.`;
            } else {
                clearInterval(countdownInterval);
                // Unpause the video
                unpauseVideo(video, popup);
            }
        }, 1000);
    });
}

// Function to unpause the video and remove the popup
function unpauseVideo(video, popup) {
    if (video && pausedVideos.has(video)) {
        video.play = video.originalPlay;
        video.play();

        // Restore controls
        video.controls = true;

        console.log('Video unpaused and lock removed.');

        // Remove the popup
        if (popup) {
            document.body.removeChild(popup);
        }

        // Remove the video from the paused set
        pausedVideos.delete(video);
    } else {
        console.error('No video element found to unpause.');
    }
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
