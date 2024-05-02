
/**
 * Method responsible of primarily handling supported websites.
 * 
 * @param {Object} domains - Public domains.
 * @param {Object} additionalDomains - Additional domains.
 */
function supportedWebsites(domains, additionalDomains = {}) {
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
    for (let i = 0; i < sortedArray.length; i++) {
        let supportedSiteItem = document.createElement('li');
        let dot = document.createElement('i');
        let link = document.createElement('a');

        dot.classList.add('fa-solid', sortedArray[i][0], sortedArray[i][0] === 'flaired' ? 'fa-fire' : 'fa-circle');
        dot.classList.remove('not');

        link.textContent = capitalizeFirstLetter(sortedArray[i][1]);
        link.href = `https://www.${sortedArray[i][1]}`;
        link.target = "_blank";

        supportedSiteItem.append(dot, link);
        area.appendChild(supportedSiteItem);
    }
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
    let textColor = originalTextColor, outlineColor = originalTextColor
        bottomColor = originalColor, topColor = originalColor;

    let svg = 'circle';
    items['initialized'] = 0;
    if (Array.isArray(items)) {
        items.forEach((item, i) => {
            let urlDomain, urlElement;
            if (item.url === 'NOT FOUND') {
                urlDomain = `<span class="url-name">NOT</span>`;
                urlElement = `<span class="url-id">FOUND</span>`;
            } else {
                urlDomain = `<span class="url-name">${capitalizeFirstLetter(getWebsiteName(item.url))}:</span>`;
                urlElement = `<a href="${item.url}" target="_blank">${item.id}</a>`;
            }
            let li = document.createElement('li');
            li.innerHTML = `
                ${createMetricNumber(root, bottomColor, topColor, textColor, textColor, i + 1, svg)}
                <span class="date">${item.date[0]}</span>
                <p class="domain">${urlDomain}${urlElement}</p>
            `;
            location.appendChild(li);
        });
    } else {
        let keys = Object.keys(items)
            .map(key => ({ key, value: items[key] }))
            .sort((a, b) => b.value - a.value)
        ;
        let highestValue = keys.length > 0 ? keys[0].value : 0;
        let text;
        for (let i = 0; i < keys.length; i++) {
            let item = keys[i];
            text = getWebsiteNames(item.key);
            if (item.value >= 1 && item.key !== 'initialized' && i < 10) {
                if (item.value === highestValue) {
                    textColor = 'var(--black)';
                    outlineColor = 'var(--yellow)';
                    topColor = 'var(--yellow)';
                    bottomColor = 'var(--red)';
                } else {
                    textColor = originalTextColor;
                    outlineColor = originalTextColor;
                    topColor = originalColor;
                    bottomColor = originalColor;
                }
                let li = document.createElement('li');
                li.innerHTML = `
                    ${createMetricNumber(root, bottomColor, topColor, textColor, outlineColor, i + 1, svg)}
                    <span>Uses: ${item.value}</span>
                    <a href="https://${item.key}" target="_blank">${text}</a>
                `;
                location.appendChild(li);
            }
        }
    }
}

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
    
    console.log((commandCheck[0]) ? 
        'Everything added by 1' : 'One domain added by 1'
    );
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
