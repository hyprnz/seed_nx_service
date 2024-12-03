import { PolicyInformation, PolicyInformationPoint } from '../../policy.types';
import { uniq } from 'ramda';

const makeWithActivitiesTokenInformation =
    (userActivities: string[]): PolicyInformationPoint =>
    async (pip: PolicyInformation): Promise<PolicyInformation> => {
        const pipUserActivities = pip.subject?.activities ?? [];
        const activities: string[] = uniq([...pipUserActivities, ...userActivities]);
        return {
            ...pip,
            subject: {
                ...pip.subject,
                activities
            }
        };
    };

export { makeWithActivitiesTokenInformation };
