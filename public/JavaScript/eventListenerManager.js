
// #region Events

/**
 * Event for initiating media link input management.
 */
document.getElementById('media-link-button').addEventListener('click', function (event) {
    event.preventDefault();
    handleLinkInput(document.getElementById('link-input').value);
});

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

// #endregion



// #region Playlist Events

/**
 * Event for starting playlist.
 */
startPlaylistButton.addEventListener('click', function (event) {
    event.preventDefault();
    iframeControls.classList.add('active');
    startPlaylistButton.classList.remove('active');
    document.getElementById("media-top").scrollIntoView();
    playlist = JSON.parse(localStorage.getItem('playlistLibrary'));
    
    saveVideoPositions(currentVideoNumber);
    changeMediaPlayerSrc();
    if (playlist) {
        document.getElementById('prev-playlist-button').addEventListener('click', playPreviousVideo);
        document.getElementById('next-playlist-button').addEventListener('click', playNextVideo);
    } else {
        console.error('Playlist not found');
    }
});

/**
 * Event for closing iframe-controls for playlist.
 */
exitPlaylistButton.addEventListener('click', function(event){
    event.preventDefault();
    iframeControls.classList.remove('active');
    startPlaylistButton.classList.add('active');

    if (!event.shiftKey) {
        let playlistDetails = JSON.parse(localStorage.getItem('playlistDetails'));
        for (let i = 0; i < playlistDetails.length; i++) {
            removeFromLibrary('playlistLibrary', playlistDetails[i]);
        }
    }
    localStorage.removeItem('playlistDetails');

    let videoLinksArray = getVideoLinksArray();
    mediaPlayer.src = videoLinksArray[1].src;
    videoIdValueSpan.textContent = `VideoID: ${limitText(videoLinksArray[1].id, textListLimit)}`;
    updateMetricLists();
    resetMainButtons();
    checkLibrary();
    siteLibraryCorrection();
    playlist = [];
});

// #endregion



// #region Library Buttons Events

let starButton = document.getElementById('star-button'), addButton = document.getElementById('add-playlist-button');
let qStarButton = document.getElementById('q-star-button'), qAddButton = document.getElementById('q-add-playlist-button');
let starUl = document.querySelector('#starred-videos > ul'), playlistUl = document.querySelector('#playlist > ul');
let starLibraryType = 'starLibrary', playlistLibraryType = 'playlistLibrary';

let buttonConfigs = [
    {
        buttonLocation: starButton,
        ulElement: starUl,
        active: false,
        activeText: 'Starred',
        errorText: 'Error',
        errorDisplayDuration: 500,
        libraryType: starLibraryType
    },
    {
        buttonLocation: addButton,
        ulElement: playlistUl,
        active: false,
        activeText: 'Added',
        errorText: 'Error',
        errorDisplayDuration: 500,
        libraryType: playlistLibraryType
    }
]
let qButtonConfigs = [
    {
        buttonLocation: qStarButton,
        spanElement: qStarButton.querySelector('span'),
        ulElement: starUl,
        active: false,
        defaultText: 'Star',
        activeText: 'Starred',
        errorText: 'Error',
        errorDisplayDuration: 500,
        libraryType: starLibraryType
    },
    {
        buttonLocation: qAddButton,
        spanElement: qAddButton.querySelector('span'),
        ulElement: playlistUl,
        active: false,
        defaultText: 'Add To Playlist',
        activeText: 'Added',
        errorText: 'Error',
        errorDisplayDuration: 500,
        libraryType: playlistLibraryType
    }
];

// Area for attaching events.
for (let i = 0; i < buttonConfigs.length; i++){
    let button = buttonConfigs[i];
    button.buttonLocation.addEventListener('mouseenter', (event) => handleHoverEvent(event, button));
    button.buttonLocation.addEventListener('mouseleave', (event) => handleHoverEvent(event, button));
    button.buttonLocation.addEventListener('click', (event) => handleClickAddEvent(event, button));
}
for (let i = 0; i < qButtonConfigs.length; i++){
    let button = qButtonConfigs[i];
    button.buttonLocation.addEventListener('mouseenter', (event) => handleHoverEvent(event, button));
    button.buttonLocation.addEventListener('mouseleave', (event) => handleHoverEvent(event, button));
    button.buttonLocation.addEventListener('click', (event) => handleClickQAddEvent(event, button));
}

// #endregion



// #region Settings Events

let popup = document.getElementById('popup');
let settingsButton = document.getElementById('settings-button');
let closePopupButton = document.getElementById('close-settings-button');

settingsButton.addEventListener('click', (event) => { openPopup(event, 'settings')});
closePopupButton.addEventListener('click', closePopup);
popup.addEventListener('click', closePopupOutside);
document.getElementById('preference-area').addEventListener('submit', function (event) {
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
 * Method responsible of checking if multiple boxes are checked.
 * 
 * @param {NodeList} checkboxes - All checkboxes in the same area.
 */
function multipleBoxCheck(checkboxes){
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', function(event) {
            disableOtherCheckboxes(checkboxes[i], checkboxes);
        });
    }
}

// #endregion
