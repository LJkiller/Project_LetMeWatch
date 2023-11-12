//Fetch stored information (videoWidth, videoAspectRatio).
window.onload = function() {
    let storedWidth = localStorage.getItem('videoWidth');
    let storedAspectRatio = localStorage.getItem('videoAspectRatio');

    if (storedWidth && storedAspectRatio) {
        let iframe = document.getElementById("falsifiedMediaPlayer");
        let calculatedHeight = storedWidth / storedAspectRatio;

        // Update iframe dimensions
        iframe.width = storedWidth;
        iframe.height = calculatedHeight;
    }
};