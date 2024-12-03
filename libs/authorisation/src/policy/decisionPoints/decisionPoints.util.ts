import { reduce } from 'ramda';
import { anyTrue } from '../policy.util';

const isAuthorisedByActivity = (targetActivity: string, userActivities: string[]) =>
    reduce((isAuthorised: boolean, userActivity: string): boolean => {
        const targetActivityParts = targetActivity.split(':');
        const userActivityParts = userActivity.split(':');

        /*
         * Handle non URN activities
         */
        if (targetActivityParts.length !== 4 && userActivityParts.length !== 4) {
            return targetActivity.toLowerCase().trim() === userActivity.toLowerCase().trim();
        }

        /*
         * Handle resource URN activities which use the format :(resource|privilege):domain:activity
         * e.g. profile:resource:email:create
         */
        const [targetService, targetObjectType, targetResource, targetAction] = targetActivityParts;
        const result = {
            allowService: false,
            allowActivityType: false,
            allowResource: false,
            allowAction: false
        };
        const [userActivityService, userActivityObjectType, userActivityResource, userActivityAction] = userActivityParts;

        // Handle service
        if (userActivityService === targetService || userActivityService === '*') {
            result.allowService = true;
        }

        // Handle activity Type
        if (userActivityObjectType === targetObjectType || userActivityObjectType === '*') {
            result.allowActivityType = true;
        }

        // Handle resource
        if (userActivityResource === targetResource || userActivityResource === '*') {
            result.allowResource = true;
        }

        // Handle action
        if (userActivityAction === targetAction || userActivityAction === '*') {
            result.allowAction = true;
        }

        if (result.allowService && result.allowActivityType && result.allowResource && result.allowAction) {
            return true;
        }
        return isAuthorised;
    }, false)(userActivities);

const isAuthorisedByActivities = (hasAtLeastOneOfTheseActivities: string[], userActivities: string[]): boolean => {
    const isAuthorisedByActivities = hasAtLeastOneOfTheseActivities.map((activity) => isAuthorisedByActivity(activity, userActivities));
    return anyTrue(isAuthorisedByActivities);
};

export { isAuthorisedByActivity, isAuthorisedByActivities };
