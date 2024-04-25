
window.onload = function () {
    let videoWidth = localStorage.getItem('videoWidth');
    if (typeof videoWidth === 'undefined' || videoWidth === null) {
        resetVideoSize(false);
    }
    displayVideoSize();
    displayVideoId();

    siteSavedCorrection();
    siteDomainsCorrection();
    siteStyleCorrection();
    siteMetricsCorrection();
};

/**
 * Method responsible of correcting HTML on the site by provided information.
 */
function siteSavedCorrection(){
    let storedWidth = localStorage.getItem('videoWidth');
    let storedVideoID = localStorage.getItem('videoId');
    let storedVideoLink = localStorage.getItem('videoLink');
    let storedVideoSource = localStorage.getItem('videoSource');

    if (storedWidth) {
        restoreIframeSize(playerIframe, storedWidth);
    }

    document.getElementById('video-id').innerHTML = `<span style="color: var(--darker-gray);">LastVideoID:</span> ${storedVideoID} : `;
    document.getElementById('video-link').href = storedVideoLink;
    document.getElementById('falsified-media-player').src = storedVideoSource;
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
 * Method responsible of correcting HTML and CSS of domains sections.
 */
function siteDomainsCorrection(){
    if (typeof additionalDomains !== 'undefined' && typeof additionalMediaInfo === 'function'){
        document.querySelector('#additional-domains>h2').textContent = 'Additional Domains';
        document.getElementById('supported-domains').style.gridArea = 'supported-domains';
    }
    let publicDomains = typeof domains !== 'undefined' ? domains : {};
    let moreDomains = typeof additionalDomains !== 'undefined' ? additionalDomains : {};
    
    let supportedUl = document.querySelector('#supported-domains > ul');
    let supportedLi = document.createElement('li');
    supportedLi.style.marginLeft = 'calc(var(--standard-spacing) * 2)';
    typeof supportedWebsites === 'function' ? supportedWebsites(publicDomains, moreDomains) : supportedLi.innerHTML = '<i class="fa-solid fa-circle"></i>No domains found';
    supportedUl.appendChild(supportedLi);
}

/**
 * Method responsible of correcting some CSS issues.
 */
function siteStyleCorrection(){
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
 * Method responsible of generating and correcting HTML in the metrics sections.
 */
function siteMetricsCorrection(){
    let videoLinksArray = JSON.parse(localStorage.getItem('videoLinks')) || [];
    let frequentDomainData = JSON.parse(localStorage.getItem('frequentDomainData')) || {};
    let lastVideoSection = `${metricSelectors.lastVideoId} > .metrics`;
    let mostFrequentSecton = `${metricSelectors.mostFrequentId} > .metrics`;
    createMetricsList(videoLinksArray, document.querySelector(lastVideoSection));
    createMetricsList(frequentDomainData, document.querySelector(mostFrequentSecton));
}
