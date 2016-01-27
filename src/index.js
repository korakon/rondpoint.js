import pathToRegexp from 'path-to-regexp';

/*
 * A lot of code is copied from
 * https://github.com/rackt/react-router-redux
 * Big thanks to all the contributors
 */


/*
 * Constants
 */

/*
 * This is used to keep the history in sync with the store.
 * react-router-redux subscribes to the store itself, with rondpoint you
 * yourself manage the subscription to rackt/history
 * @example:
 * const history = createHistory();
 * history.listen((location) => store.dispatch(sync(location, params)));
 * see ./examples/hello for an example.
 */

export const SYNC = '@@rondpoint/SYNC';
export const TRANSITION = '@@rondpoint/TRANSITION';

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


export function route(pattern, handler, options={}) {
    if (!pattern) {
        throw new Error('Pattern is missing!');
    } else if (!handler) {
        throw new Error('Handler is missing!');
    } else if (!options) {
        options = {};
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

export function match(pathname, routes) {
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
        }
    };
};

/*
 * Checks if a url is from the same origin
 * @param {string} url
 * @returns {bool}
 */

function isSameOrigin(url) {
    let location = window.location;
    let a = document.createElement('a');

    a.href = url;

    return a.hostname == location.hostname &&
        a.port == location.port &&
        a.protocol == location.protocol;
}

/*
 * Checks if a click event should trigger a transition.
 * @param {Event} event
 * @param {Element} el
 * @return {bool}
 * @example
 * if (clickable(event, el)) store.dispatch(push(event.target.pathname));
 * see examples/hello for more info.
 */

export function clickable(event, el) {
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

function transition(method) {
  return arg => ({
    type: TRANSITION,
    payload: { method, arg }
  });
}

export const push = transition('push');
export const replace = transition('replace');
export const go = transition('go');
export const back = transition('goBack');
export const forward = transition('goForward');

export function sync(location, params) {
    return {
        type: SYNC,
        payload: {
            location,
            params
        }
    };
}

const initialState = {
    pathname: '/',
    params: {},
    query: {},
    hash: ''
}

export const middleware = history => store => next => action => {
    if (action.type === SYNC) {
        const { payload: { method, arg } } = action;
        history[method](arg);
    }
    next(action);
};

export function reducer(state=initialState, action) {
    switch (action.type) {
    case SYNC:
        const {location, params} = action.payload;
        return {...state,
                ...location,
                params: {...params}};
    default:
        return state;
    }
};

export const actions = { push, replace, go, forward, back};
