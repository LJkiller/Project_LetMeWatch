
// #region Setup.
let playerIframe = document.getElementById('falsified-media-player');
let widthInput = document.getElementById('width-input');

let heightValueSpan = document.getElementById('height-value');
let widthValueSpan = document.getElementById('width-value');
let resetButton = document.getElementById('reset-size-button');
let videoIdValueSpan = document.getElementById('video-id');

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
    let videoLink = document.getElementById('video-link');
    saveVideoLink(videoLinkSrc);
    videoLink.href = videoLinkSrc;
}

// #endregion

// #endregion

// #region Events

document.getElementById('falsified-media-link').addEventListener('submit', function(event) {
    event.preventDefault();
    let linkInput = document.getElementById('link-input').value;
    handleMedia(linkInput);
});

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

document.getElementById('update-size-button').addEventListener('click', function(event) {
    event.preventDefault();
    resetVideoSize();
}); 
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

    let domains = {
        'www.youtube.com|youtu.be': {
            //Example youtube links:
            //https://www.youtube.com/watch?v=PEvURuyHcXM
            //https://youtu.be/PEvURuyHcXM?si=LQ1x4Q4DTbGMI4nP
            //https://www.youtube.com/embed/PEvURuyHcXM?si=LQ1x4Q4DTbGMI4nP
            //https://youtube.com/shorts/NuK3TqEhnkI?si=ido3nB9MMWW3IrRy
            regexes: [
                /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
                /youtu\.be\/([^?]+)/i,
                /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i,
                /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/i
            ],
            iframeSrc: 'https://www.youtube-nocookie.com/embed/{urlId}?start=0&autoplay=1&autohide=1'
        }
    };

    let domainResult = domainAnalyzis(domains, linkChunk[2]);
    let linkArrayInfo;
    if (domainResult) {
        linkArrayInfo = mediaInformation(domainResult, linkInput, linkChunk[2]);
    } else {
        linkArrayInfo = additionalMediaInfo(linkInput);
    }

    let mediaInfo = linkArrayInfo.slice(0, 4);
    console.log(mediaInfo);
    return mediaInfo;
}

/**
 * Method responsible of updating media player src.
 * 
 * @param {string} iframeSrc - corresponding iframe for specific link.
 */
function updateMediaPlayer(iframeSrc){
    playerIframe.src = iframeSrc;
    document.getElementById('link-input').value = '';
}

/**
 * Method responsible of analyzing domains object.
 * 
 * @param {Object} domains - Objects representing different websites. 
 * @returns {string} - The corresponding domainName.
 */
function domainAnalyzis(domains, domainName){
    let domain;
    for (let domainsProperty in domains) {
        if (domainsProperty.includes('|')) {
            let variations = domainsProperty.split('|');
            if (variations.includes(domainName) && domains[domainsProperty]) {
                domain = domains[domainsProperty];
                break;
            }
        } else if (domainsProperty === domainName && domains[domainsProperty]) {
            domain = domains[domainsProperty];
            break;
        }
    }
    return domain;
}

/**
 * Method responsible of getting appropiate information.
 * 
 * @param {string} domainResult - 
 * @param {URL} linkInput - Link input to be analyzed.
 * @param {string} domainName - The link's domain name.
 * @returns {Array} - Information of what to proceed with.
 */
function mediaInformation(domainResult, linkInput, domainName){
    let { regexes, iframeSrc } = domainResult;
    let combinedRegex = new RegExp(regexes.map(pattern => `(?:${pattern.source})`).join('|'), 'i');
    
    let match = linkInput.match(combinedRegex);
    if (match) {
        let urlId = '';
        switch (true) {
            case !!match[1]:
                urlId = match[1];
                break;
            case !!match[2]:
                urlId = match[2];
                break;
            case !!match[3]:
                urlId = match[3];
                break;
            case !!match[4]:
                urlId = match[4];
                break;
            default:
                break;
        }
        let videoLink = linkInput;
        let finalIframeSrc = `${iframeSrc.replace('{urlId}', urlId)}`;

        return [domainName, urlId, videoLink, finalIframeSrc];
    }
}

// #endregion
