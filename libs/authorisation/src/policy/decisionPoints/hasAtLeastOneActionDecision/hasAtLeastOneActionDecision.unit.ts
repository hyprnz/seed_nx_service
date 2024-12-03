import { makeHasAtLeastOneActionDecision } from './hasAtLeastOneActionDecision';
import { describe, expect, it } from 'vitest';
import { PolicyInformation } from '../../policy.types';

describe('Decision Points: has activity test suite', () => {
    it('should update pip with result of decision of true', async () => {
        // Setup
        const pip: PolicyInformation = {
            subject: {
                activities: ['profile:*:*:*']
            },
            actions: ['profile:resource:profile:read']
        };
        const decision = makeHasAtLeastOneActionDecision();

        // Test
        const newPip = await decision(pip);

        // Verify
        expect(newPip).toEqual({
            ...pip,
            decisionPointResults: {
                hasAtLeastOneActivity: true
            }
        });
    });

    it('should update pip with result of decision of false', async () => {
        // Setup
        const pip: PolicyInformation = {
            subject: {
                activities: []
            },
            actions: ['profile:resource:profile:read']
        };
        const decision = makeHasAtLeastOneActionDecision();

        // Test
        const newPip = await decision(pip);

        // Verify
        expect(newPip).toEqual({
            ...pip,
            decisionPointResults: {
                hasAtLeastOneActivity: false
            }
        });
    });
});
