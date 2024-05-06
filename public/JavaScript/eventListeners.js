
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

let starActive = false, addToPlaylistActive = false;

// #region Hover

starButton.addEventListener('mouseenter', function(event) {
    event.preventDefault();
    if (!starActive){
        hoverSolidIcon(starButton);
    }
});
starButton.addEventListener('mouseleave', function(event) {
    event.preventDefault();
    if (!starActive){
        hoverSolidIcon(starButton);
    }
});

addToPlaylistButton.addEventListener('mouseenter', function(event) {
    event.preventDefault();
    if (!addToPlaylistActive){
        hoverSolidIcon(addToPlaylistButton);
    }
});
addToPlaylistButton.addEventListener('mouseleave', function(event) {
    event.preventDefault();
    if (!addToPlaylistActive){
        hoverSolidIcon(addToPlaylistButton);
    }
});

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

// #endregion

// #region Click

/**
 * Event for clicking star button.
 */
starButton.addEventListener('click', function(event) {
    event.preventDefault();
    if (!starActive) {
        addToLibrary('starLibrary', videoLinkHTML.href);
        starSpan.innerHTML = 'Starred';
        starActive = true;
    } else {
        removeFromLibrary('starLibrary', videoLinkHTML.href);
        starSpan.innerHTML = 'Star';
        starActive = false;
    }
    let starLibrary = JSON.parse(localStorage.getItem('starLibrary')) || [];
    let location = document.querySelector(`#starred-videos > .videos`);
    location.innerHTML = '';
    if (!videoLinkHTML.href.includes('NOT%20FOUND')) {
        createLibraryList(starLibrary, location);
    }
});

/**
 * Event for clicking add to playlist.
 */
addToPlaylistButton.addEventListener('click', function(event) {
    event.preventDefault();
    if (!addToPlaylistActive) {
        addToLibrary('playlistLibrary', videoLinkHTML.href);
        addSpan.innerHTML = 'Added';
        addToPlaylistActive = true;
    } else {
        removeFromLibrary('playlistLibrary', videoLinkHTML.href);
        addSpan.innerHTML = 'Add To Playlist';
        addToPlaylistActive = false;
    }
    let playlistLibrary = JSON.parse(localStorage.getItem('playlistLibrary')) || [];
    let location = document.querySelector(`#playlist > .videos`);
    location.innerHTML = '';
    if (!videoLinkHTML.href.includes('NOT%20FOUND')) {
        createLibraryList(playlistLibrary, location);
    }
});

// #endregion

// #endregion
