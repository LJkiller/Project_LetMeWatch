
// #region General Methods

/**
 * Method responsible of checking all locally stored information.
 */
function checkLocalStorage() {
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
 * Method responsible of analyzing an input if it's gibberish or not.
 * 
 * @param {string} input - input to analyze.
 * @returns {boolean} - True or false if it's gibberish or not.
 */
function isGibberish(input) {
    if (!input || input.length < 2) {
        return true;
    }
    if (linkRegex.test(input)) {
        return false;
    }
    let specialCharactersRatio = input.replace(/[a-z0-9]/gi, '').length / input.length;
    if (specialCharactersRatio > 0.5) {
        return true;
    }

    let frequentCharacters = {};
    for (let i = 0; i < input.length; i++) {
        let char = input[i];
        if (!/[a-z0-9]/i.test(char)) {
            continue;
        }

        if (frequentCharacters[char]) {
            frequentCharacters[char].intFrequency++;
            frequentCharacters[char].positions.push(i);
        } else {
            frequentCharacters[char] = {
                intFrequency: 1,
                positions: [i]
            };
        }
    }

    for (let char in frequentCharacters) {
        if (frequentCharacters[char].intFrequency > 3) {
            console.log('Too Frequent.');
            return true;
        }
    
        let positions = frequentCharacters[char].positions;
        let consecutivePositions = 0;
        for (let i = 1; i < positions.length; i++) {
            if (positions[i] === positions[i - 1] + 1) {
                consecutivePositions++;
                if (consecutivePositions >= 2) {
                    console.log('Too Frequent in Positions.');
                    return true;
                }
            } else {
                consecutivePositions = 0;
            }
        }
    }
    return false;
}

/**
 * Method responsible of limiting a text input.
 * 
 * @param {string} input - Text to reformat.
 * @param {number} charLimit - Character limit of the text.
 * @returns {string} - Limited text.
 */
function limitText(input, charLimit){
    return `${input.slice(0, charLimit)}${input.length > charLimit ? '...': ''}`
}

/**
 * Method responsible of repeating continous task.
 * 
 * @param {number} interval - Time interval between command executions: ms.
 * @param {number} limit - Maximum amount of iterations.
 * @param {Function} command - Function to repeat.
 */
function executeAtInterval(interval, limit, command) {
    let counter = 0;
    let intervalId = setInterval(() => {
        if (counter < limit) {
            command();
            counter++;
        } else {
            clearInterval(intervalId);
            console.log(`Loop completed: ${limit} iterations & ${interval * limit / 1000} seconds`);
        }
    }, interval);
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

/**
 * Method responsible of getting appropriate color dependent on theme.
 * 
 * @param {string} color - The color.
 * @returns {string} - Themed color.
 */
function getColor(color){
    return document.body.classList.contains('light-theme') ? `dark-${color}` : color;
}

/**
 * Method responsible of scrolling into an area.
 * 
 * @param {string} areaId - Area to scroll to. 
 */
function scrollToArea(areaId){
    let area = document.getElementById(areaId);
    area.scrollIntoView();
    if (area.tagName.toLowerCase() === 'input'){
        area.focus();
    }
}

// #endregion


/**
 * Method responsible of getting a link's domain name.
 * 
 * @param {string} link - Link to analyze and get domain name.
 * @returns {string} - Domain name.
 */
function getWebsiteName(link, domains = []) {
    let returnValue = link.includes('www.') ? 
        link.split('www.')[1].split('/')[0] : link.split('://')[1].split('/')[0]
    ;
    if (returnValue.split('.').length > 2){
        let splitArray = returnValue.split('.');
        splitArray.shift();
        returnValue = splitArray.join('.');
    }

    if (domains.length > 0){
        let parsedDomains = [];
        for (let i = 0; i < domains.length; i++) {
            let domain = domains[i];
            let parts = domain.split('|');
            if (parts.length >= 2) {
                let parsedDomain = parts.slice(1).join('|');
                parsedDomains.push(parsedDomain.includes('www.') ? parsedDomain.replace('www.', '') : parsedDomain);
            }
        }
        let input = getWebsiteName(link);
        for (let i = 0; i < parsedDomains.length; i++) {
            let domain = parsedDomains[i];
            if (input === domain || input === domain.split('|')[1]) {
                returnValue = input === domain ? domain : domain.split('|')[0];
                break;
            }
        }
    }
    
    return returnValue;
}
/**
 * Method responsible of getting the website names into an array.
 * 
 * @param {any} domains - An object with mutliple websites to be stored in an array.
 * @returns {string[]} - Array of website names, domain state and domain url. 
 */
function getWebsiteNames(domains) {
    if (typeof domains === 'string') {
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
 * Method responsible of getting videoLinks array.
 * 
 * @returns {array} - Array containing videoLinks and latestVideo.
 */
function getVideoLinksArray(){
    let videoLinksArray = JSON.parse(localStorage.getItem('videoLinks')) || [{id: 'NOT FOUND', src: 'NOT FOUND', url: 'NOT FOUND'}];
    let latestVideo = videoLinksArray[videoLinksArray.length - 1];
    return [videoLinksArray, latestVideo];
}

/**
 * Method responsible if a command is a function.
 * 
 * @param {string} command - Input to compare with existing commands. 
 * @returns {Array} - Boolean and an array containing the commands.
 */
function isCommand(command) {
    for (let key in commands) {
        for (let i = 0; i < commands[key].length; i++) {
            if (commands[key][i] === command) {
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
 * Method responsible of displaying error messages.
 * 
 * @param {string} causeOfError - Error message to be displayed.
 * @param {HTMLElement} [location=undefined] - Error location of where it occured.
 */
function displayError(causeOfError, location = undefined){
    let locationInformationArea = errorPopup.querySelector('div>span');
    locationInformationArea.textContent = '';
    toggleElements([popup, errorPopup]);
    
    errorPopup.querySelector('div>p').textContent = causeOfError;
    if (location !== undefined){
        let locationInformation = `<br>${capitalizeFirstLetter(location.tagName.toLowerCase())}:<br> ${location.textContent}`;
        locationInformationArea.innerHTML = locationInformation;
    }
}

/**
 * Method responsible of toggling elements.
 * 
 * @param {Array} elementsToToggle - Elements to toggle.
 */
function toggleElements(elementsToToggle){
    for (let i = 0; i < elementsToToggle.length; i++){
        if (elementsToToggle[i].classList.contains('active')){
            elementsToToggle[i].classList.remove('active');
        } else {
            elementsToToggle[i].classList.add('active');
        }
    }
}

/**
 * Method responsible of adding color contrast.
 */
function applyContrast(){
    let primaryColor = root.style.getPropertyValue('--primary-color').trim();
    let isLightColor = false;
    let isDarkThemed = true;
    if (document.body.getAttribute('class')) {
        isDarkThemed = false;
    } 

    let formButtons = document.querySelectorAll('button.form-button');
    let quickButtons = document.querySelectorAll('button.quick-button');
    let formInputs = document.querySelectorAll('input.form-input');
    let elements = [...formButtons, ...quickButtons, ...formInputs];    
    if (isDarkThemed === true){
        for (let i = 0; i < lightColors.length; i++){
            if (primaryColor.includes(lightColors[i])){
                isLightColor = true;
                break;
            }
        }

        for (let i = 0; i < elements.length; i++){
            if (isLightColor){
                elements[i].classList.add('apply-contrast');
            } else {
                elements[i].classList.remove('apply-contrast');
            }
        }
    }
}