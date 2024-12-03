import { isEmpty, isNil, not } from 'ramda';
import { performance } from 'perf_hooks';
import { makeLogger } from '@hyprnz/logger';

const allFalse = (results: boolean[]): boolean => results.filter((result) => not(result)).length === results.length;

const allTrue = (results: boolean[]): boolean => results.filter((result) => result).length === results.length;

const anyFalse = (results: boolean[]): boolean => results.filter((result) => not(result)).length > 0;

const anyTrue = (results: boolean[]): boolean => results.filter((result) => result).length > 0;

const isNilOrEmpty = (value: any) => isNil(value) || isEmpty(value);

const logger = makeLogger('policy:withPerformance');

const withPerformanceMetrics = (funcName: string, func: any): any => {
    return async (...args: any[]): Promise<any> => {
        const t0: number = performance.now();
        const result: any = await func(...args);
        const t1: number = performance.now();
        logger.debug(`Call to ${funcName} took ${(t1 - t0) / 1000} seconds`);
        return result;
    };
};

export { allTrue, allFalse, anyFalse, anyTrue, isNilOrEmpty, withPerformanceMetrics };
