
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
            activateButtonIcon(button.buttonLocation.querySelector('i'));
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
        let domainName = capitalizeFirstLetter(item.domainName);
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