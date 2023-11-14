//Fetch stored information.
window.onload = function() {
    const storedWidth = localStorage.getItem('videoWidth');
    const storedVideoID = localStorage.getItem('videoID');

    const videoIdValueSpan = document.getElementById('videoID');
    const videoLink = document.getElementById('videoLink');

    const storedAspectRatio = localStorage.getItem('videoAspectRatio');

    console.log('Stored Video ID:', storedVideoID);

    if (storedWidth && storedAspectRatio) {
        const playerIframe = document.getElementById("falsifiedMediaPlayer");
        let calculatedHeight = storedWidth / storedAspectRatio;

        //Update iframe dimensions
        playerIframe.width = storedWidth;
        playerIframe.height = calculatedHeight;
    }

    //Update videoID
    videoIdValueSpan.innerHTML = `<span style="color: var(--darker-gray);">LastVideoID:</span> ${storedVideoID} : `;
    //Update videoLink
    videoLink.href = `https://www.youtube.com/watch?v=${storedVideoID}`;
};