
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
  * Method responsible of formatting dates.
  * 
  * @param {Date} currentDate - The current date/time.
  * @returns {Array} - Formatted variations of the current date/time and numerical value.
  */
function formatDate(currentDate) {
    let year = currentDate.getUTCFullYear();
    let month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
    let day = currentDate.getUTCDate().toString().padStart(2, '0');
    let hour = currentDate.getUTCHours().toString().padStart(2, '0');
    let minute = currentDate.getUTCMinutes().toString().padStart(2, '0');
    let second = currentDate.getUTCSeconds().toString().padStart(2, '0');

    return [`${year}-${month}-${day} ${hour}:${minute}:${second}`, currentDate.getTime()];
}

/**
  * Method responsible of capitalizing first letters of words.
  * 
  * @param {string} input - Input string to be capitalized first letter. 
  * @returns {string} - Capitalized first letter in each word.
  */
function capitalizeFirstLetter(input) {
    if (typeof input !== 'string' || input.trim() === '') {
        return input; 
    }
    return input.replace(/(?:^|\s|-|_)\w/g, function (char) {
        return char.toUpperCase();
    });
}

/**
 * Method responsible of getting the website names into an array.
 * 
 * @param {any} domains - An object with mutliple websites to be stored in an array.
 * @returns {string[]} - Array of website names, domain state and domain url. 
 */
function getWebsiteNames(domains) {
    if (typeof domains === 'string'){
        return domains.includes('www.') ? capitalizeFirstLetter(domains.split('www.')[1]) : capitalizeFirstLetter(domains);
    }
    return Object.keys(domains).map(domain => {
        let domainState = domain.includes('|') ? domain.split('|')[0] : domain;
        let cleanDomain = domain.includes('|') ? domain.split('|')[1] : domain;
        let parsedDomain = cleanDomain.includes('www.') ? cleanDomain.split('www.')[1] : cleanDomain;
        return [domainState, parsedDomain, cleanDomain];
    });
}

/**
 * Method responsible if a command is a function.
 * 
 * @param {string} command - Input to compare with existing commands. 
 * @returns {Array} - Boolean and an array containing the commands.
 */
function isCommand(command){
    for (let key in commands) {
        for (let i = 0; i < commands[key].length; i++){
            if (commands[key][i] === command){
                return [true, commands[key]];
            }
        }
    }
    return [false, command];
}

/**
 * Method responsible of getting all domain examples.
 * 
 * @returns {string[]} - Array of strings of domain examples.
 */
function getAllDomainExamples() {
    let allExamples = [];
    let combinedDomains = { 
        ...(typeof domains !== 'undefined' ? domains : {}), 
        ...(typeof additionalDomains !== 'undefined' ? additionalDomains : {}) 
    };

    for (let domain of Object.values(combinedDomains)) {
        allExamples.push(...(domain.examples || []));
    }
    return allExamples;
}

/**
 * Method responsible of getting a random value out of an array.
 * 
 * @param {Array} array - Array of elements. 
 * @returns {any} - A random example.
 */
function getRandomValue(array) {
    return array[Math.floor(Math.random() * array.length)];
}