// I made this top-level on the premise this is server-side code
// and thus does not pose a security issue if not wrapped inside 
// a function context.
const links = [{
        "name": "Cloudflare",
        "url": "https://cloudflare.com"
    },
    {
        "name": "StackOverflow",
        "url": "https://stackoverflow.com/users/2271269/akshat-mahajan"
    },{
        "name": "Lichess",
        "url": "https://lichess.org/@/CaptainAxe"
    }, {
        "name": "Quora",
        "url": "https://www.quora.com/profile/Akshat-Mahajan-1"
    }
]

/* 
   General-purpose class to rewrite arbitrary elements. The selector for this 
   class is '*'. All elements are inspected and transformed by this class is 
   matched. The one exception is children below  div#profile, for which 
   `ProfileChildElementsTransformer` exists, as this class does not validate
   child relationships prior to transforming.
 */
class ContentTransformer {
    constructor() {}

    element(element) {

        const handler = {
            'div': this.divHandler,
            'title': this.titleHandler,
            'body': this.bodyHandler,
        }

        if (element.tagName in handler) {
            return handler[element.tagName](element)
        } 

        return element
    }

    titleHandler(title) {
        title.setInnerContent('Akshat Mahajan');
        return title;
    }

    bodyHandler(body) {
        body.setAttribute('class', 'bg-blue-900');
        return body;
    }

    divHandler(div) {
        if (div.getAttribute('id') === 'links') {
            links.map(link => div.append(`<a href="${link.url}">${link.name}</a>`, {'html': true}))
            return div;
        }

        if (div.getAttribute('id') === 'social') {
            div.setAttribute('style', '');

            const linkedin_icon = `<image href="https://simpleicons.org/icons/linkedin.svg" height="20" width="20"/>`
            div.append(`<a href="https://www.linkedin.com/in/mahajanakshat/"><svg>${linkedin_icon}</svg></a>`, {'html': true})

            const facebook_icon = `<image href="https://simpleicons.org/icons/instagram.svg" height="20" width="20"/>`
            div.append(`<a href="https://www.instagram.com/zombie_before_teatime/"><svg>${facebook_icon}</svg></a>`, {'html': true})

            return div;
        }

        if (div.getAttribute('id') === 'profile') {
           div.setAttribute('style', '') 
        }

        return div;
    }

}

/* 
   This class exists to rewrite content under div#profile. This cannot be handled
   by ContentTransformer, which does not validate for child relationships in its 
   selector. 
 */
class ProfileChildElementsTransformer {
    constructor() {}

    element(element) {

        const handler = {
            'h1': this.h1Handler,
            'img': this.imgHandler,
        }

        if (element.tagName in handler) {
            return handler[element.tagName](element)
        } 

        return element
    }

    // no need to verify if this matches h1#name - selector in HTMLRewriter
    // has taken care of this for us. 
    h1Handler(h1) {
        h1.setInnerContent('Akshat Mahajan');
        return h1;
    }

    // no need to verify if this matches img#avatar - selector in HTMLRewriter
    // has taken care of this for us. 
    imgHandler(img) {
        const profile_picture = 'https://avatars1.githubusercontent.com/u/6730980?s=460&u=86ebe519aad5bd9c02346a0ff6181193c0437560&v=4'
        img.setAttribute('src', profile_picture);
        return img;
    }

}

module.exports = {
    'ProfileChildElementsTransformer': ProfileChildElementsTransformer,
    'ContentTransformer': ContentTransformer,
    'links': links
};