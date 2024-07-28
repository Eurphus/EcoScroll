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

    var message = document.createElement('p');
    message.innerText = 'Video paused. Click OK to continue.';
    popup.appendChild(message);

    var button = document.createElement('button');
    button.innerText = 'OK';
    button.onclick = function() {
        console.log('Please run the unpause script to resume the video.');
    };
    popup.appendChild(button);

    document.body.appendChild(popup);
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
