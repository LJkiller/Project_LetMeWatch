
let playlist;
let currentVideoNumber = 0;

/**
 * Method responsible of playing previous video.
 * 
 * @param {Event} event - Event.
 */
function playPreviousVideo(event) {
    event.preventDefault();
    if (currentVideoNumber > 0) {
        currentVideoNumber--;
        saveVideoPositions(currentVideoNumber);
        changeMediaPlayerSrc();
    }
}

/**
 * Method responsible of playing next video.
 * 
 * @param {Event} event - Event.
 */
function playNextVideo(event) {
    event.preventDefault();
    if (currentVideoNumber < playlist.length - 1) {
        currentVideoNumber++;
        saveVideoPositions(currentVideoNumber);
        changeMediaPlayerSrc();
    }
}

/**
 * Method responsible of saving: current- & iterated positions.
 */
function saveVideoPositions(currentVideoNumber) {
    let positions = JSON.parse(localStorage.getItem('playlistDetails')) || [];
    positions.push(playlist[currentVideoNumber]);
    localStorage.setItem('playlistDetails', JSON.stringify(positions));
}

/**
 * Method responsible of changing the video content.
 */
function changeMediaPlayerSrc() {
    let mediaInfo = extractMediaInfo(playlist[currentVideoNumber].url);
    mediaPlayer.src = mediaInfo[3];
    videoIdValueSpan.textContent = `VideoID: ${limitText(mediaInfo[1], textListLimit)}`;
    checkLibrary();
}