
// #region Events

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
function handleClickQAddEvent(event, buttonConfig){
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
function handleClickAddEvent(event, buttonConfig) {
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

// #endregion



// #region HTML Manipulation

/**
 * Method responsible of resetting main buttons.
 */
function resetMainButtons() {
    for (let i = 0; i < qButtonConfigs.length; i++){
        qButtonConfigs[i].spanElement.innerHTML = qButtonConfigs[i].defaultText;
        qButtonConfigs[i].active = false;
        resetButtonIcon(qButtonConfigs[i].buttonLocation);
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

    let maxIteration = 8, iterations = 0;
    let html = '';
    for (let i = 0; i < library.length && i < maxIteration; i++) {
        iterations++;
        let item = library[i];
        let domainName = capitalizeFirstLetter(item.domainName);
        let urlElement = `<a href="${item.url}" target="_blank">${limitText(item.id, textListLimit)}</a>`;
        html += `
            <li>
                ${createSVGNumber(bottomColor, topColor, textColor, textColor, i + 1, 'circle')}
                <span>${domainName}:</span>
                ${urlElement}
            </li>`
        ;
    }
    if (library.length > iterations){
        html += `
            <li class="display-more">
                <span>${library.length - iterations} More Items...</span>
                <button class="quick-button">Display More</button>
            </li>`
        ;
    }
    location.innerHTML = html;
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
    for (let i = 0; i < qButtonConfigs.length; i++){
        let button = qButtonConfigs[i];
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
    let [_, id, url] = extractMediaInfo(newItem);
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
    let library = JSON.parse(localStorage.getItem(libraryType)) || [];
    let indexToRemove = library.findIndex(libraryItem => 
        libraryItem.domainName === item.domainName && libraryItem.id === item.id
    );
    if (indexToRemove !== -1) {
        library.splice(indexToRemove, 1);
        localStorage.setItem(libraryType, JSON.stringify(library));
    }
}

// #endregion



// #region Playlist

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

// #endregion