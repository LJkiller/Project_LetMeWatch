
// #region Iframe Events

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



// #region Iframe Controller Events


/**
 * Event for starting playlist.
 */
startPlaylistButton.addEventListener('click', function(event){
    event.preventDefault();
    iframeControls.classList.add('active');
    startPlaylistButton.classList.remove('active');
    document.getElementById("media-top").scrollIntoView();
});

/**
 * Event for closing iframe-controls for playlist.
 */
exitPlaylistButton.addEventListener('click', function(event){
    event.preventDefault();
    iframeControls.classList.remove('active');
    startPlaylistButton.classList.add('active');
});



/**
 * Event for playing previous video.
 */
document.getElementById('prev-playlist-button').addEventListener('click', function(event){
    event.preventDefault();
    console.log('back');
});

/**
 * Event for playing next video.
 */
document.getElementById('next-playlist-button').addEventListener('click', function(event){
    event.preventDefault();
    console.log('forward');
});

// #endregion



// #region Library Buttons

let starButton = document.getElementById('star-button');
let qAddButton = document.getElementById('q-add-playlist-button');
let addButton = document.getElementById('add-playlist-button');
let playlistButtonConfigs = [
    {
        buttonLocation: starButton,
        spanElement: starButton.querySelector('span'),
        ulElement: document.querySelector('#starred-videos > ul'),
        active: false,
        defaultText: 'Star',
        activeText: 'Starred',
        libraryType: 'starLibrary'
    },
    {
        buttonLocation: qAddButton,
        spanElement: qAddButton.querySelector('span'),
        ulElement: document.querySelector('#playlist > ul'),
        active: false,
        defaultText: 'Add To Playlist',
        activeText: 'Added',
        libraryType: 'playlistLibrary'
    }
];
let addButtonConfig = {
    buttonLocation: addButton,
    ulElement: document.querySelector('#playlist > ul'),
    active: false,
    libraryType: 'playlistLibrary'
};

// Area for attaching events.
addButtonConfig.buttonLocation.addEventListener('mouseenter', (event) => handleHoverEvent(event, addButtonConfig));
addButtonConfig.buttonLocation.addEventListener('mouseleave', (event) => handleHoverEvent(event, addButtonConfig));
addButtonConfig.buttonLocation.addEventListener('click', (event) => handleAddPlaylistEvent(event, addButtonConfig));
for (let i = 0; i < playlistButtonConfigs.length; i++){
    let button = playlistButtonConfigs[i];
    button.buttonLocation.addEventListener('mouseenter', (event) => handleHoverEvent(event, button));
    button.buttonLocation.addEventListener('mouseleave', (event) => handleHoverEvent(event, button));
    button.buttonLocation.addEventListener('click', (event) => handleClickEvent(event, button));
}

/**
 * Method responsible of handling hover events.
 * 
 * @param {Event} event - Event. 
 * @param {object} button - Button configs. 
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
 * @param {object} button - Button configs. 
 */
function handleClickEvent(event, buttonConfig){
    event.preventDefault();
    let videoLinks = getVideoLinksArray();
    let latestVideo = videoLinks[videoLinks.length - 1];
    if (!buttonConfig.active) {
        addToLibrary(buttonConfig.libraryType, latestVideo.url);
        (buttonConfig.spanElement).innerHTML = buttonConfig.activeText;
        buttonConfig.active = true;
    } else {
        removeFromLibrary(buttonConfig.libraryType, latestVideo);
        (buttonConfig.spanElement).innerHTML = buttonConfig.defaultText;
        buttonConfig.active = false;
    }
    let library = JSON.parse(localStorage.getItem(buttonConfig.libraryType)) || [];
    (buttonConfig.ulElement).innerHTML = '';
    if (linkRegex.test(latestVideo.url)) {
        createLibraryList(library, buttonConfig.ulElement);
    }
}

function handleAddPlaylistEvent(event, buttonConfig) {
    event.preventDefault();
    let linkElement = document.getElementById('link-input');
    let linkInput = linkElement.value;
    linkElement.value = '';
    
    if (isGibberish(linkInput)){
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
}


// #endregion
