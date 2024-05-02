
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
            'https://www.youtube.com/shorts/qdGatFkber8'
        ],
        regexes: [
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
            /youtu\.be\/([^?]+)/i,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/i
        ],
        iframeSrc: 'https://www.youtube-nocookie.com/embed/{urlId}?start=0&autoplay=1&autohide=1'
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
        iframeSrc: 'https://www.bitchute.com/embed/{urlId}/'
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
        iframeSrc: 'https://www.dailymotion.com/embed/video/{urlId}?autoplay=1'
    }
};

let commands = {
    cmdList: ['commands', 'command', 'cmds', 'cmd'],
    example: ['videoexample', "videoex", "example", 'ex'],
    localClear: ['localclear', 'localreset', 'clear', 'reset', 'clr'],
    localStorage: ['localstorage', 'localstore', 'storage', 'store', 'check', 'str'],
    localFill: ['localfill', 'fill', 'fl'],
    localTest: ['localtest', 'test']
}