
// #region Events

/**
 * Method responsible of handling start sequence for playlist.
 */
function handleStartPlaylist(){
    playlistActive = true;
    playlist = JSON.parse(localStorage.getItem('playlistLibrary')) || [];
    if (playlist.length > 0) {
        toggleElements([iframeControls, startPlaylistButton]);
        scrollToArea('media-top');
        localStorage.setItem('videoPlaylistPosition', JSON.stringify({ position: currentPlaylistPosition}));
        saveVideoPositions(currentPlaylistPosition);
        changeMediaPlayerSrc();
        updatePlaylistContent();
        document.getElementById('prev-playlist-button').addEventListener('click', playPreviousVideo);
        document.getElementById('next-playlist-button').addEventListener('click', playNextVideo);
    } else {
        displayError('Playlist not found.');
    }
}

/**
 * Method responsible of handling exit sequence for playlist.
 */
function handleExitPlaylist(event){
    playlistActive = false;
    toggleElements([iframeControls, startPlaylistButton]);

    let settings = JSON.parse(localStorage.getItem('settings'));
    let removePlaylistEntriesSettings, resetCurrentVideoPositionSettings;
    for (let i = 0; i < settings.length; i++){
        let item = settings[i];
        if (item.formInput === playlistCase.options[0]) {
            removePlaylistEntriesSettings = item;
        } else if (item.formInput === playlistCase.options[1]) {
            resetCurrentVideoPositionSettings = item;
        }
    }

    if (removePlaylistEntriesSettings || event.shiftKey) {
        let playlistDetails = JSON.parse(localStorage.getItem('playlistDetails'));
        for (let i = 0; i < playlistDetails.length; i++) {
            removeFromLibrary('playlistLibrary', playlistDetails[i]);
        }
        resetVideoPlaylistPosition();
    } 
    if (resetCurrentVideoPositionSettings){
        resetVideoPlaylistPosition();
    }
    localStorage.removeItem('playlistDetails');

    let videoLinksArray = getVideoLinksArray();
    mediaPlayer.src = videoLinksArray[1].src;
    videoIdValueSpan.textContent = `VideoID: ${limitText(videoLinksArray[1].id, textListLimit)}`;
    resetMainButtons();
    checkLibrary();
    updatePlaylistContent();
    playlist = [];
}

/**
 * Method responsible of handling hover events.
 * 
 * @param {Event} event - Event. 
 * @param {Object} button - Button configs. 
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
 * @param {Object} button - Button configs. 
 */
function handleClickAddEvent(event, buttonConfig){
    event.preventDefault();
    let videoLinks = getVideoLinksArray();
    if ((videoLinks[1].id === 'NOT FOUND') === false) {
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
    } else {
        buttonConfig.spanElement.innerHTML = buttonConfig.errorText;
        let intervalId = setInterval(() => {
            clearInterval(intervalId);
            buttonConfig.spanElement.innerHTML = buttonConfig.defaultText;
            buttonConfig.active = false;
            resetButtonIcon(buttonConfig.buttonLocation);
            checkLibrary();
        }, buttonConfig.errorDisplayDuration);
        resetButtonIcon(buttonConfig.buttonLocation);
    }
}

/**
 * Method responsible of handling click event for media form buttons.
 * 
 * @param {Event} event - Event.
 * @param {Object} buttonConfig - Button object.
 * @returns 
 */
