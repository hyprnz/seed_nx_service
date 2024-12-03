import { PolicyDecisionPoint, PolicyInformation } from '../../policy.types';
import { isAuthorisedByActivity } from '../decisionPoints.util';

const makeHasActionsDecision =
    (): PolicyDecisionPoint =>
    async (policyInfo: PolicyInformation): Promise<PolicyInformation> => {
        const userActivities: string[] = policyInfo.subject?.activities ?? [];
        const hasActivitiesResults: boolean[] = policyInfo.actions.map((requiredActivity: string): boolean =>
            isAuthorisedByActivity(requiredActivity, userActivities)
        );
        const hasActions = hasActivitiesResults.reduce(
            (finalResult: boolean, hasActivityResult: boolean) => (hasActivityResult ? finalResult : false),
            true
        );
        return {
            ...policyInfo,
            decisionPointResults: {
                ...policyInfo.decisionPointResults,
                hasActions
            }
        };
    };

export { makeHasActionsDecision };
