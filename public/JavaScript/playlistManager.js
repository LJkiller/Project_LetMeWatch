
/**
 * Method responsible of handling hover events.
 * 
 * @param {Event} event - Event. 
 * @param {object} button - Button configs. 
 */
function handleHoverEvent(event, buttonConfig) {
    event.preventDefault();
    if (!buttonConfig.active) {
        let icons = buttonConfig.buttonLocation.querySelectorAll('i');
        let icon = icons.length > 1 ? icons[1] : icons[0];
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
    }
}

/**
 * Method responsible of adding click events.
 * 
 * @param {Event} event - Event.
 * @param {object} button - Button configs. 
 */
function handleClickQAddEvent(event, buttonConfig){
    event.preventDefault();
    let videoLinks = getVideoLinksArray();
    if (!buttonConfig.active) {
        addToLibrary(buttonConfig.libraryType, videoLinks[1].url);
        buttonConfig.spanElement.innerHTML = buttonConfig.activeText;
        buttonConfig.active = true;
    } else {
        removeFromLibrary(buttonConfig.libraryType, videoLinks[1]);
        buttonConfig.spanElement.innerHTML = buttonConfig.defaultText;
        buttonConfig.active = false;
    }
    let library = JSON.parse(localStorage.getItem(buttonConfig.libraryType)) || [];
    buttonConfig.ulElement.innerHTML = '';
    if (linkRegex.test(videoLinks[1].url)) {
        createLibraryList(library, buttonConfig.ulElement);
    }
}

/**
 * Method responsible of handling click event for media form buttons.
 * 
 * @param {Event} event - Event.
 * @param {object} buttonConfig - Button object.
 * @returns 
 */
function handleClickAddEvent(event, buttonConfig) {
    event.preventDefault();
    let linkElement = document.getElementById('link-input');
    let linkInput = linkElement.value;
    linkElement.value = '';
    
    if (isGibberish(linkInput)){
        return;
    }

    if (!buttonConfig.active) {
        buttonConfig.active = true;
        addToLibrary(buttonConfig.libraryType, linkInput);
        createLibraryList(JSON.parse(localStorage.getItem(buttonConfig.libraryType)) || [], buttonConfig.ulElement);
        setTimeout(() => {
            buttonConfig.active = false;
            resetButtonIcon(buttonConfig.buttonLocation);
        }, 500);
    }
    checkLibrary(buttonConfig);
}



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
    let mediaInfo = extractMediaInfo(playlist[currentVideoNumber].url) 
        || [{domainName: 'NOT FOUND', url: 'NOT FOUND', id: 'NOT FOUND', id: 'NOT FOUND'}]
    ;
    mediaPlayer.src = mediaInfo[3];
    videoIdValueSpan.textContent = `VideoID: ${limitText(mediaInfo[1], textListLimit)}`;
    checkLibrary();
}