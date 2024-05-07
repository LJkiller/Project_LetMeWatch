
/**
 * Method responsible for checking if an item exists.
 * 
 * @param {string[]} array - Array of already existing items.
 * @param {string} newItem - New item to compare.
 * @returns {boolean} - If item exists or not.
 */
function itemExistsInList(list, item) {
    return list.some(obj => obj.url === item);
}

/**
 * Method responsible of checking the libraries to properly style buttons.
 */
function checkLibrary() {
    let videoLinks = JSON.parse(localStorage.getItem('videoLinks')) || [];
    let latestVideo = videoLinks.length > 1 ? videoLinks[videoLinks.length -1].url : '';
    for (let i = 0; i < playlistButtons.length; i++){
        let button = playlistButtons[i];
        let library = JSON.parse(localStorage.getItem(button.libraryType)) || [];
        if (itemExistsInList(library, latestVideo)) {
            activateButtonIcon(button.buttonType.querySelector('i'));
            button.spanElement.innerHTML = 'Starred';
            button.active = true;
        }
    }
}

/**
 * Method responsible of adding new item to library.
 * 
 * @param {string} libraryType - Which library to add to.
 * @param {string} newItem - Item to add.
 */
function addToLibrary(libraryType, newItem){
    let library = JSON.parse(localStorage.getItem(libraryType)) || [];
    library = library.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.url === item.url && t.id === item.id
        ))
    );
    let [_, id, url] = extractMediaInfo(newItem);

    let savedObject = {
        url: url,
        id: id
    };

    library.push(savedObject);
    localStorage.setItem(libraryType, JSON.stringify(library));
}

/**
 * Method responsible for removing items from library.
 * 
 * @param {string} libraryType - Which library to remove from.
 * @param {string} newItem - Item to remove.
 */
function removeFromLibrary(libraryType, item) {
    let library = JSON.parse(localStorage.getItem(libraryType)) || [];
    library = library.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.url === item.url && t.id === item.id
        ))
    );
    let indexToRemove = library.findIndex(libraryItem => 
        libraryItem.url === item
    );
    if (indexToRemove !== -1) {
        library.splice(indexToRemove, 1);
        localStorage.setItem(libraryType, JSON.stringify(library));
    }
}


/**
 * Method responsible of resetting main buttons.
 */
function resetMainButtons() {
    for (let i = 0; i < playlistButtons.length; i++){
        playlistButtons[i].spanElement.innerHTML = playlistButtons[i].defaultText;
        playlistButtons[i].active = false;
        resetButtonIcon(playlistButtons[i].buttonType);
    }
}

/**
 * Method responsible of resetting button element.
 * 
 * @param {HTMLButtonElement} button - Button element to reset.
 */
function resetButtonIcon(button) {
    let icon = button.querySelector('i');
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
 * @param {HTMLElement} icon - Icon to activate.
 */
function activateButtonIcon(icon) {
    icon.classList.toggle('fa-regular');
    icon.classList.toggle('fa-solid');
}

/**
 * Method responsible of creating library list.
 * 
 * @param {string[]} library - Library of added items.
 * @param {HTMLUListElement} location - Location to append list.
 */
function createLibraryList(library, location) {
    let originalColor = getComputedStyle(root).getPropertyValue('--blue');
    let originalTextColor = getComputedStyle(root).getPropertyValue('--white');
    let textColor = originalTextColor, bottomColor = originalColor, topColor = originalColor;

    let maxIteration = 8, iterations = 0;
    let html = '';
    for (let i = 0; i < library.length && i < maxIteration; i++) {
        iterations++;
        let item = library[i];
        let domainName = capitalizeFirstLetter(getWebsiteName(item.url));
        let urlElement = `<a href="${item.url}" target="_blank">${limitText(item.id, textListLimit)}</a>`;
        html += `
            <li>
                ${createSVGNumber(root, bottomColor, topColor, textColor, textColor, i + 1, 'circle')}
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