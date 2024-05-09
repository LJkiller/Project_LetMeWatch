
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

