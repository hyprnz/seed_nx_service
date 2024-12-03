import { FailureCondition, makeReturnAllowDenyEnforcement } from './returnAllowDenyEnforcement';
import { describe, expect, it } from 'vitest';

describe('Enforcement throw AuthZ Error', () => {
    const enforcement = makeReturnAllowDenyEnforcement({ failureCondition: FailureCondition.DENY_ON_ALL_DECISIONS_FALSE });
    it('should ALLOW when when all decisions pass', async () => {
        // Setup
        const pip: any = {
            decisionPointResults: {
                hasActivity: true,
                isOwner: true
            }
        };

        // Test
        const result = await enforcement(pip);

        // Verify
        expect(result.enforcementPointResults?.allowDeny).toEqual('ALLOW');
    });

    it('should ALLOW when all but one passes', async () => {
        // Setup
        const pip: any = {
            decisionPointResults: {
                hasActivity: false,
                isOwner: true
            }
        };
        // Test
        const result = await enforcement(pip);

        // Verify
        expect(result.enforcementPointResults?.allowDeny).toEqual('ALLOW');
    });

    it('should DENY when no decisions have passed', async () => {
        // Setup
        const pip: any = {
            decisionPointResults: {
                hasActivity: false,
                isOwner: false
            }
        };
        // Test
        const result = await enforcement(pip);

        // Verify
        expect(result.enforcementPointResults?.allowDeny).toEqual('DENY');
    });
});
