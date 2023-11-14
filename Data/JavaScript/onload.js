//Fetch stored information (videoWidth, videoAspectRatio).
window.onload = function() {
    const storedWidth = localStorage.getItem('videoWidth');
    const storedVideoID = localStorage.getItem('videoID');
    const videoIdValueSpan = document.getElementById('videoID');

    const storedAspectRatio = localStorage.getItem('videoAspectRatio');

    if (storedWidth && storedAspectRatio) {
        const playerIframe = document.getElementById("falsifiedMediaPlayer");
        let calculatedHeight = storedWidth / storedAspectRatio;

        //Update iframe dimensions
        playerIframe.width = storedWidth;
        playerIframe.height = calculatedHeight;
    }

    //Update videoID
    videoIdValueSpan.textContent = `videoID: ${storedVideoID}`;
};