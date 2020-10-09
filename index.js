import { ContentTransformer, ProfileChildElementsTransformer, links } from './element-rewriters'

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

const rewriter = new HTMLRewriter()
    .on('*', new ContentTransformer())
    .on('div#profile > h1#name', new ProfileChildElementsTransformer())
    .on('div#profile > img#avatar', new ProfileChildElementsTransformer())

const handleRequest = async (request) => {

    const url = new URL(request.url);

    if (url.pathname === '/links') {
        return await handleLinksRequest();
    }
    
    return await handleStaticPageRequest();
}

const handleLinksRequest = async () => {

    const serialized_links = JSON.stringify(links);

    // I'm using the fact that a JS string is just a special case 
    // of type USVString.
    return new Response(serialized_links, {
        headers: {
            'content-type': 'application/json; charset=UTF-8'
        },
    })
};

const handleStaticPageRequest = async () => {

    // I made the (very) generous assumption this static page will never go down 
    // (as it is backed by Cloudflare), but if I had to check for errors, I would
    // have added a `.catch` to this method. Omitted purely for readability.
    const base = await fetch('https://static-links-page.signalnerve.workers.dev')
    const modified_base = rewriter.transform(base)

    return new Response(await modified_base.text(), {
        headers: {
            'content-type': 'text/html; charset=UTF-8'
        },
    })
}