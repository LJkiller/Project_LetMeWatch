

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
function createListItems(domains, area){
    let sortedArray = domains.sort((a, b) => {
        if (a[1] < b[1]) {
            return -1;
        }
        if (a[1] > b[1]) {
            return 1;
        }
        return 0;
    });
    for (let i = 0; i < sortedArray.length; i++){
        let supportedSiteItem = document.createElement('li');
        let dot = document.createElement('i');
        let link = document.createElement('a');

        dot.classList.add('fa-solid', sortedArray[i][0], 
            sortedArray[i][0] === 'flaired' ? 'fa-fire' : 'fa-circle')
        ;

        link.textContent = capitalizeFirstLetter(sortedArray[i][1]);
        link.href = `https://www.${sortedArray[i][1]}`;
        link.target = "_blank";

        supportedSiteItem.append(dot, link);
        area.appendChild(supportedSiteItem);
    }
}