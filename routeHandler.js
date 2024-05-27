
import ResponseManager from './methodManagers/responseManager.js';


// #region Handlers
import { handleIndex } from './routeHandlers/indexHandler.js';

// #endregion

/**
 * Method responsible of handling routes for HTTP requests. 
 * Directing routes to appropiate handlers based on pathSegments. 
 * Further actions are dependent on proved information and pathSegments.
 *
 * @async
 * @param {URL} url - URL.
 * @param {string[]} pathSegments - Array representing the segments of the URL.
 * @param {http.IncomingMessage} request - HTTP request.
 * @param {http.ServerResponse} response - HTTP response.
 * @returns {Promise<void>} - Promise that resolves when the routing and handling are complete.
 */
export async function handleRoute(url, pathSegments, request, response) {
    try {
        if (pathSegments.length === 0) {
            handleIndex(url, pathSegments, request, response);
        }
        else if (pathSegments.length <= 2) {
            // Handle other routes based on first segment of pathSegments.
            switch (pathSegments[0]) {
                case 'index':
                    handleIndex(url, pathSegments, request, response);
                    break;
                case 'search':
                    if (request.method === 'GET') {
                        let query = url.searchParams.get('query');
                        if (!query) {
                            ResponseManager.sendWebPageResponse(response, 400, 'text/plain', 'Missing query parameter');
                            return;
                        }

                        try {
                            let youtubeAPIKey = process.env.YOUTUBE_API_KEY;
                            let maxResults = 20;
                            let apiResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${youtubeAPIKey}&part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}`);
                            let data = await apiResponse.json();
                            
                            response.writeHead(200, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify(data));
                        } catch (error) {
                            console.error('Error fetching YouTube data:', error);
                            ResponseManager.sendError(error, 'Error fetching YouTube data');
                        }
                    } else {
                        ResponseManager.sendWebPageResponse(response, 405, 'text/plain', 'Method Not Allowed');
                    }
                    break;
                default:
                    ResponseManager.sendWebPageResponse(response, 404, 'text/plain', '404 Not Found');
                    return;
            }
        } else {
            ResponseManager.sendWebPageResponse(response, 404, 'text/plain', '404 Not Found');
        }
    } catch (error) {
        ResponseManager.sendError('Handling route', error);
    }
}