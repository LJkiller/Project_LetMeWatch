
// #region Events

/**
 * Method responsible for closing popup.
 * 
 * @param {Event} event - Event.
 */
function closePopup(event){
    event.preventDefault();
    let activeSections = popup.querySelectorAll('section.active');
    for (let i = 0; i < activeSections.length; i++){
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
function openPopup(event, sectionId){
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
function closePopupOutside(event){
    if (!event.target.closest('section')) {
        closePopup(event);
    }
}

/**
 * Method responsible of disabling other checkboxes in the same area.
 * 
 * @param {HTMLInputElement} checkedCheckbox - Checkbox that was checked.
 * @param {NodeList} checkboxes - All checkboxes in the same area.
 */
function disableOtherCheckboxes(checkedCheckbox, checkboxes) {
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] !== checkedCheckbox) {
            checkboxes[i].disabled = checkedCheckbox.checked;
            if (!checkedCheckbox.checked) {
                checkboxes[i].disabled = false;
            }
        }
    }
}

// #endregion



// #region HTML Manipulation

/**
 * Method responsible of creating settings list.
 * 
 * @param {Array} options - Array of options.
 * @param {string} type - String to which html should be generated
 * @param {string} settingsValue - Setting that is applied.
 * @param {HTMLElement} location - HTML location to add the settings list to.
 */
function createSettingsList(options, type, settingsValue, location){
    switch (type){
        case settingsCase.themeCase.string:
            location.innerHTML = createHTMLSettingsList(options, type, settingsValue);
            multipleBoxCheck(location.querySelectorAll('.option'));
            break;
        case settingsCase.colorCase.string:
            location.innerHTML = createHTMLSettingsList(options, type, settingsValue);
            multipleBoxCheck(location.querySelectorAll('.option'));
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
 * @param {string} settingsValue - Setting that is applied.
 * @returns {HTMLElement} - HTML element of the list.
 */
function createHTMLSettingsList(options, type, settingsValue) {
    let html = '';
    let defaultValue = '';
    let text = '';
    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        let checkedOrDisabled = option.includes(settingsValue) ? 'checked': 'disabled';
        let isCurrent = checkedOrDisabled === 'checked' ? '<i>(Current)</i>' : '';
        switch (type) {
            case settingsCase.themeCase.string:
                defaultValue = 'dark';
                text = option === defaultValue ? 'dark' : option;
                html += `<label><input type="checkbox" ${checkedOrDisabled} name="${text}-theme" id="${text}-theme-option" class="option" style="--checkbox-color: var(--${text}-theme);">${capitalizeFirstLetter(text)} Mode ${isCurrent}</label>`;
                break;
            case settingsCase.colorCase.string:
                defaultValue = 'blue';
                text = option === defaultValue ? 'blue' : option;
                html += `<label><input type="checkbox" ${checkedOrDisabled} name="primary-color-${option}" id="${option}-option" class="option" style="--checkbox-color: var(--${option});">${capitalizeFirstLetter(text)} ${isCurrent}</label>`;
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
    root.style.setProperty('--primary-color', 'var(--blue)');
    document.body.removeAttribute('class');
    for (let i = 0; i < dataArray.length; i++) {
        let key = dataArray[i].formInput;
        if (key.includes(settingsCase.themeCase.string)) {
            handleSetting(settingsCase.themeCase.string, key, key.includes(settingsCase.themeCase.string));
        }
        if (key.includes(settingsCase.colorCase.string)) {
            handleSetting('color', key, key.includes(settingsCase.colorCase.string));
        }
    }
    localStorage.setItem('settings', JSON.stringify(dataArray));
}

/**
 * Method responsible for changing the website's theme or primary color.
 * 
 * @param {string} settingType - Type of setting to handle ('theme' or 'color').
 * @param {string} settingValue - Value of the setting.
 * @param {boolean} [setAsNewValue=false] - Boolean to check if it is to be added as a new value.
 */
function handleSetting(settingType, settingValue, setAsNewValue = false) {
    switch (settingType) {
        case settingsCase.themeCase.string:
            document.body.className = setAsNewValue === true ? settingValue : '';
            break;
        case settingsCase.colorCase.string:
            let color = settingValue.split('primary-color-')[1];
            if (document.body.classList.contains('light-theme')){
                color = `dark-${settingValue.split('primary-color-')[1]}`;
            }
            root.style.setProperty('--primary-color', setAsNewValue === true ? `var(--${color})` : 'var(--blue)');
            break;
        default:
            break;
    }
}

// #endregion
