console.log('unpause.js script loaded and running.');

var unpauseObserver; // Ensure unpauseObserver is globally scoped

// Function to unpause the video and remove the popup
function unpauseVideo(video) {
    if (video && pausedVideos.has(video)) {
        video.play = video.originalPlay;
        video.play();

        // Restore controls
        video.controls = true;

        console.log('Video unpaused and lock removed.');

        // Remove the popup
        var popup = document.getElementById('videoPausePopup');
        if (popup) {
            document.body.removeChild(popup);
        }

        // Remove the video from the paused set
        pausedVideos.delete(video);
    } else {
        console.error('No video element found to unpause.');
    }
}

// Function to unpause all videos
function unpauseAllVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        unpauseVideo(video);
    });
}

// Initial enforcement on existing video elements
unpauseAllVideos();

// Disconnect the pause observer if it exists
if (window.pauseObserver) {
    window.pauseObserver.disconnect();
    console.log('Pause observer stopped.');
}

// Monitor for new video elements (e.g., if the user navigates to another video)
unpauseObserver = new MutationObserver(() => {
    unpauseAllVideos();
});

unpauseObserver.observe(document.body, { childList: true, subtree: true });

window.unpauseObserver = unpauseObserver; // Make sure it is accessible globally
