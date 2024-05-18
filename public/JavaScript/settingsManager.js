
// #region Events

/**
 * Method responsible for closing popup.
 * 
 * @param {Event} event - Event.
 */
function closePopup(event) {
    event.preventDefault();
    let activeSections = popup.querySelectorAll('section.active');
    for (let i = 0; i < activeSections.length; i++) {
        activeSections[i].classList.remove('active');
    }
    popup.classList.remove('active');
}

/**
 * Method responsible for opening the popup.
 * 
 * @param {Event} event - Event.
 * @param {string} sectionId - Section id to be displayed.
 */
function openPopup(event, sectionId) {
    event.preventDefault();
    let section = popup.querySelector(`section#${sectionId}`);
    popup.classList.add('active');
    section.classList.add('active');
}

/**
 * Method responsible for closing the popup when clicking outside the settings section.
 * 
 * @param {Event} event - Event.
 */
function closePopupOutside(event) {
    if (!event.target.closest('section')) {
        closePopup(event);
    }
}

/**
 * Method responsible of unchecking other boxes to only allow one checked.
 * 
 * @param {HTMLInputElement} checkedCheckbox - Checkbox that was checked.
 * @param {NodeList} checkboxes - All checkboxes in the same area.
 */
function uncheckOtherBoxes(checkedCheckbox, checkboxes) {
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] !== checkedCheckbox && checkedCheckbox.checked) {
            checkboxes[i].checked = false;
            checkboxes[i].parentElement.classList.remove('box-checked');
        }
    }
}

/**
 * Method responsible of updating the checkbox states.
 * 
 * @param {HTMLInputElement} checkbox - The checkbox.
 */
function updateCheckBox(checkbox){
    if (checkbox.checked) {
        checkbox.parentElement.classList.add('box-checked');
    } else {
        checkbox.parentElement.classList.remove('box-checked');
    }
}

// #endregion



// #region HTML Manipulation

/**
 * Method responsible of creating settings list.
 * 
 * @param {Array} options - Array of options.
 * @param {string} type - String to which html should be generated
 * @param {(string|Array)} settingsValue - Setting(s) that are applied. Can be either a string or an array.
 * @param {HTMLElement} location - HTML location to add the settings list to.
 */
function createSettingsList(options, type, settingsValue, location) {
    switch (type) {
        case themeCase.string:
            location.innerHTML = createHTMLSettingsList(options, type, settingsValue);
            handleCheckbox(location.querySelectorAll('.option'), true);
        case colorCase.string:
            location.innerHTML = createHTMLSettingsList(options, type, settingsValue);
            handleCheckbox(location.querySelectorAll('.option'), true);
            break;
        case playlistCase.string:
            location.innerHTML = createHTMLSettingsList(options, type, settingsValue);
            handleCheckbox(location.querySelectorAll('.option'));
            break;
        case layoutCase.string:
            location.innerHTML = createHTMLSettingsList(options, type, settingsValue);
            handleCheckbox(location.querySelectorAll('.option'));
            break;
        default:
            break;
    }
}

/**
 * Method responsible of creating HTML settings list.
 * 
 * @param {Array} options - Array of options.
 * @param {string} type - String to which html should be generated
 * @param {(string|Array)} settingsValue - Setting(s) that are applied. Can be either a string or an array.
 * @returns {HTMLElement} - HTML element of the list.
 */
