import { configureLogger, makeLogger, makeStructuredLog } from './logger';
import { beforeAll, describe, expect, it } from 'vitest';

describe('logger', () => {
    describe('makeLogger', () => {
        beforeAll(() => {
            configureLogger({ name: 'logger.unit', correlationId: { key: 'correlationId', namespace: 'correlationId' } });
        });
        it('makeLogger no namespace', () => {
            const logger = makeLogger();
            logger.debug('hello');
        });
        it('makeLogger with child string', () => {
            const logger = makeLogger('some-child');
            logger.debug('hello');
        });
    });

    describe('makeStructuredLog', () => {
        it('handles standard js Error', () => {
            const err = new Error('a');
            const log: any = makeStructuredLog(undefined, err);
            expect(log).toEqual({
                errorType: 'Error',
                message: 'a',
                stack: expect.any(String)
            });
        });

        it('handles other than an Error', () => {
            const err = 'a';
            const log: any = makeStructuredLog(undefined, err);
            expect(log).toEqual({ message: 'a' });
        });

        it('handles undefined', () => {
            const log: any = makeStructuredLog(undefined, undefined);
            expect(log).toEqual({ message: 'No data or message provided.' });
        });

        it('handles a function', () => {
            const log: any = makeStructuredLog(undefined, () => 1);
            expect(log).toEqual({ message: undefined });
        });
    });
});