function handleClickQAddEvent(event, buttonConfig) {
    event.preventDefault();
    let linkElement = document.getElementById('link-input');
    let linkInput = linkElement.value;
    linkElement.value = '';
    
    if (!linkRegex.test(linkInput)){
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
    checkLibrary();
}

/**
 * Method responsible of handling playlist details.
 * 
 * @param {string} libraryType - Which library to remove from.
 * @param {string} encodedItem - Encoded playlist item data in JSON.
 * @param {string} id - The id of the where the function is called from.
 * @param {string} [removeCondition=''] - The condition to remove the item.
 */
function handlePlaylistDetails(libraryType, encodedItem, id) {
    let item = JSON.parse(decodeURIComponent(encodedItem));

    let calledFromElement = document.getElementById(id);
    let parentElement = calledFromElement.parentElement;
    calledFromElement.style.color = 'transparent';

    let detailsId = `details-${id}`;
    let details = document.createElement('div');
    details.id = detailsId;
    details.classList.add('details');
    details.innerHTML = `
        <p class="detail-domain-display">${limitText(item.id, textListLimit)}</p>
        <button onclick="handleLinkInput('${item.url}')" class="detail-play-video hidden-button">Play Video</button>
        <a target="_blank" class="detail-open-video" href="${item.url}">Open Video</a>
        <button onclick="removeFromPlaylist('${libraryType}','${encodedItem}')" class="detail-remove-item hidden-button">Remove Item</button>
        <button onclick="closeContainer('${detailsId}')" class="detail-close-button hidden-button">Close</button>
    `;
    parentElement.appendChild(details);

    requestAnimationFrame(() => {
        details.style.opacity = 1;
        details.addEventListener('mouseleave', function() {
            closeContainer(detailsId);
        });
    });
}

/**
 * Method responsible of removing container.
 * 
 * @param {string} containerId - The container to remove.
 */
function closeContainer(containerId) {
    let container = document.getElementById(containerId);
    if (container) {
        setTimeout(() => {
            container.style.opacity = 0;
            container.style.border = 0;
            container.style.width = 0;
            container.style.height = 0;
            let parentElement = container.parentElement;
            if (containerId.includes('details-')) {
                let button = parentElement.querySelector('button');
                let color = 'primary-color';
                if (button.classList.contains('current-video-position')){
                    color = 'white';
                }
                button.style.color = `var(--${color})`;
            }
            setTimeout(() => {
                container.remove();
            }, 200);
        }, 100);
    }
}

// #endregion



// #region HTML Manipulation

/**
 * Method responsible of resetting main buttons.
 */
function resetMainButtons() {
    for (let i = 0; i < buttonConfigs.length; i++){
        buttonConfigs[i].spanElement.innerHTML = buttonConfigs[i].defaultText;
        buttonConfigs[i].active = false;
        resetButtonIcon(buttonConfigs[i].buttonLocation);
    }
}

/**
 * Method responsible of resetting button element.
 * 
 * @param {HTMLButtonElement} button - Button element to reset.
 */
function resetButtonIcon(button) {
    let icons = button.querySelectorAll('i');
    let icon = icons.length > 1 ? icons[1] : icons[0];
    if (icon.classList.contains('fa-solid')) {
        icon.classList.remove('fa-solid');
    }
    if (!icon.classList.contains('fa-regular')) {
        icon.classList.add('fa-regular');
    }
}

/**
 * Method responsible of 
 * 
 * @param {HTMLElement} buttonConfig - Button config information.
 */
function activateButtonIcon(buttonConfig) {
    let icon = buttonConfig.buttonLocation.querySelector('i');
    let isActive = buttonConfig.activeText === buttonConfig.buttonLocation.querySelector('span').textContent;
    isActive ? icon.classList.remove('fa-regular') : icon.classList.toggle('fa-regular');
    isActive ? icon.classList.add('fa-solid') : icon.classList.toggle('fa-solid');
}

/**
 * Method responsible of creating library list.
 * 
 * @param {string[]} library - Library of added items.
 * @param {HTMLUListElement} location - Location to append list.
 */
function createLibraryList(library, location) {
    let originalColor = 'var(--primary-color)';
    let originalTextColor = 'var(--white)';
    let textColor = originalTextColor, bottomColor = originalColor, topColor = originalColor;

    let parentLocation = location.parentElement;
    let parentId = parentLocation.getAttribute('id');
    let locationId = parentId === 'playlist' ? 'playlist': 'starred-videos';
    let libraryType = parentId === 'playlist' ? playlistLibraryType: starLibraryType;

    let positionClass;
    let setPositionClass;
    let videoPlaylistPosition = JSON.parse(localStorage.getItem('videoPlaylistPosition'));
    if (parentId === 'playlist' && playlistActive === true) {
        positionClass = 'current-video-position';
    }

    let iterations = 0;
    let html = '';
    for (let i = 0; i < library.length && i < maxPlaylistIteration; i++) {
        if (videoPlaylistPosition){
            setPositionClass = iterations === videoPlaylistPosition.position;
        } else {
            setPositionClass = iterations === 0;
        }
        let id = locationId === 'playlist' ? `playlist-button${iterations}`: `star-button${iterations}`;
        let item = library[i];
        let domainName = capitalizeFirstLetter(item.domainName);
        let buttonElement = `<button id="${id}" class="details hidden-button ${setPositionClass === true ? positionClass: ''}" onclick="handlePlaylistDetails('${libraryType}', '${encodeURIComponent(JSON.stringify(item))}', '${id}')">${limitText(item.id, textListLimit)}</button>`;
        html += `
            <li>
                ${createSVGNumber(bottomColor, topColor, textColor, textColor, i + 1, 'circle')}
                <span>${domainName}:</span>
                ${buttonElement}
            </li>`
        ;
        iterations++;
    }
    if (library.length > iterations || iterations > defaultMaxPlaylistIteration) {
        html += `
            <li class="display-more">
                ${library.length > iterations ? `<span>${library.length - iterations} More Items...</span>` : '<span></span>'}
                <button class="quick-button" onclick="${library.length > iterations ? `displayMorePlaylist('${libraryType}')` : `displayLessPlaylist('${libraryType}')`}">
                    ${library.length > iterations ? `Display More` : `Display Less`}
                </button>
            </li>`
        ;
    }
    location.innerHTML = html;
}

/**
 * Method responsible of displaying more items in playlists.
 * 
 * @param {string} libraryType - Library type to compare for further logic.
 */
function displayMorePlaylist(libraryType){
    let playlistUlArea = libraryType === playlistLibraryType ? playlistUl : starUl;
    playlistUlArea.innerHTML = '';
    let library = JSON.parse(localStorage.getItem(libraryType));
    maxPlaylistIteration = library.length;
    createLibraryList(JSON.parse(localStorage.getItem(libraryType)) || [], playlistUlArea);
    applyContrast();
}

/**
 * Method responsible of displaying less items in playlists.
 * 
 * @param {string} libraryType - Library type to compare for further logic.
 */
function displayLessPlaylist(libraryType){
    let playlistUlArea = libraryType === playlistLibraryType ? playlistUl : starUl;
    playlistUlArea.innerHTML = '';
    maxPlaylistIteration = defaultMaxPlaylistIteration;
    createLibraryList(JSON.parse(localStorage.getItem(libraryType)) || [], playlistUlArea);
    applyContrast();
}

/**
 * Method responsible of changing the video content.
 */
function changeMediaPlayerSrc() {
    let mediaInfo = extractMediaInfo(playlist[currentPlaylistPosition].url) || [{domainName: 'NOT FOUND', url: 'NOT FOUND', id: 'NOT FOUND', id: 'NOT FOUND'}];
    mediaPlayer.src = mediaInfo[3];
    videoIdValueSpan.textContent = `VideoID: ${limitText(mediaInfo[1], textListLimit)}`;
    checkLibrary();
}


/**
 * Method responsible of applying switched layout or default for playlist.
 * 
 * @param {boolean} [switchToNew=false] - Boolean to check if new layout should be applied.
 */
function switchPlaylistLayout(switchToNew = false) {
    switchToNew === true ? 
        updateLayout('user-stars', 'user-playlist', 'row-reverse') : 
        updateLayout('user-playlist', 'user-stars', 'row')
    ;
}

/**
 * Method responsible of updating playlist layout.
 * 
 * @param {string} leftArea - Area to be left.
 * @param {string} rightArea - Area to be right.
 * @param {string} flexDirection - Flex case of direction.
 */
function updateLayout(leftArea, rightArea, flexDirection) {
    playlistArea.style.gridArea = leftArea;
    starArea.style.gridArea = rightArea;
    let parentArea = starArea.parentElement;
    let parentStyle = window.getComputedStyle(parentArea);
    if (parentStyle.getPropertyValue('display') === 'flex') {
        parentArea.style.flexDirection = flexDirection;
    }
}

// #endregion



// #region Library Manipulation

/**
 * Method responsible for checking if an item exists.
 * 
 * @param {string[]} array - Array of already existing items.
 * @param {string} newItem - New item to compare.
 * @returns {boolean} - If item exists or not.
 */
function itemExistsInList(list, item) {
    return list.some(obj => obj.id === item.id && obj.domainName === item.domainName);
}

/**
 * Method responsible of checking the libraries to properly style buttons.
 */
function checkLibrary() {
    let videoLinksArray = getVideoLinksArray();
    for (let i = 0; i < buttonConfigs.length; i++){
        let button = buttonConfigs[i];
        let library = JSON.parse(localStorage.getItem(button.libraryType)) || [];
        if (itemExistsInList(library, videoLinksArray[1])) {
            activateButtonIcon(button);
            button.spanElement.innerHTML = button.activeText;
            button.active = true;
        }
    }
}

/**
 * Method responsible of adding new item to library.
 * 
 * @param {string} libraryType - Which library to add to.
 * @param {string} newItem - Item to add.
 * @returns - Nothing.
 */
function addToLibrary(libraryType, newItem){
    let library = JSON.parse(localStorage.getItem(libraryType)) || [];
    let extractedInfo = extractMediaInfo(newItem);
    typeof extractedInfo === 'object' ? [_, id, url] = extractedInfo: '';
    let publicDomains = typeof domains !== 'undefined' ? domains : {};
    let moreDomains = typeof additionalDomains !== 'undefined' ? additionalDomains : {};
    let compiledDomains = [];

    let newObject = {
        domainName: getWebsiteName(newItem, compiledDomains.concat(Object.keys(publicDomains), Object.keys(moreDomains))),
        url: url,
        id: id
    };
    
    let doesExist = itemExistsInList(library, newObject)
    doesExist ? '': library.push(newObject);
    doesExist ? '': localStorage.setItem(libraryType, JSON.stringify(library));
}

/**
 * Method responsible for removing items from library.
 * 
 * @param {string} libraryType - Which library to remove from.
 * @param {string} newItem - Item to remove.
 */
function removeFromLibrary(libraryType, item) {
    item = typeof item === 'string' ? JSON.parse(decodeURIComponent(item)): item;
    let library = JSON.parse(localStorage.getItem(libraryType)) || [];
    let indexToRemove = library.findIndex(libraryItem => 
        libraryItem.domainName === item.domainName && libraryItem.id === item.id
    );
    if (indexToRemove !== -1) {
        library.splice(indexToRemove, 1);
        localStorage.setItem(libraryType, JSON.stringify(library));
    }
}

/**
 * Method responsible of handling the case from playlist item removal.
 * 
 * @param {string} libraryType - Which library to remove from.
 * @param {string} encodedItem - Encoded playlist item data in JSON.
 */
function removeFromPlaylist(libraryType, encodedItem) {
    removeFromLibrary(libraryType, encodedItem);
    resetMainButtons();
    checkLibrary();
    siteLibraryCorrection();
}

// #endregion



// #region Playlist

/**
 * Method responsible of playing previous video.
 * 
 * @param {Event} event - Event.
 */
function playPreviousVideo(event) {
    event.preventDefault();
    if (currentPlaylistPosition > 0) {
        currentPlaylistPosition--;
        saveVideoPositions(currentPlaylistPosition);
        changeMediaPlayerSrc();
        updatePlaylistContent();
    }
}

/**
 * Method responsible of playing next video.
 * 
 * @param {Event} event - Event.
 */
function playNextVideo(event) {
    event.preventDefault();
    if (currentPlaylistPosition < playlist.length - 1) {
        currentPlaylistPosition++;
        saveVideoPositions(currentPlaylistPosition);
        changeMediaPlayerSrc();
        updatePlaylistContent();
    }
}

/**
 * Method responsible of saving: current- & iterated positions.
 */
function saveVideoPositions(currentPlaylistPosition) {
    let positions = JSON.parse(localStorage.getItem('playlistDetails')) || [];
    positions.push(playlist[currentPlaylistPosition]);
    localStorage.setItem('playlistDetails', JSON.stringify(positions));
    localStorage.setItem('videoPlaylistPosition', JSON.stringify({ position: currentPlaylistPosition}));
}

/**
 * Method responsible of specifically updating playlist.
 */
function updatePlaylistContent(){
    playlistUl.innerHTML = '';
    createLibraryList(JSON.parse(localStorage.getItem(playlistLibraryType)) || [], playlistUl);
}

/**
 * Method responsible of reseting video playlist position.
 */
function resetVideoPlaylistPosition(){
    currentPlaylistPosition = 0;
    localStorage.removeItem('videoPlaylistPosition');
}

// #endregion
