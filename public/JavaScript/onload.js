
// Fetch stored information.
window.onload = function() {

    
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        console.log(key + " => " + value);
    }
    

    let playerIframe = document.getElementById('falsifiedMediaPlayer');
    let videoIdValueSpan = document.getElementById('videoID');
    let videoLink = document.getElementById('videoLink');

    let storedWidth = localStorage.getItem('videoWidth');
    let storedVideoID = localStorage.getItem('videoId');
    let storedVideoSource = localStorage.getItem('videoSource');
    let storedVideoLink = localStorage.getItem('videoLink');

    if (storedWidth) {
        let baseWidth = 426;
        let baseHeight = 240;
        let aspectRatio = baseWidth / baseHeight;
        let calculatedHeight = storedWidth / aspectRatio;

        //Update iframe dimensions
        playerIframe.width = storedWidth;
        playerIframe.height = calculatedHeight;
    }

    // Update videoID.
    videoIdValueSpan.innerHTML = `<span style="color: var(--darker-gray);">LastVideoID:</span> ${storedVideoID} : `;
    // Update videoLink.
    videoLink.href = storedVideoLink;
    // Update videoSrc.
    playerIframe.src = storedVideoSource;
};