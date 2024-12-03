import { unless } from './unless';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('unless()', () => {
    const mockResponse = {};
    const mockNext = vi.fn();
    const mockMiddleware = (req: any, res: any, next: any) => {
        counter++;
        next();
    };
    let counter: number;

    beforeEach(() => {
        counter = 0;
    });

    it('when no match no paths', () => {
        const req = {};
        unless([], mockMiddleware)(req, mockResponse, mockNext);
        expect(counter).toEqual(1);
    });
    it('when no match many paths', () => {
        const req = { path: '/anotherpath' };
        unless(['/aaaa', '/bbbb'], mockMiddleware)(req, mockResponse, mockNext);
        expect(counter).toEqual(1);
    });
    it('when match with single path', () => {
        const req = { path: '/matching' };
        unless(['/matching'], mockMiddleware)(req, mockResponse, mockNext);
        expect(counter).toEqual(0);
    });
    it('when match with many paths', () => {
        const req = { path: '/matching' };
        unless(['/nomatch', '/matching', '/notamatch'], mockMiddleware)(req, mockResponse, mockNext);
        expect(counter).toEqual(0);
    });
});
