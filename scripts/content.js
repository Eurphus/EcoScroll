function enforcePause(video) {
    if (video) {
        video.pause();

        // Disable the play method
        video.play = function() {
            console.log("Play function disabled.");
        };

        // Hide controls to prevent user interaction
        video.controls = false;

        console.log('Video paused and lock enforced.');

        // Ensure the video remains paused if an external script tries to play it
        video.addEventListener('play', () => {
            video.pause();
        });
    } else {
        console.error('No video element found.');
    }
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
const observer = new MutationObserver(() => {
    lockAllVideos();
});

observer.observe(document.body, { childList: true, subtree: true });
