
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
 * Method responsible of getting the website names into an array.
 * 
 * @param {Object} domains - An object with mutliple websites to be stored in an array.
 * @returns {string[]} - Array of website names, domain state and domain url. 
 */
function getWebsiteNames(domains) {
    return Object.keys(domains).map(domain => {
        let domainState = domain.includes('|') ? domain.split('|')[0] : domain;
        let cleanDomain = domain.includes('|') ? domain.split('|')[1] : domain;
        let parsedDomain = cleanDomain.includes('www.') ? cleanDomain.split('www.')[1] : cleanDomain;
        return [domainState, parsedDomain, cleanDomain];
    });
}

/**
  * Method responsible of capitalizing first letters of words.
  * 
  * @param {string} input - Input string to be capitalized first letter. 
  * @returns {string} - Capitalized first letter in each word.
  */
function capitalizeFirstLetter(input) {
    return input.replace(/(?:^|\s|-|_)\w/g, function (char) {
        return char.toUpperCase();
    });
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

        dot.classList.add('fa-solid', sortedArray[i][0],
            sortedArray[i][0] === 'flaired' ? 'fa-fire' : 'fa-circle')
            ;
        dot.classList.remove('not');


        link.textContent = capitalizeFirstLetter(sortedArray[i][1]);
        link.href = `https://www.${sortedArray[i][1]}`;
        link.target = "_blank";

        supportedSiteItem.append(dot, link);
        area.appendChild(supportedSiteItem);
    }
}

/**
  * Method responsible of formatting dates.
  * 
  * @param {Date} currentDate - The current date/time.
  * @returns {Array} - Formatted variations of the current date/time.
  */
function formatDate(currentDate) {
    let year = currentDate.getUTCFullYear();
    let month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
    let day = currentDate.getUTCDate().toString().padStart(2, '0');
    let hour = currentDate.getUTCHours().toString().padStart(2, '0');
    let minute = currentDate.getUTCMinutes().toString().padStart(2, '0');
    let second = currentDate.getUTCSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

/**
 * Method responsible of saving frequent domain.
 * 
 * @param {string} domainName - Domain name to analyze.
 * @param {string[]} allDomains - Array of all domain names.
 * @param {JSON} previousInfo - Previous data of frequentDomainData.
 */
function saveFrequentDomain(domainName, allDomains, previousInfo) {
    let dataToSave = {
        initialized: false
    };

    if (previousInfo && previousInfo.initialized) {
        dataToSave = previousInfo;
    }

    if (!dataToSave.initialized) {
        dataToSave.initialized = true;
        for (let i = 0; i < allDomains.length; i++) {
            let domain = allDomains[i].split('|')[1];
            if (dataToSave[domain]) {
                dataToSave[domain]++;
            } else {
                dataToSave[domain] = 0;
            }
        }
    }

    for (let i = 0; i < allDomains.length; i++){
        if (allDomains[i].includes(domainName)){
            dataToSave[domainName]++;
            break;
        }
    }

    let jsonData = JSON.stringify(dataToSave);
    localStorage.setItem('frequentDomainData', jsonData);
}