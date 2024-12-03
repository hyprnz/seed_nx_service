import { makeThrowAuthZExceptionEnforcement, ThrowFailureCondition } from './throwAuthZExceptionEnforcement';
import { describe, expect, it } from 'vitest';
import { ForbiddenError } from '@hyprnz/error';

describe('Enforcement throw AuthZ Error', () => {
    it('should not throw exception when when all decisions pass', async () => {
        // Setup
        const pip: any = {
            decisionPointResults: {
                hasActivity: true,
                isOwner: true
            }
        };
        const enforcement = makeThrowAuthZExceptionEnforcement();

        // Test
        await enforcement(pip);
    });

    it('should not throw exception when at least on decision passes', async () => {
        // Setup
        const pip: any = {
            decisionPointResults: {
                hasActivity: false,
                isOwner: true
            }
        };
        const enforcement = makeThrowAuthZExceptionEnforcement({ failureCondition: ThrowFailureCondition.THROW_ON_ALL_DECISIONS_FALSE });

        // Test
        await enforcement(pip);
    });

    it('should throw exception when no decisions have passed', async () => {
        // Setup
        const pip: any = {
            decisionPointResults: {
                hasActivity: false,
                isOwner: false
            }
        };
        const enforcement = makeThrowAuthZExceptionEnforcement();

        // Test
        try {
            await enforcement(pip);
            throw new Error('should have failed');
        } catch (error: any) {
            expect(error instanceof ForbiddenError).toBeTruthy();
            expect(error.message).toEqual('Forbidden');
            expect(error.toHttpResponse().error.details).toEqual(
                'At least one of the following policies must be true: ' + 'hasActivity,isOwner, but none were true.'
            );
        }
    });
});
