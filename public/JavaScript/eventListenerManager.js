
// #region Media Events

document.getElementById('media-link-button').addEventListener('click', handleLinkEvent);
document.getElementById('link-form').addEventListener('submit', handleLinkEvent);

/**
 * Method responsible of handling link event.
 * 
 * @param {Event} event - Event. 
 */
function handleLinkEvent(event) {
    event.preventDefault();
    handleLinkInput(document.getElementById('link-input').value);
}

/**
 * Event for checking how many times reset button has been pressed and operates accordingly.
 */
document.getElementById('reset-size-button').addEventListener('click', function () {
    resetVideoSize(pressedButtonForVideoURL !== 0);
    pressedButtonForVideoURL++;
});

/**
 * Event for initating update of media player size.
 */
document.getElementById('update-size-button').addEventListener('click', function (event) {
    event.preventDefault();
    updateVideoSize(document.getElementById('width-input'));
});

/**
 * Method responsible of reseting video size.
 * 
 * @param {boolean} displayAsLastVideo - Boolean for checking if it's displayed as last video.
 */
function resetVideoSize(displayAsLastVideo) {
    updatePlayerDimensions(defaultWidth, defaultHeight);
    saveVideoWidth();
    displayVideoSize();
    displayVideoId(displayAsLastVideo);
}

document.getElementById('video-search-button').addEventListener('click', function (event) {
    event.preventDefault();
    openPopup(event, 'search-video');
});

// #endregion




// #region Playlist Events

/**
 * Event for starting playlist.
 */
startPlaylistButton.addEventListener('click', function (event) {
    event.preventDefault();
    handleStartPlaylist();
});

/**
 * Event for closing iframe-controls for playlist.
 */
exitPlaylistButton.addEventListener('click', function (event) {
    event.preventDefault();
    handleExitPlaylist(event);
});

/**
 * Event for opening edit playlist option.
 */
editPlaylistButton.addEventListener('click', (event) => { openPopup(event, 'edit-playlist') });

/**
 * Event for submitting edit-playlist form (name).
 */
document.querySelector('#edit-playlist .preference-area').addEventListener('submit', function (event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    let newPlaylistName = formData.get('change-playlist-name');
    if (newPlaylistName.length > playlistNameLimit) {
        alert(`Playlist name cannot exceed ${playlistNameLimit} characters.`);
        return;
    }
    localStorage.setItem('playlistName', newPlaylistName);
    updatePlaylistName(newPlaylistName);
    closePopup(event);
    document.getElementById('playlist-name-input').value = '';
});

// #endregion




// #region Library Buttons Events


// Area for attaching events.
for (let i = 0; i < qButtonConfigs.length; i++) {
    let button = qButtonConfigs[i];
    button.buttonLocation.addEventListener('mouseenter', (event) => handleHoverEvent(event, button));
    button.buttonLocation.addEventListener('mouseleave', (event) => handleHoverEvent(event, button));
    button.buttonLocation.addEventListener('click', (event) => handleClickQAddEvent(event, button));
}
for (let i = 0; i < buttonConfigs.length; i++) {
    let button = buttonConfigs[i];
    button.buttonLocation.addEventListener('mouseenter', (event) => handleHoverEvent(event, button));
    button.buttonLocation.addEventListener('mouseleave', (event) => handleHoverEvent(event, button));
    button.buttonLocation.addEventListener('click', (event) => handleClickAddEvent(event, button));
}

// #endregion




// #region Popup Events

/**
 * Event for closing popup.
 */
for (let i = 0; i < closePopupButtons.length; i++) {
    closePopupButtons[i].addEventListener('click', closePopup);
}

// #region Settings Events

addCustomButton.addEventListener('click', () => { displayError('Not a working function', addCustomButton) });
settingsButton.addEventListener('click', (event) => { openPopup(event, 'settings') });
popup.addEventListener('click', closePopupOutside);
document.querySelector('#settings .preference-area').addEventListener('submit', function (event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    let formDataArray = [];
    formData.forEach((value, key) => {
        formDataArray.push({ formInput: key, value: value });
    });
    handleSettingsForm(formDataArray);
    closePopup(event);
    siteSettingsCorrection();
});

/**
 * Method responsible of handling checkbox logics.
 * 
 * @param {NodeList} checkboxes - All checkboxes in the same area.
 * @param {boolean} [limit=false] - If it should limit the box checks.
 */
function handleCheckbox(checkboxes, limit = false) {
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', function (event) {
            if (limit) {
                uncheckOtherBoxes(checkboxes[i], checkboxes);
            }
            updateCheckBox(checkboxes[i]);
        });
    }
}

// #endregion




// #region Search Video Events

/**
 * Event for searching for youtube videos.
 */
document.getElementById('search-button').addEventListener('click', function (event) {
    event.preventDefault();
    let searchBar = document.getElementById('search-bar');
    let searchQuery = searchBar.value;
    searchBar.value = '';
    fetch(`/search?query=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => {
            if (data.error){
                let errorMessage = data.error.message.replace('<a href="/youtube/', '<a target="_blank" href="https://developers.google.com/youtube/');
                searchResultContainer.innerHTML = `<p>${data.error.code}: ${errorMessage}</p>`;
            }
            if (data.items && data.items.length > 0) {
                searchResultData = data;
                itemsPerSearchPage = data.pageInfo.resultsPerPage;
                totalSearchItems = data.pageInfo.totalResults;
                displaySearchResult();
            }
        })
        .catch(error => {
            console.error('Error fetching video data:', error);
            searchResultContainer.innerHTML = '<p>There was an error fetching the video results.</p>';
        })
    ;
    currentSearchPage = 0;
});

// #endregion

// #endregion