/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { render as vRender } from 'velocityjs';
import * as appSyncUtils from './utils';
import { AppSyncUtilError } from './utils/error';

interface AppSyncRendered {
    args: Record<string, any>;
    stash: Record<string, any>;
    result: any;
    stoppedExecution: boolean;
}

export function render(
    velocityTemplate: string,
    velocityContext: Record<string, any>,
    additionalAppsyncContext?: Record<string, any>,
    additionalUtils?: Record<string, any>,
): AppSyncRendered {
    let stoppedExecution = false,
        result: any = '';
    const stash = {
        put: function put(key: string, value: any) {
            this[key] = value;
        },
        ...velocityContext.stash,
    };

    const args = {
        put: function put(key: string, value: any) {
            this[key] = value;
        },
        ...velocityContext.args,
    };

    const context: Record<string, any> = {
        ...velocityContext,
        ...stash,
        ...args,
    };

    const utils = {
        ...appSyncUtils,
        ...additionalUtils,
    };

    const vContext: Record<string, any> = {
        utils,
        util: utils,
        context,
        ctx: context,
        ...additionalAppsyncContext,
    };

    const vMacros = {
        return(this: { stop(): void }, value: unknown | undefined) {
            // handle forced returns
            stoppedExecution = true;
            this.stop();
            return value !== undefined ? JSON.stringify(value) : 'null';
        },
    };

    const vConfig = {};

    try {
        result = vRender(velocityTemplate, vContext, vMacros, vConfig);
        try {
            const jsonResult = JSON.parse(result);
            // if the value is JSON, return JSON result
            return { result: jsonResult, stash: vContext.context.stash, args: vContext.context.args, stoppedExecution };
        } catch (e) {
            result.replace(/^[\n\s\r]*/, '').replace(/[\n\s\r]*$/, '');
            // Typecasts
            if (result === 'false') result = false;
            if (result === 'true') result = true;
            if (result === 'null') result = null;
            if (!isNaN(result as unknown as number)) result = parseFloat(result);

            // if the value is non JSON, return string result
            return { result, stash: vContext.context.stash, args: vContext.context.args, stoppedExecution };
        }
    } catch (e: any) {
        // Attempt to get the last resolver error
        const err = AppSyncUtilError.getLastError();
        if (err) throw err;
        else throw e;
    } finally {
        AppSyncUtilError.clearLastError();
    }
}

export type VelocityContext = {
    arguments?: object;
    source?: object;
    result?: object | string;
    identity?: object;
    request?: object;
    info?: object;
    error?: object;
    prev?: object;
    stash?: object;
};
