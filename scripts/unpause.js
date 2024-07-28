console.log('unpause.js script loaded and running.');

// Function to unpause the video and remove the popup
function unpauseVideo(video) {
    if (video && window.pausedVideos.has(video)) {
        video.play = video.originalPlay;
        video.play();

        // Restore controls
        video.controls = true;

        console.log('Video unpaused and lock removed.');

        // Remove the popup
        let popup = document.getElementById('videoPausePopup');
        if (popup) {
            document.body.removeChild(popup);
        }

        // Remove the video from the paused set
        window.pausedVideos.delete(video);
    } else {
        console.error('No video element found to unpause.');
        window.unpauseObserver.disconnect()
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
    console.log('unpause observer stopped.');
}

// Monitor for new video elements (e.g., if the user navigates to another video)
window.unpauseObserver = new MutationObserver(() => {
    unpauseAllVideos();
});

window.unpauseObserver.observe(document.body, { childList: true, subtree: true });