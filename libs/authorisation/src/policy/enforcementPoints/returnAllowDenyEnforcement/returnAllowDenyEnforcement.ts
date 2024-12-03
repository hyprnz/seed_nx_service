import { PolicyEnforcementPoint, PolicyInformation } from '../../policy.types';
import { keys, values } from 'ramda';
import { allFalse, anyFalse } from '../../policy.util';
import { Logger, makeLogger } from '@hyprnz/logger';
import { AllowDeny } from '../enforcementPoints.types';

const logger: Logger = makeLogger('enforcementPoint:allowDeny');

enum FailureCondition {
    DENY_ON_ALL_DECISIONS_FALSE = 'DENY_ON_ALL_DECISIONS_FALSE',
    DENY_ON_AT_LEAST_ONE_DECISION_FALSE = 'DENY_ON_AT_LEAST_ONE_DECISION_FALSE'
}

interface FailureOptions {
    failureCondition: FailureCondition;
}

const shouldAllowDeny = (options: FailureOptions, pip: PolicyInformation): AllowDeny => {
    if (options.failureCondition === FailureCondition.DENY_ON_ALL_DECISIONS_FALSE) {
        if (pip.decisionPointResults) {
            const results = values(pip.decisionPointResults);
            if (allFalse(results)) {
                logger.warn(`Forbidden. At least one of the following policies must be true: ${keys(pip.decisionPointResults)}, but none were true.`);
                return AllowDeny.DENY;
            }
        }
    }
    // Deny on at least one decision false -- this is also the default if not failure condition specified
    else {
        if (pip.decisionPointResults) {
            const results = values(pip.decisionPointResults);
            if (anyFalse(results)) {
                logger.warn(
                    `Forbidden. All of the following policies must be true: ${keys(pip.decisionPointResults)}, but one or more were not true`
                );
                return AllowDeny.DENY;
            }
        }
    }
    return AllowDeny.ALLOW;
};

const makeReturnAllowDenyEnforcement =
    (options: FailureOptions = { failureCondition: FailureCondition.DENY_ON_ALL_DECISIONS_FALSE }): PolicyEnforcementPoint =>
    async (pip: PolicyInformation): Promise<PolicyInformation> => ({
        ...pip,
        enforcementPointResults: {
            ...pip.enforcementPointResults,
            allowDeny: shouldAllowDeny(options, pip)
        }
    });

export { makeReturnAllowDenyEnforcement, FailureCondition, FailureOptions };