function createHTMLSettingsList(options, type, settingsValue) {
    let html = '';
    let text = '';
    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        let checkedOrDefault = '';
        let classCheck = '';
        if (settingsValue !== null) {
            if (Array.isArray(settingsValue)) {
                if (settingsValue.length === 0) {
                    checkedOrDefault = '';
                } else {
                    checkedOrDefault = settingsValue.includes(option) ? 'checked' : '';
                    classCheck = settingsValue.includes(option) ? 'class="box-checked"' : '';
                }
            } else {
                checkedOrDefault = option.includes(settingsValue) ? 'checked' : '';
                classCheck = option.includes(settingsValue) ? 'class="box-checked"' : '';
            }
        }
        let isActive = checkedOrDefault === 'checked' ? '<i>(Active)</i>' : '';

        let displayText = '';
        switch (type) {
            case themeCase.string:
                text = option === themeCase.defaultValue ? themeCase.defaultValue : option;
                displayText = text;
                if (option === 'system-default') {
                    displayText = 'system default';
                }
                html += `
                    <label ${classCheck}>
                        <input type="checkbox" ${checkedOrDefault} name="${text}-theme" id="${text}-theme-option" class="option" style="--checkbox-color: var(--${text}-theme);">
                        ${capitalizeFirstLetter(displayText)} Theme ${isActive}
                        ${checkedOrDefault === 'disabled' ? `<input type="hidden" name="${text}-theme" value=""}>` : ''}
                    </label>`
                    ;
                break;
            case colorCase.string:
                text = option === colorCase.defaultValue ? colorCase.defaultValue : option;
                html += `
                <label ${classCheck}>
                    <input type="checkbox" ${checkedOrDefault} name="primary-color-${text}" id="${text}-option" class="option" style="--checkbox-color: var(--${text});">
                    ${capitalizeFirstLetter(text)} ${isActive}
                    ${checkedOrDefault === 'disabled' ? `<input type="hidden" name="primary-color-${option}" value=""'}>` : ''}
                </label>`
            ;
                break;
            case playlistCase.string:
                text = option;
                if (text === playlistCase.options[0]) {
                    displayText = 'Remove watched entries when exiting.';
                } else if (text === playlistCase.options[1]) {
                    displayText = 'Reset video position when exiting.';
                } else if (text === playlistCase.options[2]) {
                    displayText = 'Switch positions of playlist and starred videos.';
                }
                html += `
                    <label ${classCheck}>
                        <input type="checkbox" ${checkedOrDefault} name="${text}" id="playlist-option-${i}" class="option">
                        ${displayText} ${isActive}
                    </label>
                `;
                break;
            case layoutCase.string:
                text = option;
                if (text === layoutCase.options[0]) {
                    displayText = 'Switch playlist positions.';
                }
                html += `
                    <label ${classCheck}>
                        <input type="checkbox" ${checkedOrDefault} name="${text}" id="layout-option-${i}" class="option">
                        ${displayText} ${isActive}
                    </label>
                `;
                break;
            default:
                break;
        }
    }
    return html;
}

// #endregion



// #region Apply

/**
 * Method responsible of handling settings.
 * 
 * @param {Array} dataArray - Array of data containing objects.
 */
function handleSettingsForm(dataArray) {
    let prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    prefersDarkMode ? document.body.removeAttribute('class') : document.body.className = 'light-theme';
    root.style.setProperty('--primary-color', `var(--${getColor('blue')})`);

    let items = getAllItemsSorted(dataArray);
    applySetting(getActiveValues(items[0]), themeCase.string);
    applySetting(getActiveValues(items[1]), colorCase.string);

    updatePlaylistContent();
    localStorage.setItem('settings', JSON.stringify(dataArray));
    applyContrast();
}

/**
 * Method responsible of applying settings.
 * 
 * @param {string[]} activeCase - What is currently active.
 * @param {string} settingType - String of what case should be applied.
 */
function applySetting(activeCases, settingType) {
    let singleCase = activeCases.length === 1 ? true : false;
    let items = activeCases.length === 1 ? activeCases[0] : activeCases;

    if (singleCase === true) {
        switch (settingType) {
            case themeCase.string:
                if (items === `${themeCase.defaultValue}-theme`) {
                    return;
                } else {
                    items === 'dark-theme' ? document.body.removeAttribute('class') : document.body.className = items;
                }
                break;
            case colorCase.string:
                let color = getColor(items.split('primary-color-')[1]);
                root.style.setProperty('--primary-color', `var(--${color})`);
                break;
            default:
                break;
        }
    }
}

/**
 * Method responsible of getting all data sorted into correct sections.
 * 
 * @param {Array} dataArray - Array containing all different form data. 
 * @returns {Array} - Array of themeItems, colorItems and behaviourItems.
 */
function getAllItemsSorted(dataArray) {
    let themeItems = [];
    let colorItems = [];
    let behaviourItems = [];
    let layoutItems = [];
    for (let i = 0; i < dataArray.length; i++) {
        let item = dataArray[i];
        if (item.formInput.includes(themeCase.string)) {
            themeItems.push(item);
        } else if (item.formInput.includes(colorCase.string)) {
            colorItems.push(item);
        } else if (item.formInput.includes(behaviourCase.string)) {
            behaviourItems.push(item);
        } else if (item.formInput.includes(layoutCase.string)) {
            layoutItems.push(item);
        }
    }
    return [themeItems, colorItems, behaviourItems, layoutItems];
}

/**
 * Method responsible of getting active values.
 * 
 * @param {Array} items - Array of objects to get filtered out.
 * @returns {Array} - Array of active settings.
 */
function getActiveValues(items) {
    let activeElement = [];
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.value === 'on') {
            activeElement.push(item.formInput);
        }
    }
    return activeElement;
}

// #endregion
