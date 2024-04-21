
window.onload = function () {
    //checkLocalStore();

    let playerIframe = document.getElementById('falsified-media-player');
    let videoIdValueSpan = document.getElementById('video-id');
    let videoLink = document.getElementById('video-link');

    let storedWidth = localStorage.getItem('videoWidth');
    let storedVideoID = localStorage.getItem('videoId');
    let storedVideoSource = localStorage.getItem('videoSource');
    let storedVideoLink = localStorage.getItem('videoLink');

    if (storedWidth) {
        restoreIframeSize(playerIframe, storedWidth);
    }

    // Update videoID.
    videoIdValueSpan.innerHTML = `<span style="color: var(--darker-gray);">LastVideoID:</span> ${storedVideoID} : `;
    // Update videoLink.
    videoLink.href = storedVideoLink;
    // Update videoSrc.
    playerIframe.src = storedVideoSource;
    
    if (typeof additionalDomains !== 'undefined' && typeof additionalMediaInfo === 'function'){
        document.querySelector('#additional-domains>h2').textContent = 'Additional Domains';
    }
    let publicDomains = typeof domains !== 'undefined' ? domains : {};
    let moreDomains = typeof additionalDomains !== 'undefined' ? additionalDomains : {};
    
    let supportedUl = document.querySelector('#supported-domains > ul');
    let supportedLi = document.createElement('li');
    supportedLi.style.marginLeft = 'calc(var(--standard-spacing) * 2)';
    typeof supportedWebsites === 'function' ? supportedWebsites(publicDomains, moreDomains) : 
        supportedLi.innerHTML = '<i class="fa-solid fa-circle"></i>No domains found';
    supportedUl.appendChild(supportedLi);

    siteCorrection();

    let selectors = {
        lastVideoId: '#last-viewed-video',
        mostFrequentId: '#frequent-domain-uses'
    };
    let videoLinksArray = JSON.parse(localStorage.getItem('videoLinks')) || [];
    let frequentDomainData = JSON.parse(localStorage.getItem('frequentDomainData')) || {};
    let lastVideoSection = `footer #site-insight div>section${selectors.lastVideoId} > .metrics`;
    let mostFrequentSecton = `footer #site-insight div>section${selectors.mostFrequentId} > .metrics`;
    createMetricsList(videoLinksArray, document.querySelector(lastVideoSection));
    createMetricsList(frequentDomainData, document.querySelector(mostFrequentSecton));
};

/**
 * Method responsible of checking all locally stored information.
 */
function checkLocalStore() {
    if (localStorage) {
        console.log('LocalStorage Loaded and will display:');
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let value = localStorage.getItem(key);
            // Check if key and value are not null
            if (key !== null && value !== null) {
                console.log(key + ' => ' + value);
            } else {
                console.error("Key or value is null");
            }
        }
    } 
}

/**
 * Method responsible of restoring iframe size.
 * 
 * @param {HTMLIFrameElement} playerIframe - Iframe to be handled.
 * @param {number} storedWidth - Stored iframe width to be updated.
 */
function restoreIframeSize(playerIframe, storedWidth) {
    let baseWidth = 426;
    let baseHeight = 240;
    let aspectRatio = baseWidth / baseHeight;
    let calculatedHeight = storedWidth / aspectRatio;

    //Update iframe dimensions
    playerIframe.width = storedWidth;
    playerIframe.height = calculatedHeight;
}

/**
 * Method responsible of correcting some CSS issues.
 */
function siteCorrection(){
    // Style correction of footer height.
    // Why? Because CSS is weird.
    document.querySelector('body > footer').style.height = `auto`;

    let siteCopy = document.getElementById('site-info-copy');
    let website = document.createElement('a');
    website.href = 'https://letmewatch-dammit.com';
    website.textContent = 'LetMeWatch-DAMMIT';
    siteCopy.append(website);
}

/**
 * Method responsible of creating metrics lists.
 * 
 * @param {Array} items - Array of objects containing information to be displayed.
 * @param {HTMLUListElement} location - Ul element where to append list.
 */
function createMetricsList(items, location) {
    let root = document.documentElement;
    let originalColor = getComputedStyle(root).getPropertyValue('--blue');
    let originalTextColor = getComputedStyle(root).getPropertyValue('--white');
    let textColor = originalTextColor;
    let topColor = originalColor;
    let bottomColor = originalColor;

    let svg = 'circle';
    items['initialized'] = 0;
    Array.isArray(items) ? items.forEach((item, i) => {
        let li = document.createElement('li');
        li.innerHTML = `
            ${createMetricNumber(root, bottomColor, topColor, textColor, i + 1, svg)}
            <span>${item.date}</span>
            <a href="${item.url}" target="_blank">${item.url}</a>
        `;
        if (item.url === 'NOT FOUND'){
            li.innerHTML = `
                ${createMetricNumber(root, bottomColor, topColor, textColor, i + 1, svg)}
                <span>${item.date}</span>
                <span>${item.url}</span>
            `;
        }
        location.appendChild(li);
    }) : Object.keys(items)
        .map(key => ({ key, value: items[key] }))
        .sort((a, b) => b.value - a.value)
        .forEach((item, i) => {
            if (item.value >= 1 && item.key !== 'initialized' && i < 10) {
                if (i === 0){
                    textColor = 'var(--black)';
                    topColor = 'var(--yellow)';
                    bottomColor = 'var(--red)';
                } else {
                    textColor = originalTextColor;
                    topColor = originalColor;
                    bottomColor = originalColor;
                }
                let li = document.createElement('li');
                li.innerHTML = `
                    ${createMetricNumber(root, bottomColor, topColor, textColor, i + 1, svg)}
                    <span>Uses: ${item.value}</span>
                    <a href="${item.key}" target="_blank">${item.key}</a>
                `;
                location.appendChild(li);
            }
        });
}