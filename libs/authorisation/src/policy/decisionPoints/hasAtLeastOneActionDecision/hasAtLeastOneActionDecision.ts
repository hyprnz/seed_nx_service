import { PolicyDecisionPoint, PolicyInformation } from '../../policy.types';
import { isAuthorisedByActivity } from '../decisionPoints.util';

const makeHasAtLeastOneActionDecision =
    (): PolicyDecisionPoint =>
    async (policyInfo: PolicyInformation): Promise<PolicyInformation> => {
        const userActivities: string[] = policyInfo.subject?.activities ?? [];
        const hasActivitiesResults: boolean[] = policyInfo.actions.map((requiredActivity: string): boolean =>
            isAuthorisedByActivity(requiredActivity, userActivities)
        );
        const hasAtLeastOneActivity = hasActivitiesResults.reduce(
            (finalResult: boolean, hasActivityResult: boolean) => (hasActivityResult ? true : finalResult),
            false
        );
        return {
            ...policyInfo,
            decisionPointResults: {
                ...policyInfo.decisionPointResults,
                hasAtLeastOneActivity
            }
        };
    };

export { makeHasAtLeastOneActionDecision };
