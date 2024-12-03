import { describe, expect, it } from 'vitest';
import { shouldSkip } from './authoriseByPolicy.util.ts';
import { UserProfileBuilder } from './testFixtures/UserProfileBuilder.ts';

describe('shouldSkip', () => {
    const readAll = 'ReadAll';
    const read = 'Read';
    it('true with matching skip activity', () => {
        const user = UserProfileBuilder.make().withActivities([readAll]).build();
        expect(shouldSkip([readAll], user)).toBeTruthy();
    });
    it('false with no user activity', () => {
        const user = UserProfileBuilder.make()
            .withActivities(undefined as any)
            .build();
        expect(shouldSkip([], user)).toBeFalsy();
    });
    it('false with no skip activity', () => {
        const user = UserProfileBuilder.make().withActivities([readAll]).build();
        expect(shouldSkip([], user)).toBeFalsy();
    });
    it('false with undefined skip activities', () => {
        const user = UserProfileBuilder.make().withActivities([readAll]).build();
        expect(shouldSkip(undefined, user)).toBeFalsy();
    });
    it('false with non matching skip activities', () => {
        const user = UserProfileBuilder.make().withActivities([read]).build();
        expect(shouldSkip([readAll], user)).toBeFalsy();
    });
});
