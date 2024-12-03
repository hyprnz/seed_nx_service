import { domainId, request, user } from './authoriseByPolicy.util';
import { AuthorisableByResource } from './AuthorisableByResource';
import { AuthoriseByPolicy } from './AuthoriseByPolicy';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserProfileBuilder } from './testFixtures/UserProfileBuilder';
import { makeIsOwnerOrHasAtLeastOneActionPolicy } from '../../policy/policy.standard';
import { RequestBuilder } from './testFixtures/RequestBuilder';
import { ForbiddenError } from '@hyprnz/error';

interface UserProfile {
    activities: string[];
}

describe('Authorise By Policy test suite', () => {
    const readAll = 'ReadAll';

    describe('@AuthorisableByResource', () => {
        const mockGetOwnersForObjectId = vi.fn();
        const isOwnerOrHasAtLeastOneActionPolicy = makeIsOwnerOrHasAtLeastOneActionPolicy({
            isOwnerOptions: {
                getOwnersForObjectId: mockGetOwnersForObjectId
            }
        });

        @AuthorisableByResource('contract')
        class TestHandler {
            @AuthoriseByPolicy({ policy: isOwnerOrHasAtLeastOneActionPolicy, skip: [readAll] })
            async actionWithSkipActivities(@user user: UserProfile): Promise<boolean> {
                return Promise.resolve(true);
            }

            @AuthoriseByPolicy({ policy: isOwnerOrHasAtLeastOneActionPolicy, skip: [readAll] })
            async withRequestActionWithSkipActivities(@request request: any): Promise<boolean> {
                return Promise.resolve(true);
            }

            @AuthoriseByPolicy({ policy: isOwnerOrHasAtLeastOneActionPolicy })
            async domainId(@domainId id: string, @user user: UserProfile): Promise<boolean> {
                return Promise.resolve(true);
            }

            @AuthoriseByPolicy({ policy: isOwnerOrHasAtLeastOneActionPolicy })
            async domainIdWithRequest(@domainId id: string, @request request: any): Promise<boolean> {
                return Promise.resolve(true);
            }

            @AuthoriseByPolicy({ policy: isOwnerOrHasAtLeastOneActionPolicy })
            async noUser(@domainId id: string): Promise<any> {
                return Promise.resolve({ id });
            }
        }
        let handler: TestHandler;

        beforeEach(() => {
            handler = new TestHandler();
        });

        describe('AuthoriseByPolicy', () => {
            const id = 'some-domain-id';

            it('policyWithSkipActivities() with skip activity does not authorise', async () => {
                const userReadAll = UserProfileBuilder.make().withActivities([readAll]).build();
                const result = await handler.actionWithSkipActivities(userReadAll);
                expect(result).toBeTruthy();
            });

            it('actionWithSkipActivities() pass authorisation when matching skip activity', async () => {
                // Assemble
                const userProfileWithSkipActivity = UserProfileBuilder.make().withActivities([readAll]).build();
                const userProfileNoSkipActivity = UserProfileBuilder.make().build();

                // Act - pass when skip activity matches user activity
                await handler.actionWithSkipActivities(userProfileWithSkipActivity);

                // Act - fail when no skip activity
                try {
                    await handler.actionWithSkipActivities(userProfileNoSkipActivity);
                } catch (error: any) {
                    // Assert
                    expect(error).toBeInstanceOf(ForbiddenError);
                    expect(error.message).toContain('Forbidden');
                    expect(error.toHttpResponse().error.details).toContain('hasAtLeastOneActivity');
                }
            });

            it('withRequestActionWithSkipActivities() pass authorisation when matching skip activity', async () => {
                // Assemble
                const userProfileWithSkipActivity = UserProfileBuilder.make().withActivities([readAll]).build();
                const userProfileNoSkipActivity = UserProfileBuilder.make().build();

                // Act - pass when skip activity matches user activity
                await handler.actionWithSkipActivities(userProfileWithSkipActivity);

                // Act - fail when no skip activity
                try {
                    await handler.actionWithSkipActivities(userProfileNoSkipActivity);
                } catch (error: any) {
                    // Assert
                    expect(error).toBeInstanceOf(ForbiddenError);
                    expect(error.message).toContain('Forbidden');
                    expect(error.toHttpResponse().error.details).toContain('hasAtLeastOneActivity');
                }
            });

            it('domainIdWithRequest() pass authorisation when owner of domainId (@request to identify user)', async () => {
                // Assemble
                const request = RequestBuilder.make().withSubject('1234').build();

                // Expectations
                mockGetOwnersForObjectId.mockReturnValueOnce([request.user.subject]); // for first Act
                mockGetOwnersForObjectId.mockReturnValueOnce([]); // for second Act

                // Act - pass when owner of domain id
                await handler.domainIdWithRequest(id, request);

                // Act - fail when not owner of domain id
                try {
                    await handler.domainIdWithRequest(id, request);
                } catch (error: any) {
                    // Assert
                    expect(error).toBeInstanceOf(ForbiddenError);
                    expect(error.message).toContain('Forbidden');
                    expect(error.toHttpResponse().error.details).toContain('hasAtLeastOneActivity');
                }
            });

            it('domainId() pass authorisation when owner of domainId (@user to identify user)', async () => {
                // Assemble
                const userProfile = UserProfileBuilder.make().withSubject('1234').build();

                // Expectations
                mockGetOwnersForObjectId.mockReturnValueOnce([userProfile.subject]); // for first Act
                mockGetOwnersForObjectId.mockReturnValueOnce([]); // for second Act

                // Act - pass when owner of domain id
                await handler.domainId(id, userProfile);

                // Act - fail when not owner of domain id
                try {
                    await handler.domainId(id, userProfile);
                } catch (error: any) {
                    // Assert
                    expect(error).toBeInstanceOf(ForbiddenError);
                    expect(error.message).toContain('Forbidden');
                    expect(error.toHttpResponse().error.details).toContain('hasAtLeastOneActivity');
                }
            });

            it('noUser() should always fail', async () => {
                // Act
                try {
                    await handler.noUser(id);
                } catch (error: any) {
                    // Assert
                    expect(error).toBeInstanceOf(Error);
                    expect(error.message).toContain('Could not find user in @request or @user parameters');
                }
            });
        });
    });
});
