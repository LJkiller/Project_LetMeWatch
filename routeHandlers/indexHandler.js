
import fs from 'fs/promises';
import ResponseManager from '../methodManagers/responseManager.js';

/**
 * Method responsible of handling the index page request. 
 * Logging the route, reading index template, replacing placeholders with content, 
 * and sending web page response.
 *
 * @async
 * @param {URL} url - URL.
 * @param {string[]} pathSegments - Array representing the segments of the URL.
 * @param {http.IncomingMessage} request - HTTP request.
 * @param {http.ServerResponse} response - HTTP response.
 * @returns {Promise<void>} - A Promise that resolves when the handling is complete.
 */
export async function handleIndex(url, pathSegments, request, response){
    let route = 'index';
    ResponseManager.sendPageRoute(route);

    try{
        let template = (await fs.readFile('templates/html.watch')).toString();
        let indexHead = (await fs.readFile('templates/index/head.watch')).toString();
        let indexBody = (await fs.readFile('templates/index/body.watch')).toString();
    
        template = template
            .replaceAll('{construct:head}', indexHead)
            .replaceAll('{construct:body}', indexBody)
        ;

        ResponseManager.sendWebPageResponse(response, 200, 'text/html', template);
        return;
    } catch(error){
        ResponseManager.sendError('Reading file', error);
        ResponseManager.sendWebPageResponse(response);
        return;
    }
}