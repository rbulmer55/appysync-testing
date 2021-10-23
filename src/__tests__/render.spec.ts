//import { readFileSync } from 'fs';
import { render } from '../render';

//const readFileSyncMock = readFileSync as any as jest.Mock;
jest.mock('fs', () => {
    return {
        readFileSync: jest.fn(() => 'I am a vtl template'),
    };
});

let velocityContext;
let velocityTemplate;
let additionalAppsyncContext;
let additionalUtils;
beforeEach(() => {
    velocityTemplate = 'some velocity template string';
    velocityContext = {
        args: {},
        result: {},
        stash: {},
    };
    additionalAppsyncContext = {};
    additionalUtils = {};
});

describe('render', () => {
    describe('result', () => {
        it('should render a vtl template with a basic string', () => {
            const { result } = render(velocityTemplate, velocityContext, additionalAppsyncContext, additionalUtils);
            expect(result).toEqual(velocityTemplate);
        });

        it('should render a vtl template using a util function', () => {
            velocityTemplate = '$util.toJson({"hello":"bob"})';
            const { result } = render(velocityTemplate, velocityContext, additionalAppsyncContext, additionalUtils);
            expect(result).toEqual({ hello: 'bob' });
        });
    });

    describe('stash', () => {
        it('should extend the stash object if passed in', () => {
            velocityContext.stash = {
                someKey: 'someValue',
            };
            const { stash } = render(velocityTemplate, velocityContext, additionalAppsyncContext, additionalUtils);
            expect(stash).toHaveProperty('someKey', 'someValue');
        });

        it('should allow velocity to push to the stash object', () => {
            velocityTemplate = '$ctx.stash.put("someKey","someValue")';
            const { stash } = render(velocityTemplate, velocityContext, additionalAppsyncContext, additionalUtils);
            expect(stash).toHaveProperty('someKey', 'someValue');
        });
    });

    describe('args', () => {
        it('should extend the args object if passed in', () => {
            velocityContext.args = {
                argument1: 'firstArgument',
            };
            const { args } = render(velocityTemplate, velocityContext, additionalAppsyncContext, additionalUtils);
            expect(args).toHaveProperty('argument1', 'firstArgument');
        });

        it('should allow velocity to push to the args object', () => {
            velocityTemplate = '$ctx.args.put("argument1","newArgument")';
            const { args } = render(velocityTemplate, velocityContext, additionalAppsyncContext, additionalUtils);
            expect(args).toHaveProperty('argument1', 'newArgument');
        });
    });
});
