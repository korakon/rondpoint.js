import {expect} from 'chai';
import {route, match} from '../';

const routes = [
    route('/', () => 'Home', {foo: 'bar'}),
    route('/users/:username', () => 'Username'),
    route(/.*/, () => 'NotFound')
]

describe('Rondpoint', () => {
    describe('route', () => {
        it('should returns a route object', () => {
            const r = {pattern: '/', handler: () => {}, options: {}};
            const routeObject = route(r.pattern, r.handler, r.options);
            expect(routeObject).to.deep.equal(r);
        });

        it('should throw an error when pattern or handler are not given', () => {
            expect(() => route(null, null)).to.throw();
        });
    });

    describe('match', () => {
        it('should accept a string and a routes array', () => {

        });
    });
});
