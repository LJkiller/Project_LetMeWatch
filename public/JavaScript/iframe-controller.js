
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

    if (displayAsLastVideo) {
        videoIdValueSpan.textContent = `VideoID: ${storedVideoID} : `;
    } else {
        videoIdValueSpan.innerHTML = `<span style="color: var(--darker-gray);">LastVideoID:</span> ${storedVideoID} : `;
    }
}

/**
 * Method resposnbile of saving video link.
 * 
 * @param {string} videoLink - The current video link.
 * @param {string} videoId - Video ID.
 */
function saveVideoLink(videoLink, videoId) {
    let videoLinksArray = JSON.parse(localStorage.getItem('videoLinks')) || [];
    if (videoLinksArray.length >= 5) {
        videoLinksArray.shift();
    }

    let videoObject = {
        url: videoLink,
        date: formatDate(new Date),
        id: videoId
    };
    videoLinksArray.push(videoObject);
    localStorage.setItem('videoLink', videoLink);
    localStorage.setItem('videoId', videoId);
    localStorage.setItem('videoLinks', JSON.stringify(videoLinksArray));
}

/**
 * Method responsible of saving domains with used number.
 * 
 * @param {string} videoLink - The URL of the video link.
 * @returns Nothing, just to break out of the function.
 */
function frequentDomainsAnalysis(videoLink, domains = [], additionalDomains = []) {
    if (videoLink === 'NOT FOUND') {
        console.log('None found.');
        return;
    }

    let domainName = videoLink.split('/')[2];
    let allDomains = [...domains, ...additionalDomains];
    for (let domain of allDomains) {
        let [domainIdentifier] = domain.split('|')[1];
        if (domainName.includes(domainIdentifier)) {
            saveFrequentDomain(domainName, allDomains, JSON.parse(localStorage.getItem('frequentDomainData')) || []);
            return;
        }
    }

    console.log('None found.');
}

/**
 * Method responsible for saving video information and updating UI.
 * 
 * @param {string} videoId - Video ID.
 * @param {string} videoLink - The URL of the video link.
 * @param {string} iframeSrc - The current video embed source.
 */
function updateVideoInfo(videoId = 'NOT FOUND', videoLink = 'NOT FOUND', iframeSrc = 'NOT FOUND') {
    localStorage.setItem('videoSource', iframeSrc);

    videoIdValueSpan.textContent = `VideoID: ${videoId} : `;

    let publicDomains = typeof domains !== 'undefined' ? domains : {};
    let moreDomains = typeof additionalDomains !== 'undefined' ? additionalDomains : {};

    videoLink.href = videoLink;
    frequentDomainsAnalysis(videoLink, Object.keys(publicDomains), Object.keys(moreDomains));
    saveVideoLink(videoLink, videoId);
}

// #endregion

// #endregion

// #region Events

document.getElementById('falsified-media-link').addEventListener('submit', function (event) {
    event.preventDefault();
    let linkInput = document.getElementById('link-input').value;
    handleLinkInput(linkInput);
});

/**
 * Event for checking how many times reset button has been pressed and operates accordingly.
 */
resetButton.addEventListener('click', function () {
    let displayAsLastVideo = false;

    if (pressedButtonForVideoURL !== 0) {
        displayAsLastVideo = true;
    }

    pressedButtonForVideoURL++;

    resetVideoSize(displayAsLastVideo);
});

document.getElementById('update-size-button').addEventListener('click', function (event) {
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
function handleLinkInput(linkInput) {
    let inputChecking = linkInput.toLowerCase();
    switch (true) {
        case inputChecking === 'clear':
            localStorage.clear();
            console.log('Local Storage Cleared.');
            window.location.reload();
            break;
        default:
            let mediaInfo = extractMediaInfo(linkInput);
            videoIdValueSpan.textContent = `VideoID: ${mediaInfo[1]} : `;
            updateVideoInfo(mediaInfo[1], mediaInfo[2], mediaInfo[3]);
            updateMediaPlayer(mediaInfo[3]);
            break;
    }
}

/**
 * Method responsible of extracting media info from url.
 * 
 * @param {string} linkInput - Url input. 
 * @returns {Array} - Array of information: domainName, videoId, videoLink, and iframeSrc.
 */
function extractMediaInfo(linkInput) {
    let publicDomains = typeof domains === 'object' ? domains : [];
    let domainResult = domainAnalyzis(publicDomains, linkInput.split('/')[2]);

    let linkArrayInfo;
    if (domainResult) {
        linkArrayInfo = mediaInformation(domainResult, linkInput, linkInput.split('/')[2]);
    } else {
        linkArrayInfo = typeof additionalMediaInfo === 'function' ? additionalMediaInfo(linkInput) : [];
    }

    let mediaInfo = linkArrayInfo.slice(0, 4);
    return mediaInfo;
}

/**
 * Method responsible of analyzing domains object.
 * 
 * @param {Object} domains - Objects representing different websites. 
 * @returns {string} - The corresponding domainName.
 */
function domainAnalyzis(domains, domainName) {
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
function mediaInformation(domainResult, linkInput, domainName) {
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

/**
 * Method responsible of updating media player src.
 * 
 * @param {string} iframeSrc - corresponding iframe for specific link.
 */
function updateMediaPlayer(iframeSrc) {
    playerIframe.src = iframeSrc;
    document.getElementById('link-input').value = '';
}

// #endregion
