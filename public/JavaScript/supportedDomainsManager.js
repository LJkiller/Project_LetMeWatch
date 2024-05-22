
// #region HTML Manipulation

/**
 * Method responsible of primarily handling supported websites.
 * 
 * @param {Object} domains - Public domains.
 * @param {Object} additionalDomains - Additional domains.
 */
function generateSupportedWebsites(domains, additionalDomains = {}) {
    createListItems(getWebsiteNames(domains), document.querySelector('#supported-domains > ul'));
    createListItems(getWebsiteNames(additionalDomains), document.querySelector('#additional-domains > ul'));
}

/**
 * Method responsible of creating list items for websites.
 * 
 * @param {string[]} domains - Array of website names.
 * @param {HTMLUListElement} area - Area where the items are to be created in.
 */
function createListItems(domains, area) {
    let sortedArray = domains.sort((a, b) => {
        if (a[1] < b[1]) {
            return -1;
        }
        if (a[1] > b[1]) {
            return 1;
        }
        return 0;
    });
    let html = '';
    for (let i = 0; i < sortedArray.length; i++) {
        let [domainClass, domain] = sortedArray[i];
        domainClass.replace('not', '');
        let dot = `<i class="fa-solid ${domainClass} ${domainClass === 'flaired' ? 'fa-fire' : 'fa-circle'}"></i>`;
        let link = `<a href="https://www.${domain}" target="_blank">${capitalizeFirstLetter(domain)}</a>`;
        html += `
            <li>
                ${dot}${link}
            </li>`;
    }
    area.innerHTML = html;
}

/**
 * Method responsible of creating metrics lists.
 * 
 * @param {Array} items - Array of objects containing information to be displayed.
 * @param {HTMLUListElement} location - Ul element where to append list.
 */
function createMetricsList(items, location) {
    let originalColor = 'var(--primary-color)';
    let originalTextColor = 'var(--white)';
    let textColor = originalTextColor, outlineColor = originalTextColor, bottomColor = originalColor, topColor = originalColor;

    let svg = 'circle';
    let html = '';
    items['initialized'] = 0;
    if (Array.isArray(items)) {
        for (let i = 0; i < items.length; i++){
            let item = items[i];
            if (item.url === 'NOT FOUND'){
                continue;
            }
            let urlDomain = `<span class="url-name">${capitalizeFirstLetter(item.domainName)}:</span>`;
            let urlElement = `<a href="${item.url}" target="_blank">${limitText(item.id, textListLimit)}</a>`;

            html += `
                <li>
                    ${createSVGNumber(bottomColor, topColor, textColor, textColor, i + 1, svg)}
                    <span class="date">${item.date[0]}</span>
                    <p class="domain">${urlDomain}${urlElement}</p>
                </li>`
            ;
        }
    } else {
        let objectArray = Object.keys(items)
            .map(key => ({
                key: getWebsiteNames(key),
                value: items[key]
            }))
            .filter(item => item.value >= 1 && item.key !== 'initialized')
            .sort((a, b) => {
                if (a.value !== b.value) return b.value - a.value;
                return a.key.localeCompare(b.key);
            })
            .slice(0, 10)
        ;
        for (let i = 0; i < objectArray.length; i++){
            let item = objectArray[i];
            let uses = `Uses: ${item.value}`;
            let text = getWebsiteNames(item.key);

            let isHighestValue = item.value === objectArray[0].value;
            textColor = isHighestValue ? 'rgba(0,0,0,1)' : originalTextColor;
            outlineColor = isHighestValue ? 'var(--yellow)' : originalTextColor;
            topColor = isHighestValue ? 'var(--yellow)' : originalColor;
            bottomColor = isHighestValue ? 'var(--red)' : originalColor;

            html += `  
                <li>
                    ${createSVGNumber(bottomColor, topColor, textColor, outlineColor, i + 1, svg)}
                    <span>${uses}</span>
                    <a href="https://${item.key}" target="_blank">${text}</a>
                </li>`
            ;
        }
    }
    location.innerHTML = html;
}

/**
 * Method responsible of updating metric list.
 */
function updateMetricLists(){
    let videoLinksArray = getVideoLinksArray()[0] || [];
    let frequentDomainData = JSON.parse(localStorage.getItem('frequentDomainData')) || {};
    let lastVideoSection = document.querySelector(`${metricSelectors.lastVideoId} > .metrics`);
    let mostFrequentSecton = document.querySelector(`${metricSelectors.mostFrequentId} > .metrics`);
    lastVideoSection.innerHTML = '';
    mostFrequentSecton.innerHTML = '';
    createMetricsList(videoLinksArray, lastVideoSection);
    createMetricsList(frequentDomainData, mostFrequentSecton);
}

// #endregion




/**
 * Method responsible of saving frequent domain.
 * 
 * @param {any} domainInput - Domain input to analyze (array or string).
 * @param {string[]} allDomains - Array of all domain names.
 * @param {JSON} previousInfo - Previous data of frequentDomainData.
 */
function saveFrequentDomain(domainInput, allDomains, previousInfo) {
    let dataToSave = previousInfo && previousInfo.initialized === true ? previousInfo : { initialized: false };
    let commandCheck = Array.isArray(domainInput) ? domainInput : [false, ['false']];

    if (!dataToSave.initialized || (commandCheck[0] === false && !dataToSave.initialized)) {
        dataToSave.initialized = true;
        for (let i = 0; i < allDomains.length; i++) {
            let domain = allDomains[i].split('|')[1];
            dataToSave[domain] = dataToSave[domain] ? dataToSave[domain] + 1 : 0;
        }
    }
    
    for (let i = 0; i < allDomains.length; i++) {
        let domain = allDomains[i].split('|')[1];
        if (commandCheck[0]) {
            dataToSave[domain]++;
        } else if (domain === domainInput) {
            dataToSave[domain]++;
        }
    }
    localStorage.setItem('frequentDomainData', JSON.stringify(dataToSave));
}
