
window.onload = function () {
    let videoWidth = localStorage.getItem('videoWidth');
    if (!videoWidth) {
        resetVideoSize(false);
    }
    displayVideoSize();
    displayVideoId();

    siteSavedCorrection(videoWidth);
    siteDomainsCorrection();
    siteStyleCorrection();
    siteMetricsCorrection();
};

/**
 * Method responsible of correcting HTML on the site by provided information.
 * 
 * @param {number} width - Width of the iframe.
 */
function siteSavedCorrection(width){
    let videoLinks = JSON.parse(localStorage.getItem('videoLinks')) || [];
    let latestLink = videoLinks.length ? videoLinks[videoLinks.length - 1] : { id: 'NOT FOUND', url: 'NOT FOUND', src: 'NOT FOUND'};
    if (width) {
        restoreIframeSize(playerIframe, width);
    }

    document.getElementById('video-id').innerHTML = `<span style="color: var(--darker-gray);">LastVideoID:</span> ${latestLink.id} : `;
    document.getElementById('video-link').href = latestLink.url;
    document.getElementById('falsified-media-player').src = latestLink.src;
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

    // Update iframe dimensions.
    playerIframe.width = storedWidth;
    playerIframe.height = calculatedHeight;
}

/**
 * Method responsible of correcting HTML and CSS of domains sections.
 */
function siteDomainsCorrection(){
    let additionalDomainsHTML = document.getElementById('additional-domains');
    if (typeof additionalDomains !== 'undefined' && typeof additionalMediaInfo === 'function'){
        additionalDomainsHTML.querySelector('h2').textContent = 'Additional Domains';
        document.getElementById('supported-domains').style.gridArea = 'supported-domains';
    } else {
        additionalDomainsHTML.style.display = 'none';
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
    createMetricsList(videoLinksArray, document.querySelector(`${metricSelectors.lastVideoId} > .metrics`));
    createMetricsList(frequentDomainData, document.querySelector(`${metricSelectors.mostFrequentId} > .metrics`));
}
