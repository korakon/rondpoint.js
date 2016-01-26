import pathToRegexp from 'path-to-regexp';

/*
 * Create a route object
 * This is just a helper function, it only exists to provide a nice syntax
 * for creatings routes
 *
 * @example
 * const routes = [route('/users/:username', () => alert('hello')),
                   route(/*./, () => alert('404'))]
 *
 * @param {string|regex} path - the pattern to match against
 * @param handler function
 * @param options object
 * @returns {object}
 */


function route(pattern, handler, options={}) {
    if (!pattern) {
        throw new Error('Pattern is missing!');
    } else if (!handler) {
        throw new Error('Handler is missing!');
    }
    return {pattern, handler, options};
}

/*
 * Loop through an array of route objects and return one if it matches
 * otherwise returns null.
 * @param {string} pathname
 * @param {[route]} routes - an array of route objects
 * @returns {object|null} - a route object or null
 */

function match(pathname, routes) {
    for (let route of routes) {
        let keys = [],
            pattern = pathToRegexp(route.pattern, keys),
            matches = pattern.exec(pathname),
            params = {};
        if (matches) {
            for (let i = 1; i < matches.length; i++) {
                let key = keys[i - 1];
                params[key.name] = matches[i];
            }

            return {route, params};
        } else {
            return null;
        }
    };
};

// XXX: document this
function isSameOrigin(url) {
    let location = window.location;
    let a = document.createElement('a');

    a.href = url;

    return a.hostname == location.hostname &&
        a.port == location.port &&
        a.protocol == location.protocol;
}


// XXX: document this
function clickable(event, el) {
    if (!event) return false;
    if (!el) return false;
    if (!el.pathname) console.warn(el, 'pathname is empty');

    if (event.defaultPrevented) return false;
    if (el.target) return false;
    if (event.button !== 0) return false;
    if (event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey) return false;
    if (el.tagName.toLowerCase() !== 'a') return false;
    if (!isSameOrigin(el.href)) return false;

    return true;
}

export {route, match, clickable};
