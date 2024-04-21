
let domains = {
    'flaired|www.youtube.com|youtu.be': {
        //https://www.youtube.com/watch?v=PEvURuyHcXM
        //https://youtu.be/PEvURuyHcXM?si=LQ1x4Q4DTbGMI4nP
        //https://www.youtube.com/embed/PEvURuyHcXM?si=LQ1x4Q4DTbGMI4nP
        //https://youtube.com/shorts/NuK3TqEhnkI?si=ido3nB9MMWW3IrRy
        regexes: [
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
            /youtu\.be\/([^?]+)/i,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/i
        ],
        iframeSrc: 'https://www.youtube-nocookie.com/embed/{urlId}?start=0&autoplay=1&autohide=1'
    },
    'not|www.bitchute.com': {
        // https://www.bitchute.com/video/ckcUQuvc5w5S/
        // https://www.bitchute.com/embed/ckcUQuvc5w5S/
        regexes: [
            /(?:https?:\/\/)?(?:www\.)?bitchute\.com\/video\/(\w+)\/?/,
            /(?:https?:\/\/)?(?:www\.)?bitchute\.com\/embed\/(\w+)\/?/
        ],
        iframeSrc: 'https://www.bitchute.com/embed/{urlId}/'
    },
    'not|www.dailymotion.com|dai.ly': {
        // https://www.dailymotion.com/video/x8j4r2e
        // https://dai.ly/x8j4r2e
        regexes: [
            /(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/video\/(\w+)/,
            /https?:\/\/dai\.ly\/(\w+)/,
        ],
        iframeSrc: 'https://www.dailymotion.com/embed/video/{urlId}?autoplay=1'
    }
};