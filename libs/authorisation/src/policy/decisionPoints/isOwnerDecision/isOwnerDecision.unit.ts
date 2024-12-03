import { PolicyInformation } from '../../policy.types';
import { makeIsOwnerDecision } from './isOwnerDecision';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Decision Points: isOwner test suite', () => {
    const getOwnersForObjectId = vi.fn();
    const mockGetOwnersForObjectId = (id: string) => Promise.resolve(getOwnersForObjectId(id));
    const OWNER_IDENTITY = 'subject';
    const ANOTHER_SUBJECT_IDENTITY = 'anotherSubject';
    const PARTY_IDENTITY = 'party';
    const PROFILE_READ_OWN_ACTIVITY = 'profile:resource:profile:read-own';
    const PROFILE_READ_ACTIVITY = 'profile:resource:profile:read';

    beforeEach(() => {
        getOwnersForObjectId.mockReset();
    });

    describe('should authorise if has owner activity, owns object and...', () => {
        const MOCK_OBJECT_IDENTITIES = [PARTY_IDENTITY, OWNER_IDENTITY];
        const MOCK_OBJECT_ID = 'e0ee9914-2029-11ec-8081-17044abaa440';
        const MOCK_PIP: PolicyInformation = {
            subject: {
                identityAssertions: [OWNER_IDENTITY, PARTY_IDENTITY],
                activities: [PROFILE_READ_OWN_ACTIVITY]
            },
            object: {
                id: MOCK_OBJECT_ID,
                type: 'urn:profile:resource:profile',
                owners: MOCK_OBJECT_IDENTITIES
            },
            actions: [PROFILE_READ_ACTIVITY]
        };

        it('object provided', async () => {
            // Setup
            const decision = makeIsOwnerDecision({ owningActivity: PROFILE_READ_OWN_ACTIVITY, getOwnersForObjectId: mockGetOwnersForObjectId });

            // Test
            const newPip = await decision(MOCK_PIP);

            // Verify
            expect(getOwnersForObjectId).not.toBeCalled();
            expect(newPip).toEqual({
                ...MOCK_PIP,
                decisionPointResults: {
                    isOwner: true
                }
            });
        });

        it('object.owners not provided', async () => {
            // Setup
            const decision = makeIsOwnerDecision({ owningActivity: PROFILE_READ_OWN_ACTIVITY, getOwnersForObjectId: mockGetOwnersForObjectId });
            const pip: any = {
                ...MOCK_PIP,
                object: {
                    ...MOCK_PIP.object,
                    owners: undefined
                }
            };

            // Expectations
            getOwnersForObjectId.mockReturnValue(MOCK_OBJECT_IDENTITIES);

            // Test
            const newPip = await decision(pip);

            // Verify
            expect(getOwnersForObjectId.mock.calls).toHaveLength(1);
            expect(newPip).toEqual({
                ...MOCK_PIP,
                decisionPointResults: {
                    isOwner: true
                }
            });
        });

        it('object.owners provided but no identities on object', async () => {
            // Setup
            const decision = makeIsOwnerDecision({ owningActivity: PROFILE_READ_OWN_ACTIVITY, getOwnersForObjectId: mockGetOwnersForObjectId });
            const pip: any = {
                ...MOCK_PIP,
                object: {
                    ...MOCK_PIP.object,
                    owners: []
                }
            };

            // Expectations
            getOwnersForObjectId.mockReturnValue(MOCK_OBJECT_IDENTITIES);

            // Test
            const newPip = await decision(pip);

            // Verify
            expect(getOwnersForObjectId).toBeCalledTimes(1);
            expect(newPip).toEqual({
                ...MOCK_PIP,
                decisionPointResults: {
                    isOwner: true
                }
            });
        });
    });

    describe('should not authorise when not owner', () => {
        const MOCK_OBJECT_IDENTITIES = [ANOTHER_SUBJECT_IDENTITY];
        const MOCK_OBJECT_ID = 'e0ee9914-2029-11ec-8081-17044abaa440';
        const MOCK_PIP: PolicyInformation = {
            subject: {
                identityAssertions: [OWNER_IDENTITY],
                activities: [PROFILE_READ_OWN_ACTIVITY]
            },
            object: {
                id: MOCK_OBJECT_ID,
                type: 'urn:profile:resource:profile',
                owners: MOCK_OBJECT_IDENTITIES
            },
            actions: [PROFILE_READ_ACTIVITY]
        };

        describe('object.owners not provided', () => {
            it('has owner activity, but object belongs to someone else', async () => {
                // Setup
                const decision = makeIsOwnerDecision({ owningActivity: PROFILE_READ_OWN_ACTIVITY, getOwnersForObjectId: mockGetOwnersForObjectId });
                const pip: any = {
                    ...MOCK_PIP,
                    object: {
                        ...MOCK_PIP.object,
                        owners: undefined
                    }
                };

                // Expectations
                getOwnersForObjectId.mockReturnValue(MOCK_OBJECT_IDENTITIES);

                // Test
                const newPip = await decision(pip);

                // Verify
                expect(getOwnersForObjectId).toBeCalledTimes(1);
                expect(newPip).toEqual({
                    ...MOCK_PIP,
                    decisionPointResults: {
                        isOwner: false
                    }
                });
            });

            it('has owner activity, object.owners provided but no owners and object belongs to someone else', async () => {
                // Setup
                const decision = makeIsOwnerDecision({ owningActivity: PROFILE_READ_OWN_ACTIVITY, getOwnersForObjectId: mockGetOwnersForObjectId });
                const pip: any = {
                    ...MOCK_PIP,
                    object: {
                        ...MOCK_PIP.object,
                        owners: undefined
                    }
                };

                // Expectations
                getOwnersForObjectId.mockReturnValue(MOCK_OBJECT_IDENTITIES);

                // Test
                const newPip = await decision(pip);

                // Verify
                expect(getOwnersForObjectId).toBeCalledTimes(1);
                expect(newPip).toEqual({
                    ...MOCK_PIP,
                    decisionPointResults: {
                        isOwner: false
                    }
                });
            });
        });

        describe('object provided', () => {
            it('has owner activity, but object belongs to someone else', async () => {
                // Setup
                const decision = makeIsOwnerDecision({ owningActivity: PROFILE_READ_OWN_ACTIVITY, getOwnersForObjectId: mockGetOwnersForObjectId });
                const pip: any = {
                    ...MOCK_PIP,
                    object: {
                        ...MOCK_PIP.object,
                        owners: MOCK_OBJECT_IDENTITIES
                    }
                };

                // Test
                const newPip = await decision(pip);

                // Verify
                expect(getOwnersForObjectId).not.toBeCalled();
                expect(newPip).toEqual({
                    ...MOCK_PIP,
                    decisionPointResults: {
                        isOwner: false
                    }
                });
            });

            it("hasn't got owner activity, but object belongs to them", async () => {
                // Setup
                const decision = makeIsOwnerDecision({ owningActivity: PROFILE_READ_OWN_ACTIVITY, getOwnersForObjectId: mockGetOwnersForObjectId });
                const pip: any = {
                    subject: {
                        identityAssertions: MOCK_PIP.subject.identityAssertions,
                        activities: [] // no owner activity
                    },
                    object: {
                        ...MOCK_PIP.object,
                        owners: [OWNER_IDENTITY]
                    }
                };

                // Test
                const newPip = await decision(pip);

                // Verify
                expect(getOwnersForObjectId).not.toBeCalled();
                expect(newPip).toEqual({
                    ...pip,
                    decisionPointResults: {
                        isOwner: false
                    }
                });
            });

            it('owner activity not specified, but object belongs to them', async () => {
                // Setup
                const decision = makeIsOwnerDecision({ getOwnersForObjectId: mockGetOwnersForObjectId });
                const pip: any = {
                    subject: {
                        identityAssertions: MOCK_PIP.subject.identityAssertions,
                        activities: [PROFILE_READ_OWN_ACTIVITY]
                    },
                    object: {
                        ...MOCK_PIP.object,
                        owners: [OWNER_IDENTITY]
                    }
                };

                // Test
                const newPip = await decision(pip);

                // Verify
                expect(getOwnersForObjectId).not.toBeCalled();
                expect(newPip).toEqual({
                    ...pip,
                    decisionPointResults: {
                        isOwner: true
                    }
                });
            });
        });
    });
});
