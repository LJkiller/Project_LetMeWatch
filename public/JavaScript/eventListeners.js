
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



// #region Like

// Events for hover actions.
likeButton.addEventListener('mouseenter', toggleLikeIcon);
likeButton.addEventListener('mouseleave', toggleLikeIcon);
let isLiked = false;

/**
 * Method responsible for toggling like icon by hover.
 * 
 * @param {Event} event - Event.
 */
function toggleLikeIcon(event) {
    event.preventDefault();
    if (isLiked === false) {
        let likeIcon = likeButton.querySelector('i');
        likeIcon.classList.toggle('fa-regular');
        likeIcon.classList.toggle('fa-solid');
    }
}

/**
 * Event for clicking like button.
 */
likeButton.addEventListener('click', function(event) {
    event.preventDefault();
    isLiked = !isLiked;
    let likeIcon = likeButton.querySelector('i');
    if (isLiked === true){
        console.log('liked');
    } else {
        console.log('disliked');
    }
});






// #endregion
