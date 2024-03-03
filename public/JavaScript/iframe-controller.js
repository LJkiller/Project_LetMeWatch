
// #region Setup.
let playerIframe = document.getElementById('falsifiedMediaPlayer');
let widthInput = document.getElementById('widthInput');

let heightValueSpan = document.getElementById('heightValue');
let widthValueSpan = document.getElementById('widthValue');
let resetButton = document.getElementById('resetSizeButton');
let videoIdValueSpan = document.getElementById('videoID');

let baseWidth = 560;
let baseHeight = 315;
// Scale factor to get to 1280 & 720px.
let scaleFactor = 2.28571428571428580944;
let aspectRatio = baseWidth / baseHeight;

let defaultWidth = baseWidth * scaleFactor;
let defaultHeight = baseHeight * scaleFactor;

let pressedButtonForVideoURL = 0;
// #endregion

// #region Saving & Displaying

displayVideoSize();
displayVideoId();

// #region Size

/**
 * Method responsible of displaying size values.
 */
function displayVideoSize() {
    let storedWidth = Math.round(localStorage.getItem('videoWidth'));
    let storedHeight = Math.round(storedWidth / aspectRatio);

    heightValueSpan.textContent = `Height: ${storedHeight}px`;
    widthValueSpan.textContent = `Width: ${storedWidth}px`;
}

/**
 * Method responsible of saving video dimensions (width).
 * 
 * @param {number} width - The width of the media player.
 */
function saveVideoWidth(width = defaultWidth) {
    localStorage.setItem('videoWidth', width);
}

/**
 * Method responsible of updating video size.
 * 
 * @returns Nothing.
 */
function updateVideoSize() {
    let newWidth = parseInt(widthInput.value);

    if (isNaN(newWidth)) {
        return;
    }

    let newHeight = Math.round(newWidth / aspectRatio);

    saveVideoWidth(newWidth);
    updatePlayerDimensions(newWidth, newHeight);
    displayVideoSize();

    widthInput.value = '';
}
/**
 * Method responsible of updating iframe dimensions.
 * 
 * @param {number} width - The new width of iframe.
 * @param {number} height - The new height of iframe.
 */
function updatePlayerDimensions(width, height) {
    playerIframe.width = width;
    playerIframe.height = height;
}

// #endregion

// #region Media

/**
 * Method responsible of displaying latest video id.
 * 
 * @param {boolean} displayAsLastVideo - If last video id should be displayed.
 */
function displayVideoId(displayAsLastVideo = false) {
    let storedVideoID = localStorage.getItem('videoID');

    if (displayAsLastVideo){
        videoIdValueSpan.textContent = `VideoID: ${storedVideoID} : `;
    } else {
        videoIdValueSpan.innerHTML = `<span style="color: var(--darker-gray);">LastVideoID:</span> ${storedVideoID} : `;
    }
}

/**
 * Method resposnbile of saving video id.
 * 
 * @param {string} videoId - The current iframe video id.
 */
function saveVideoIDValue(videoId = 'NOT FOUND') {
    localStorage.setItem('videoId', videoId);
}
/**
 * Method resposnbile of saving video link.
 * 
 * @param {string} videoLink - The current video link.
 */
function saveVideoLink(videoLink = 'NOT FOUND'){
    localStorage.setItem('videoLink', videoLink);
}
/**
 * Method resposnbile of saving video embed source.
 * 
 * @param {string} videoSource - The current video embed source.
 */
function saveVideoSource(videoSource = 'NOT FOUND'){
    localStorage.setItem('videoSource', videoSource);
}

/**
 * Method responsible of updating video id.
 * 
 * @param {string} videoId - Video id.
 */
function updateVideoId(videoId) {
    videoIdValueSpan.textContent = `VideoID: ${videoId} : `;
    saveVideoIDValue(videoId);
}
/**
 * Method responsible of updating video link.
 * 
 * @param {Array} mediaInfo - Info about: domainName, url, and iframeSrc.
 */
function updateVideoLink(videoLinkSrc) {
    let videoLink = document.getElementById('videoLink');
    saveVideoLink(videoLinkSrc);
    videoLink.href = videoLinkSrc;
}

// #endregion

// #endregion

// #region Events

function handleLinkInput(event){
    event.preventDefault();
    let linkInput = document.getElementById('linkInput').value;

    handleMedia(linkInput);
}

/**
 * Event for checking how many times reset button has been pressed and operates accordingly.
 */
resetButton.addEventListener('click', function() {
    let displayAsLastVideo = false;

    if (pressedButtonForVideoURL !== 0) {
        displayAsLastVideo = true;
    }

    pressedButtonForVideoURL++;

    resetVideoSize(displayAsLastVideo);
});
/**
 * Method responsible of resetting video size.
 * 
 * @param {boolean} displayAsLastVideo - If videoSpan should be displayed as LastVideoID.
 */
function resetVideoSize(displayAsLastVideo) {
    updatePlayerDimensions(defaultWidth, defaultHeight);
    saveVideoWidth();
    displayVideoSize();
    displayVideoId(displayAsLastVideo);
}

// #endregion

// #region Media

/**
 * Method responsible of routing different logics together.
 * 
 * @param {string} linkInput - Video link.
 */
function handleMedia(linkInput){
    let mediaInfo = extractMediaInfo(linkInput);
    saveVideoSource(mediaInfo[3]);

    updateVideoId(mediaInfo[1]);
    updateVideoLink(mediaInfo[2]);
    updateMediaPlayer(mediaInfo[3]);
}

/**
 * Method responsible of extracting media info from url.
 * 
 * @param {string} linkInput - Url input. 
 * @returns {Array} - Array of information: domainName, videoId, videoLink, and iframeSrc.
 */
function extractMediaInfo(linkInput){
    let linkChunk = linkInput.split('/');

    let domainName = '';
    let videoId = '';
    let videoLink = '';
    let iframeSrc = '';
    let mediaInfo = [];

    domainName = linkChunk[2];
    if (domainName.includes('youtube') || domainName.includes('youtu.be')){
        for (let i = 0; i < linkChunk.length; i++) {
            switch (true){
                case linkChunk[i].includes('watch'):
                    videoId = linkChunk[i].split('?')[1].split('=')[1];
                    if (videoId.includes('&')){
                        videoId = videoId.split('&')[0];
                    }
                    break;
                case linkChunk[i].includes('youtu.be'):
                case linkChunk[i].includes('embed'):
                case linkChunk[i].includes('shorts'):
                    videoId = linkChunk[i + 1].split('?')[0];
                    break;
                default:
                    break;
            }
        }
        videoLink = `https://${domainName}/watch?v=${videoId}`;
        iframeSrc = `https://www.youtube-nocookie.com/embed/${videoId}?start=0&autoplay=1&autohide=1`;
    } else {
        let linkArrayInfo = additionalMediaInfo(linkChunk);
        domainName = linkArrayInfo[0];
        videoId = linkArrayInfo[1];
        videoLink = linkArrayInfo[2];
        iframeSrc = linkArrayInfo[3];
    }

    mediaInfo.push(domainName);
    mediaInfo.push(videoId);
    mediaInfo.push(videoLink);
    mediaInfo.push(iframeSrc);
    return mediaInfo;
}

/**
 * Method responsible of updating media player src.
 * 
 * @param {string} iframeSrc - corresponding iframe for specific link.
 */
function updateMediaPlayer(iframeSrc){
    playerIframe.src = iframeSrc;
    document.getElementById('linkInput').value = '';
}

// #endregion
