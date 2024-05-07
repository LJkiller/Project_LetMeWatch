
// #region Media Result Applications

/**
 * Method responsible of updating video size.
 * 
 * @returns Nothing.
 */
function updateVideoSize(widthInput) {
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
 * Method responsible of saving video dimensions (width).
 * 
 * @param {number} width - The width of the media player.
 */
function saveVideoWidth(width = defaultWidth) {
    localStorage.setItem('videoWidth', width);
}

/**
 * Method responsible of displaying size values.
 */
function displayVideoSize() {
    let storedWidth = Math.round(localStorage.getItem('videoWidth'));
    let storedHeight = Math.round(storedWidth / aspectRatio);

    document.getElementById('height-value').textContent = `Height: ${storedHeight}px`;
    document.getElementById('width-value').textContent = `Width: ${storedWidth}px`;
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




// #region Media Result Saving

/**
 * Method responsible of displaying latest video id.
 * 
 * @param {boolean} displayAsLastVideo - If last video id should be displayed.
 */
function displayVideoId(displayAsLastVideo = false) {
    let videoLinks = JSON.parse(localStorage.getItem('videoLinks'));
    let storedVideoID = Array.isArray(videoLinks) ? videoLinks[videoLinks.length -1].id: 'NOT FOUND';
    let displayId = limitText(storedVideoID, textListLimit);

    if (displayAsLastVideo) {
        videoIdValueSpan.textContent = `VideoID: ${displayId}`;
    } else {
        videoIdValueSpan.innerHTML = `<span style="color: var(--darker-gray);">LastVideoID:</span> ${displayId}`;
    }
}

/**
 * Method resposnbile of saving video link.
 * 
 * @param {string} videoLink - The current video link.
 * @param {string} videoId - Video ID.
 * @param {string[]} iframeSrc - Video iframeSrc.
 */
function saveVideoLink(videoLink, videoId, iframeSrc) {
    let videoLinksArray = JSON.parse(localStorage.getItem('videoLinks')) || [];
    if (videoLinksArray.length >= 5) {
        videoLinksArray.shift();
    }

    let videoObject = {
        url: videoLink,
        date: formatDate(new Date),
        id: videoId,
        src: iframeSrc
    };
    videoLinksArray.push(videoObject);
    localStorage.setItem('videoLinks', JSON.stringify(videoLinksArray));
}

/**
 * Method responsible of saving domains with used number.
 * 
 * @param {any} videoInput - The video input or array of a boolean and an array.
 * @param {any[]} [additionalDomains=[]] - Array of domains.
 * @param {any[]} [domains=[]] - Array of domains.
 * @returns Nothing, just to break out of the function.
 */
function frequentDomainsAnalysis(videoInput, domains = [], additionalDomains = []) {
    let allDomains = [...domains, ...additionalDomains];
    if (Array.isArray(videoInput)){
        saveFrequentDomain(videoInput, allDomains, JSON.parse(localStorage.getItem('frequentDomainData')) || []);
    } else {
        if (videoInput === 'NOT FOUND') {
            return;
        }
        let domainName = videoInput.split('/')[2];

        for (let domain of allDomains) {
            let [domainIdentifier] = domain.split('|')[1];
            if (domainName.includes(domainIdentifier)) {
                saveFrequentDomain(domainName, allDomains, JSON.parse(localStorage.getItem('frequentDomainData')) || []);
                return;
            }
        }
    }
}

/**
 * Method responsible for saving video information and updating UI.
 * 
 * @param {string} videoId - Video ID.
 * @param {string} videoLink - The URL of the video link.
 * @param {string[]} iframeSrc - The current video embed source.
 */
function updateVideoInfo(videoId = 'NOT FOUND', videoLink = 'NOT FOUND', iframeSrc = ['NOT FOUND']) {
    videoIdValueSpan.textContent = `VideoID: ${limitText(videoId, textListLimit)}`;

    let publicDomains = typeof domains !== 'undefined' ? domains : {};
    let moreDomains = typeof additionalDomains !== 'undefined' ? additionalDomains : {};

    document.getElementById('video-link').href = videoLink;
    frequentDomainsAnalysis(videoLink, Object.keys(publicDomains), Object.keys(moreDomains));
    saveVideoLink(videoLink, videoId, iframeSrc);
}

// #endregion




// #region Iframe Input

/**
 * Method responsible of routing different logics together.
 * 
 * @param {string} linkInput - Video link.
 */
function handleLinkInput(linkInput) {
    let inputChecking = linkInput.toLowerCase();
    document.getElementById('link-input').value = '';
    
    if (isGibberish(linkInput)){
        return;
    }

    let examples = getAllDomainExamples();
    let example = getRandomValue(examples);
    let publicDomains = typeof domains !== 'undefined' ? domains : {};
    let moreDomains = typeof additionalDomains !== 'undefined' ? additionalDomains : {};

    let commandCheck = isCommand(inputChecking);
    switch(true){
        case commandCheck[1] === commands.cmdList:
            for (let command in commands){
                console.log(command, ':', commands[command]);
            }
            break;
        case commandCheck[1] === commands.example:
            handleLinkInput(example);
            console.log(`Video Example Applied: ${example}.`);
            break;
        case commandCheck[1] === commands.localClear:
            localStorage.clear();
            console.log('Local Storage Cleared.');
            window.location.reload();
            break;
        case commandCheck[1] === commands.localFill:
            frequentDomainsAnalysis(commandCheck, Object.keys(publicDomains), Object.keys(moreDomains));
            console.log('Local Storage Manipulated.');
            break;
        case commandCheck[1] === commands.localStorage:
            checkLocalStorage();
            break;
        case commandCheck[1] === commands.localTest:
            frequentDomainsAnalysis(commandCheck, Object.keys(publicDomains), Object.keys(moreDomains));
            console.log('Local Storage Manipulated.');
            handleLinkInput(example);
            console.log(`Video Example Applied: ${example}.`);
            playlistApply(example);
            break;
        default:
            let mediaInfo = extractMediaInfo(linkInput);
            videoIdValueSpan.textContent = `VideoID: ${mediaInfo[1]}`;
            updateVideoInfo(mediaInfo[1], mediaInfo[2], mediaInfo[3]);
            playerIframe.src = mediaInfo[3];
            break;
    }
    updateMetricLists();
    resetMainButtons();
    checkLibrary();
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

    return linkArrayInfo;
}

/**
 * Method responsible of analyzing domains object.
 * 
 * @param {Object} domains - Objects representing different websites. 
 * @returns {Object} - The corresponding domain information.
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
        let urlId = match.slice(1).find(id => !!id) || '';
        let videoLink = linkInput;
        let isPlaylist = linkInput.includes('playlist') || linkInput.includes('list');
        let finalIframeSrc = isPlaylist ? `${iframeSrc[1].replace('{urlId}', urlId)}` : `${iframeSrc[0].replace('{urlId}', urlId)}`;

        return [domainName, urlId, videoLink, finalIframeSrc];
    }
    return;
}

// #endregion

/**
 * Command method responsible of applying playlists methods.
 * 
 * @param {string} link - Link to apply.
 */
function playlistApply(link){
    addToLibrary('starLibrary', link);
    addToLibrary('playlistLibrary', link);
    let playlistLibrary = JSON.parse(localStorage.getItem('playlistLibrary')) || [];
    let starLibrary = JSON.parse(localStorage.getItem('starLibrary')) || [];
    let starArea = document.querySelector(`#starred-videos > .videos`);
    let playlistArea = document.querySelector(`#playlist > .videos`);
    starArea.innerHTML = '';
    playlistArea.innerHTML = '';
    if (!link.includes('NOT%20FOUND')) {
        createLibraryList(starLibrary, starArea);
        createLibraryList(playlistLibrary, playlistArea);
    }
}


// #region Commands 


// #endregion