import { isAuthorisedByActivities } from './decisionPoints.util';
import { describe, expect, it } from 'vitest';

describe('Decision point util test suite', () => {
    describe('isAuthorisedByActivity', () => {
        const USER_ACTIVITIES_SIMPLE = ['profile:resource:profile:create'];
        const USER_ACTIVITIES_ADMIN = ['profile:*:*:*'];

        it('should not authorise when activity not allowed', async () => {
            // Test
            const isAuthorised = isAuthorisedByActivities(['profile:resource:profile:update'], USER_ACTIVITIES_SIMPLE);
            const isAuthorisedNonURN = isAuthorisedByActivities(['profile_resource_profile_update'], ['profile_resource_profile_create']);

            // Verify
            expect(isAuthorised).toBeFalsy();
            expect(isAuthorisedNonURN).toBeFalsy();
        });

        it('should authorise when activity is allowed', async () => {
            // Test
            const isAuthorised = isAuthorisedByActivities(['profile:resource:profile:create'], USER_ACTIVITIES_SIMPLE);
            const isAuthorisedNonURN = isAuthorisedByActivities(['profile_resource_profile_create'], ['profile_resource_profile_create']);

            // Verify
            expect(isAuthorised).toBeTruthy();
            expect(isAuthorisedNonURN).toBeTruthy();
        });

        it('should not authorise when activity not allowed (using wildcard)', async () => {
            // Test
            const isAuthorised = isAuthorisedByActivities(['client:resource:client:create'], USER_ACTIVITIES_ADMIN);

            // Verify
            expect(isAuthorised).toBeFalsy();
        });

        it('should authorise when activity is allowed (without wildcard)', async () => {
            // Test
            const isAuthorised = isAuthorisedByActivities(['profile:resource:profile:create'], USER_ACTIVITIES_ADMIN);

            // Verify
            expect(isAuthorised).toBeTruthy();
        });

        it('should authorise when privilege activity allowed', async () => {
            // Test
            const isAuthorised = isAuthorisedByActivities(
                ['profile:privilege:profile:invite-user-to-register'],
                ['profile:privilege:profile:invite-user-to-register']
            );

            // Verify
            expect(isAuthorised).toBeTruthy();
        });

        it('should not authorise when privilege activity not allowed', async () => {
            // Test

            const isAuthorised = isAuthorisedByActivities(
                ['profile:privilege:profile:random-activity'],
                ['profile:privilege:profile:invite-user-to-register']
            );

            // Verify
            expect(isAuthorised).toBeFalsy();
        });

        it('should authorise when privilege activity allowed for god user', async () => {
            // Test
            const isAuthorised = isAuthorisedByActivities(['profile:privilege:profile:invite-user-to-register'], USER_ACTIVITIES_ADMIN);

            // Verify
            expect(isAuthorised).toBeTruthy();
        });

        it('should authorise when user has at least one of the required activities', async () => {
            // Test
            const isAuthorised = isAuthorisedByActivities(
                ['profile:privilege:profile:invite-user-to-register', 'client:resource:client:create', 'profile:resource:profile:update'],
                ['profile:privilege:profile:invite-user-to-register']
            );

            // Verify
            expect(isAuthorised).toBeTruthy();
        });

        it('should not authorise when user has none of the required activities', async () => {
            // Test
            const isAuthorised = isAuthorisedByActivities(
                ['profile:privilege:profile:invite-user-to-register', 'client:resource:client:create', 'profile:resource:profile:update'],
                ['profile:resource:identity:add']
            );

            // Verify
            expect(isAuthorised).toBeFalsy();
        });
    });
});
