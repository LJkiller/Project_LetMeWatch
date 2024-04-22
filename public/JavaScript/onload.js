
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
    typeof supportedWebsites === 'function' ? supportedWebsites(publicDomains, moreDomains) : supportedLi.innerHTML = '<i class="fa-solid fa-circle"></i>No domains found';
    supportedUl.appendChild(supportedLi);

    siteCorrection();

    let videoLinksArray = JSON.parse(localStorage.getItem('videoLinks')) || [];
    let frequentDomainData = JSON.parse(localStorage.getItem('frequentDomainData')) || {};
    let lastVideoSection = `${metricSelectors.lastVideoId} > .metrics`;
    let mostFrequentSecton = `${metricSelectors.mostFrequentId} > .metrics`;
    createMetricsList(videoLinksArray, document.querySelector(lastVideoSection));
    createMetricsList(frequentDomainData, document.querySelector(mostFrequentSecton));
};

/**
 * Method responsible of checking all locally stored information.
 */
function checkLocalStore() {
    if (localStorage) {
        console.log('LocalStorage Loaded and will display:');
        let results = [];

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let value = localStorage.getItem(key);
            if (key !== null && value !== null) {
                let parsedValue;
                try {
                    parsedValue = JSON.parse(value);
                } catch (error) {
                    parsedValue = value;
                }
                results.push({ key, value: parsedValue });
            } else {
                console.error("Key or value is null");
            }
        }
        console.log(results);
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

/*
ENTER WIDTH FUNCTION NEEDS TO FUNCITON
UPDATE (INSIGHT METRICS) WHEN LINK HAS BEEN PUT IN
*/