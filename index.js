/*
 * This a somewhat of a fork of tj/page.js
 * it differs by not listening to any event
 * eg: popstate, click, etc
 * if you want to use it, you need to bind those events youtself.
 *
 */

var ware = require('ware'),
    pathToRegexp = require('path-to-regexp'),
    EventEmitter = require('events').EventEmitter;

function noop() {};

function Route(path, options) {
    this.path = path;
    this.keys = [];
    if (typeof path == 'string' || path instanceof String) {
        this.regex = pathToRegexp(path, this.keys, options);
    } else {
        this.regex = path;
    }
}

Route.prototype.match = function(path, params) {
    var keys = this.keys,
        matches = this.regex.exec(decodeURIComponent(path));

    if (!matches) return false;

    for (var i = 1; i < matches.length; i++) {
        var key = keys[ i - 1];
        params[key.name] = matches[i];
    }

    return true;
}

Route.prototype.wrap = function(fn) {
    var self = this;
    return function(ctx, next) {
        if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
        next();
    }
}

function Router(options) {
    this.middleware = ware();
    this.options = options;
    this.use = this.middleware.use.bind(this.middleware);
}

Router.prototype = Object.create(EventEmitter.prototype);

Router.prototype.route = function(path, callback) {
    var self = this,
        route = new Route(path, this.options);

    if (Array.isArray(callback)) {
        callback.forEach(function(cb) {
            self.middleware.use(route.wrap(cb));
        });
        return this;
    }
    this.middleware.use(route.wrap(callback));
    return this;
}

Router.prototype.dispatch = function(path, callback) {
    var callback = callback || noop,
        ctx = new Context(path);

    this.emit('dispatch', ctx);
    this.middleware.run(ctx, callback);
}


function Context(path) {
    this.path = path;
    this.params = {};
    // Env is a simple object
    // that routes can use to pass data between them
    this.env = {};
}


module.exports = Router;
