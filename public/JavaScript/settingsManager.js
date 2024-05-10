
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

// #endregion

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




/**
 * Method responsible of handling settings.
 * 
 * @param {Array} dataArray - Array of data containing objects.
 */
function handleSettingsForm(dataArray) {
    root.style.setProperty('--primary-color', 'var(--blue)');
    document.body.className = '';
    for (let i = 0; i < dataArray.length; i++) {
        let key = dataArray[i].formInput;
        if (key.includes('theme')) {
            handleSetting('theme', key, key.includes('theme'));
        }
        if (key.includes('color')) {
            handleSetting('color', key, key.includes('color'));
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
        case 'theme':
            document.body.className = setAsNewValue === true ? settingValue : '';
            break;
        case 'color':
            let color = settingValue.split('primary-color-')[1];
            root.style.setProperty('--primary-color', setAsNewValue === true ? `var(--${color})` : 'var(--blue)');
            break;
        default:
            break;
    }
}
