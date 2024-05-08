
// #region Iframe Events

/**
 * Event for initiating media link input management.
 */
document.getElementById('falsified-media-link').addEventListener('submit', function (event) {
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
let addButton = document.getElementById('add-to-playlist-button');
let playlistButtons = [
    {
        buttonType: starButton,
        spanElement: starButton.querySelector('span'),
        ulElement: document.querySelector('#starred-videos > ul'),
        active: false,
        defaultText: 'Star',
        activeText: 'Starred',
        libraryType: 'starLibrary'
    },
    {
        buttonType: addButton,
        spanElement: addButton.querySelector('span'),
        ulElement: document.querySelector('#playlist > ul'),
        active: false,
        defaultText: 'Add To Playlist',
        activeText: 'Added',
        libraryType: 'playlistLibrary'
    }
];

/**
 * Events for hovering.
 */
for (let i = 0; i < playlistButtons.length; i++){
    let button = playlistButtons[i];
    button.buttonType.addEventListener('mouseenter', function(event) {
        event.preventDefault();
        if (!button.active){
            hoverSolidIcon(button.buttonType);
        }
    });
    button.buttonType.addEventListener('mouseleave', function(event) {
        event.preventDefault();
        if (!button.active){
            hoverSolidIcon(button.buttonType);
        }
    });
}

/**
 * Method responsible of hovering over the button to toggle icon.
 * 
 * @param {HTMLButtonElement} location - Button element.
 */
function hoverSolidIcon(location) {
    let icon = location.querySelector('i');
    icon.classList.toggle('fa-regular');
    icon.classList.toggle('fa-solid');

}

/**
 * Event for clicking.
 */
for (let i = 0; i < playlistButtons.length; i++){
    let button = playlistButtons[i];
    button.buttonType.addEventListener('click', function (event) {
        event.preventDefault();
        let videoLinks = getVideoLinksArray();
        let latestVideo = videoLinks[videoLinks.length - 1].url;
        if (!button.active) {
            addToLibrary(button.libraryType, latestVideo);
            (button.spanElement).innerHTML = button.activeText;
            button.active = true;
        } else {
            removeFromLibrary(button.libraryType, latestVideo);
            (button.spanElement).innerHTML = button.defaultText;
            button.active = false;
        }
        let library = JSON.parse(localStorage.getItem(button.libraryType)) || [];
        (button.ulElement).innerHTML = '';
        if (linkRegex.test(latestVideo)) {
            createLibraryList(library, button.ulElement);
        }
    });
}

// #endregion
