console.log('unpause.js script loaded and running.');

var unpauseObserver; // Ensure unpauseObserver is globally scoped

// Function to restore video functionality
function restoreVideo(video) {
    if (video) {
        // Restore the original play method if it was stored
        if (video.originalPlay) {
            video.play = video.originalPlay;
            delete video.originalPlay;
        }

        // Show the controls
        video.controls = true;

        console.log('Video unpaused and lock removed.');

        // Ensure the video resumes playing if it was paused
        if (video.paused) {
            video.play();
        }

        // Remove the popup notification
        var popup = document.getElementById('videoPausePopup');
        if (popup) {
            document.body.removeChild(popup);
        }
    } else {
        console.error('No video element found.');
    }
}

// Disconnect the pause observer if it exists
if (window.pauseObserver) {
    window.pauseObserver.disconnect();
    console.log('Pause observer stopped.');
}

// Function to restore all video elements
function unlockAllVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        restoreVideo(video);
    });
}

// Initial restoration on existing video elements
unlockAllVideos();

// Monitor for new video elements (e.g., if the user navigates to another video)
unpauseObserver = new MutationObserver(() => {
    unlockAllVideos();
});

unpauseObserver.observe(document.body, { childList: true, subtree: true });

window.unpauseObserver = unpauseObserver; // Make sure it is accessible globally
