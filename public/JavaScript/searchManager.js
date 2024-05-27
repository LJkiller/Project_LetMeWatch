
// #region HTML Manipulation

/**
 * Method responsible of displaying search result.
 */
function displaySearchResult() {
    searchResultContainer.innerHTML = '';
    let urlSegment = 'https://www.youtube.com/watch?v=';

    let totalSearchesSpan = document.createElement('span');
    totalSearchesSpan.textContent = `Total searches found: ${totalSearchItems}`;
    searchResultContainer.appendChild(totalSearchesSpan);
    
    for (let i = 0; i < searchResultData.items.length; i++) {
        let item = searchResultData.items[i];
        if (item.id.kind.includes('channel')) {
            continue;
        }
        let videoUrl = `${urlSegment}${item.id.videoId}`;
        let playButtonId = `play-video-${i}`;
        let videoCard = document.createElement('div');
        videoCard.classList.add('video-item');
        videoCard.innerHTML = `
            <section class="video-information">
                <img class="video-thumbnail" src="${item.snippet.thumbnails.default.url}" alt="${item.snippet.title}">
                <h3 class="video-title">${item.snippet.title}</h3>
                <span class="video-description"><i>${item.snippet.description}</i></span>
            </section>
            <div class="video-actions">
                <button id="${playButtonId}" class="quick-button">Play Video</button>
                <a class="quick-button" href="${videoUrl}" target="_blank">Open Video</a>
            </div>
        `;
        searchResultContainer.appendChild(videoCard);

        document.getElementById(playButtonId).addEventListener('click', function (event) {
            closePopup(event);
            handleLinkInput(videoUrl);
        });
    }
}

// #endregion