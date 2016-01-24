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
            regex = pathToRegexp(route.path, keys),
            matches = regex.exec(pathname),
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

export {route, match};
