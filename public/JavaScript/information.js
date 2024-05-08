
// #region Setup
let root = document.documentElement;

let mediaPlayer = document.getElementById('falsified-media-player');

let startPlaylistButton = document.getElementById('start-playlist-button');
let exitPlaylistButton = document.getElementById('exit-playlist-button');
let iframeControls = document.getElementById('iframe-controls');

let videoIdValueSpan = document.getElementById('video-id');

let baseWidth = 560;
let baseHeight = 315;
// Scale factor to get to 1280 & 720px.
let scaleFactor = 2.28571428571428580944;
let aspectRatio = baseWidth / baseHeight;

let defaultWidth = baseWidth * scaleFactor;
let defaultHeight = baseHeight * scaleFactor;

let pressedButtonForVideoURL = 0;

let textListLimit = 9;

let linkRegex = /^(http|https|ftp|ssh|telnet|smtp|imap|dns|snmp|ntp|ldap|sftp|ftps|smtps|webdav|rtsp|bittorrent):\/\/[^\s/$.?#].[^\s]*$/i;
// #endregion

let metricSelectors = {
    lastVideoId: '#last-viewed-video',
    mostFrequentId: '#frequent-domain-uses'
};

let domains = {
    'flaired|www.youtube.com|youtu.be': {
        examples: [
            'https://www.youtube.com/watch?v=PEvURuyHcXM',
            'https://youtu.be/PEvURuyHcXM?si=LQ1x4Q4DTbGMI4nP',
            'https://www.youtube.com/embed/PEvURuyHcXM?si=LQ1x4Q4DTbGMI4nP',
            'https://www.youtube.com/shorts/qdGatFkber8',
            'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi'
        ],
        regexes: [
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?list=([^&?/]+)/i,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
            /youtu\.be\/([^?]+)/i,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/i
        ],
        iframeSrc: [
            'https://www.youtube-nocookie.com/embed/{urlId}?start=0&autoplay=1&autohide=1', 
            'https://www.youtube.com/embed/videoseries?list={urlId}'
        ]
    },
    'not|www.bitchute.com': {
        examples: [
            'https://www.bitchute.com/video/ckcUQuvc5w5S/',
            'https://www.bitchute.com/embed/ckcUQuvc5w5S/'
        ],
        regexes: [
            /(?:https?:\/\/)?(?:www\.)?bitchute\.com\/video\/(\w+)\/?/,
            /(?:https?:\/\/)?(?:www\.)?bitchute\.com\/embed\/(\w+)\/?/
        ],
        iframeSrc: ['https://www.bitchute.com/embed/{urlId}/']
    },
    'not|www.dailymotion.com|dai.ly': {
        examples: [
            'https://www.dailymotion.com/video/x8j4r2e',
            'https://dai.ly/x8j4r2e'
        ],
        regexes: [
            /(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/video\/(\w+)/,
            /https?:\/\/dai\.ly\/(\w+)/,
        ],
        iframeSrc: ['https://www.dailymotion.com/embed/video/{urlId}?autoplay=1']
    }
};

let commands = {
    cmdList: ['commands', 'command', 'cmds', 'cmd'],
    example: ['videoexample', "videoex", "example", 'ex'],
    loop: ['looptest', 'forloop', 'loop'],
    localClear: ['localclear', 'localreset', 'clear', 'reset', 'clr'],
    localStorage: ['localstorage', 'localstore', 'storage', 'store', 'check', 'str'],
    localFill: ['localfill', 'fill', 'fl'],
    localTest: ['localtest', 'test']
}