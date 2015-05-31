var expect = require('chai').expect,
    Router = require('../');


describe('Rondpoint', function() {
    describe('route', function() {
        it('should add a new route', function(n) {
            var r = new Router();
            r.route('/meow', function(ctx) {
                expect(ctx.path).to.equal('/meow');
                n();
            });
            r.dispatch('/meow');
        });

        it('should transform path to regexp', function(n) {
            var r = new Router();

            r.route('/users/:id/:action', function(ctx, next) {
                ctx.params.meow = 1;
                expect(ctx.params.id).to.equal('234');
                next();
            });

            r.route('/users/:id/:action', function(ctx, next) {
                expect(ctx.params.id).to.equal('234');
                n();
            });

            r.dispatch('/users/234/edit');
        });

        it('should accept multiple callbacks', function(n) {
            var r = new Router();
            r.route('/meow', [
                function(ctx, next) {
                    ctx.called = true;
                    next();
                },
                function(ctx, next) {
                    expect(ctx.called).to.equal(true);
                    n();
                }]);
            r.dispatch('/meow');
        });
    });

    describe('next', function() {
        it('should allow async routes', function(n) {
            var r = new Router(),
                called;
            r.route('/meow', function(path, next) {
                setTimeout(function() {
                    called = true;
                    next();
                }, 10);
            });

            r.route('/meow', function(path) {
                expect(called).to.equal(true);
                n();
            });

            r.dispatch('/meow');
        });

        it('should stop if error is passed', function(n) {
            var r = new Router(),
                err = new Error('meowed loud!');

            r.route('/meow', function(path, next) {
                next(err);
            });

            r.route('/meow', function(path) {

            });

            r.dispatch('/meow', function(error) {
                expect(error).to.equal(err);
                n();
            });
        });

    });

    describe('dispatch', function() {
        it('should redirect in middle of routing', function(n) {
            var r = new Router();

            r.route('/admin', function(ctx, next) {
                n();
            });

            r.route('/login', function(ctx) {
                r.dispatch('/admin');
            });

            r.dispatch('/admin');
        });
    });
});
