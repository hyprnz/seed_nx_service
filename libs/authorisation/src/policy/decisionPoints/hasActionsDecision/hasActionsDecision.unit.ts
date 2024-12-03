import { makeHasActionsDecision } from './hasActionsDecision';
import { describe, expect, it } from 'vitest';
import { PolicyInformation } from '../../policy.types';

describe('Decision Points: has activity test suite', () => {
    it('should update pip with result of decision to true', async () => {
        // Setup
        const pip: PolicyInformation = {
            subject: {
                activities: ['profile:*:*:*']
            },
            actions: ['profile:resource:profile:read']
        };

        const decision = makeHasActionsDecision();

        // Test
        const newPip = await decision(pip);

        // Verify
        expect(newPip).toEqual({
            ...pip,
            decisionPointResults: {
                hasActions: true
            }
        });
    });

    it('should update pip with result of decision to false with wrong activity', async () => {
        // Setup
        const pip: PolicyInformation = {
            subject: {
                activities: ['profile:resource:profile:read-own']
            },
            actions: ['profile:resource:profile:read']
        };
        const decision = makeHasActionsDecision();

        // Test
        const newPip = await decision(pip);

        // Verify
        expect(newPip).toEqual({
            ...pip,
            decisionPointResults: {
                hasActions: false
            }
        });
    });

    it('should update pip with result of decision of false with missing activity', async () => {
        // Setup
        const pip: PolicyInformation = {
            subject: {
                activities: []
            },
            actions: ['profile:resource:profile:read']
        };
        const decision = makeHasActionsDecision();

        // Test
        const newPip = await decision(pip);

        // Verify
        expect(newPip).toEqual({
            ...pip,
            decisionPointResults: {
                hasActions: false
            }
        });
    });
});
