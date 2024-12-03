import { PolicyExecutor, PolicyInformation } from './policy.types';
import { PolicyBuilder } from './policy.builder';
import { makeHasActionsDecision, makeHasAtLeastOneActionDecision } from './decisionPoints';
import { AllowDeny, makeReturnAllowDenyEnforcement } from './enforcementPoints';
import { makeWithActivitiesTokenInformation } from './informationPoints';
import { describe, expect, it } from 'vitest';

describe('Policy Executor test suite', () => {
    describe('hasActions test suite', () => {
        const authoriseUserForActivity: PolicyExecutor = PolicyBuilder.make()
            .addDecisionPoint(makeHasActionsDecision())
            .addEnforcementPoint(makeReturnAllowDenyEnforcement())
            .build();

        it('hasActivity: should allow when activity exists', async () => {
            // Setup
            const policyInfo: PolicyInformation = {
                subject: {
                    activities: ['request:resource:request:create', 'request:resource:request:re-open']
                },
                actions: ['request:resource:request:re-open']
            };

            // Test & Verify
            expect(await authoriseUserForActivity(policyInfo)).toEqual(AllowDeny.ALLOW);
        });

        it('hasActions: should deny when activity does not exist', async () => {
            // Setup
            const policyInfo: PolicyInformation = {
                subject: {
                    activities: ['request:resource:request:create']
                },
                actions: ['request:resource:request:re-open']
            };

            // Test & Verify
            expect(await authoriseUserForActivity(policyInfo)).toEqual(AllowDeny.DENY);
        });
    });

    describe('hasOneOrMoreActivities test suite', () => {
        const authoriseUserForActivities: PolicyExecutor = PolicyBuilder.make()
            .addDecisionPoint(makeHasActionsDecision())
            .addEnforcementPoint(makeReturnAllowDenyEnforcement())
            .build();

        it('hasOneOrMoreActivities: should allow when all actions exist', async () => {
            // Setup
            const policyInfo: PolicyInformation = {
                subject: {
                    activities: ['request:resource:request:create', 'request:resource:request:re-open']
                },
                actions: ['request:resource:request:re-open', 'request:resource:request:create']
            };

            // Test & Verify
            expect(await authoriseUserForActivities(policyInfo)).toEqual(AllowDeny.ALLOW);
        });

        it('hasOneOrMoreActivities: should deny when some activities are missing', async () => {
            // Setup
            const policyInfo: PolicyInformation = {
                subject: {
                    activities: []
                },
                actions: ['request:resource:request:re-open']
            };

            // Test & Verify
            expect(await authoriseUserForActivities(policyInfo)).toEqual(AllowDeny.DENY);
        });
    });

    describe('hasAtLeastOneActivity test suite', () => {
        const authoriseUserForAtLeastOneOrMoreActivities: PolicyExecutor = PolicyBuilder.make()
            .addDecisionPoint(makeHasAtLeastOneActionDecision())
            .addEnforcementPoint(makeReturnAllowDenyEnforcement())
            .build();

        it('hasOneOrMoreActivities: should allow when at least one activity exists', async () => {
            // Setup
            const policyInfo: PolicyInformation = {
                subject: {
                    activities: ['request:resource:request:create', 'request:resource:request:re-open']
                },
                actions: ['request:resource:request:re-open']
            };

            // Test & Verify
            expect(await authoriseUserForAtLeastOneOrMoreActivities(policyInfo)).toEqual(AllowDeny.ALLOW);
        });

        it('hasOneOrMoreActivities: should deny when no activities exist', async () => {
            // Setup
            const policyInfo: PolicyInformation = {
                subject: {
                    activities: []
                },
                actions: ['request:resource:request:re-open']
            };

            // Test & Verify
            expect(await authoriseUserForAtLeastOneOrMoreActivities(policyInfo)).toEqual(AllowDeny.DENY);
        });
    });

    describe('withActivitiesInformation test suite', () => {
        const activitiesForSubject: string[] = ['claims:resource:claims:read', 'policy:resource:episodes:read'];
        const authorise: PolicyExecutor = PolicyBuilder.make()
            .addInformationPoint(makeWithActivitiesTokenInformation(activitiesForSubject))
            .addDecisionPoint(makeHasActionsDecision())
            .addEnforcementPoint(makeReturnAllowDenyEnforcement())
            .build();

        it('withActivitiesInformation: should allow when activity policy:resource:episodes:read exists', async () => {
            // Setup
            const policyInfo: PolicyInformation = {
                subject: {},
                actions: ['policy:resource:episodes:read']
            };

            // Test & Verify
            expect(await authorise(policyInfo)).toEqual(AllowDeny.ALLOW);
        });

        it('withActivitiesInformation: should deny when activity does not exist', async () => {
            // Setup
            const policyInfo: PolicyInformation = {
                subject: {},
                actions: ['totally:resource:madeUp:activity']
            };

            // Test & Verify
            expect(await authorise(policyInfo)).toEqual(AllowDeny.DENY);
        });
    });

    describe('throwAuthZExcpetionEnforcement test suite', () => {
        const authorise: PolicyExecutor = PolicyBuilder.make()
            .addDecisionPoint(makeHasActionsDecision())
            .addEnforcementPoint(makeReturnAllowDenyEnforcement())
            .build();

        it('withActivitiesInformation: should allow when activity policy:resource:episodes:read exists', async () => {
            // Setup
            const policyInfo: PolicyInformation = {
                subject: {
                    activities: ['policy:resource:episodes:read']
                },
                actions: ['policy:resource:episodes:read']
            };

            // Test & Verify
            expect(await authorise(policyInfo)).toEqual(AllowDeny.ALLOW);
        });

        it('withActivitiesInformation: should deny when activity does not exist', async () => {
            // Setup
            const policyInfo: PolicyInformation = {
                subject: {
                    activities: []
                },
                actions: ['policy:resource:episodes:read']
            };

            // Test & Verify
            try {
                await authorise(policyInfo);
            } catch (error: unknown) {
                expect((error as Error).message).toEqual('Failed because the following assertions were false hasActions.');
            }
        });
    });
});
