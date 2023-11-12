const playerIframe = document.getElementById('falsifiedMediaPlayer');
const widthInput = document.getElementById('widthInput');
const heightValueSpan = document.getElementById('heightValue');
const widthValueSpan = document.getElementById('widthValue');

const baseWidth = 426;
const baseHeight = 240;
const scaleFactor = 3;

let defaultWidth = baseWidth*scaleFactor;
let defaultHeight = baseHeight*scaleFactor;
let aspectRatio = defaultWidth/defaultHeight;

function updateVideoSize() {
    const newWidth = parseInt(widthInput.value);

    if (isNaN(newWidth)) {
        return;
    }

    const newHeight = Math.round(newWidth / aspectRatio);

    updatePlayerDimensions(newWidth, newHeight);
    saveVideoValue(playerIframe.width);
    displaySizeValues();
    widthInput.value = '';
}

function resetVideoSize() {
    updatePlayerDimensions(defaultWidth, defaultHeight);
    saveVideoValue();
    displaySizeValues();
}

function updatePlayerDimensions(width, height) {
    playerIframe.width = width;
    playerIframe.height = height;
}

function saveVideoValue(width = defaultWidth) {
    localStorage.setItem('videoWidth', width);
}

function displaySizeValues() {
    let storedWidth = localStorage.getItem('videoWidth');
    let storedHeight = Math.round(storedWidth / aspectRatio);

    heightValueSpan.textContent = `Height: ${storedHeight}`;
    widthValueSpan.textContent = `Width: ${storedWidth}`;
}

displaySizeValues();

function extractVideoId(link) {
    const watchPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const shortPattern = /https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/;
    const watchMatch = link.match(watchPattern);
    const shortMatch = link.match(shortPattern);
    const videoId = watchMatch ? watchMatch[1] : (shortMatch ? shortMatch[1] : null);

    return videoId;
}

function extractAndSetVideo(event) {
    event.preventDefault();
    const linkInput = document.getElementById('linkInput').value;
    const iframeSrc = `https://www.youtube-nocookie.com/embed/${extractVideoId(linkInput)}?start=0&autoplay=1&autohide=1`;

    if (iframeSrc) {
        console.log('Updated iframe src:', iframeSrc);
        playerIframe.src = iframeSrc;
        document.getElementById('linkInput').value = '';
    } else {
        console.error('Invalid YouTube link');
    }
}
