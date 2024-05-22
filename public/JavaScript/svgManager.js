
/**
 * Method responsible of creating the SVG number for a metrics list.
 * 
 * @param {string} bottomColor - Color of the bottom part.
 * @param {string} topColor - Color of the top part.
 * @param {string} textColor - Color of the text.
 * @param {string} outlineColor - Color of the outline for the shape.
 * @param {number} iteration - Number used as text for SVG.
 * @param {string} elementCase - Additional parameter for special SVG creation.
 * @returns {string} - The SVG markup as a string.
 */
function createSVGNumber(bottomColor, topColor, textColor, outlineColor, iteration, elementCase) {
    let areaSize = parseFloat(getComputedStyle(root).getPropertyValue('--svg-dot-size'));
    let svg = createSvgElement('svg', {
        'width': areaSize,
        'height': areaSize
    });

    let gradientId = 'gradient-' + Math.random().toString(36).substr(2, 9);
    let defs = createSvgElement('defs', {});
    let linearGradient = createLinearGradient(gradientId, bottomColor, topColor);
    let shape = createShape(areaSize, gradientId, outlineColor, elementCase);
    let text = createText(iteration, textColor);

    defs.appendChild(linearGradient);
    svg.appendChild(defs);
    svg.appendChild(shape);
    svg.appendChild(text);
    return svg.outerHTML;
}

/**
 * Method responsible of creating a specified SVG element.
 * 
 * @param {string} tagName - What SVG element is to be created. 
 * @param {Object} attributes - Object containing key-value pairs of attributes for the SVG element.
 * @returns {SVGElement} - The SVG element.
 */
function createSvgElement(tagName, attributes) {
    let svgNS = 'http://www.w3.org/2000/svg';
    let element = document.createElementNS(svgNS, tagName);
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    return element;
}

/**
 * Method responsible of creating linear gradient color schemes.
 * 
 * @param {string} gradientId - ID of the gradient used to fill the shape.
 * @param {string} bottomColor - Color of the bottom part.
 * @param {string} topColor - Color of the top part.
 * @returns {SVGLinearGradientElement} - Constructed lineargradient element as SVG.
 */
function createLinearGradient(gradientId, bottomColor, topColor) {
    let linearGradient = createSvgElement('linearGradient', {
        'id': gradientId,
        'x1': '0%',
        'y1': '100%',
        'x2': '0%',
        'y2': '0%'
    });

    let stop1 = createSvgElement('stop', {
        'offset': '0%',
        'stop-color': bottomColor
    });
    let stop2 = createSvgElement('stop', {
        'offset': '100%',
        'stop-color': topColor
    });
    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop2);
    return linearGradient;
}

/**
 * Method responsible of creating the shape.
 * 
 * @param {number} areaSize - Size of the area for the shape.
 * @param {string} gradientId - ID of the gradient used to fill the shape.
 * @param {string} outlineColor - Outline color. 
 * @param {string} elementCase - Additional parameter for special cases.
 * @returns {SVGElement} - Consturcted shape element as SVG.
 */
function createShape(areaSize, gradientId, outlineColor, elementCase) {
    let shape;
    switch (elementCase) {
        case '':
            break;
        default:
            let shadow = createSvgElement('circle', {
                'cx': areaSize / 2,
                'cy': areaSize / 2,
                'r': '50%',
                'fill': outlineColor,
                'opacity': '1'
            });
            shape = createSvgElement('circle', {
                'cx': areaSize / 2,
                'cy': areaSize / 2,
                'r': '40%',
                'stroke': 'none',
                'fill': `url(#${gradientId})`
            });

            let group = createSvgElement('g');
            group.appendChild(shadow);
            group.appendChild(shape);
            return group;
    }
    return shape;
}

/**
 * Method responsible of creating the text for the cirlce.
 * 
 * @param {number} iteration - Number used as text for SVG.
 * @param {string} textColor - Color of the text.
 * @returns {SVGTextElement} - Constructed text element as SVG.
 */
function createText(iteration, textColor) {
    let isDeca = iteration >= 10
    let decaPosX = isDeca ? '46%': '50%';
    let decaSize = isDeca ? '75%': '80%';
    let text = createSvgElement('text', {
        'x': decaPosX,
        'y': '56%',
        'dominant-baseline': 'middle',
        'text-anchor': 'middle',
        'font-weight': 'bold',
        'font-size': decaSize,
        'fill': textColor
    });
    text.textContent = iteration;
    return text;
}
