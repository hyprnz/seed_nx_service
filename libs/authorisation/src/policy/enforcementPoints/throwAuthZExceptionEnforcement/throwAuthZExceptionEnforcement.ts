import { PolicyEnforcementPoint, PolicyInformation } from '../../policy.types';
import { keys, values } from 'ramda';
import { allFalse, anyFalse } from '../../policy.util';
import { ForbiddenError } from '@hyprnz/error';

enum ThrowFailureCondition {
    THROW_ON_ALL_DECISIONS_FALSE,
    THROW_ON_AT_LEAST_ONE_DECISION_FALSE
}

interface ThrowFailureOptions {
    failureCondition: ThrowFailureCondition;
}

const getExceptionMessage = (options: ThrowFailureOptions, pip: PolicyInformation): string | undefined => {
    switch (options.failureCondition) {
        case ThrowFailureCondition.THROW_ON_ALL_DECISIONS_FALSE:
            if (pip.decisionPointResults) {
                const results = values(pip.decisionPointResults);
                if (allFalse(results)) {
                    return `At least one of the following policies must be true: ${keys(pip.decisionPointResults)}, but none were true.`;
                }
            }
            break;
        case ThrowFailureCondition.THROW_ON_AT_LEAST_ONE_DECISION_FALSE:
            if (pip.decisionPointResults) {
                const results = values(pip.decisionPointResults);
                if (anyFalse(results)) {
                    return `All of the following policies must be true: ${keys(pip.decisionPointResults)}, but one or more were not true.`;
                }
            }
            break;
    }
};

const makeThrowAuthZExceptionEnforcement =
    (options: ThrowFailureOptions = { failureCondition: ThrowFailureCondition.THROW_ON_ALL_DECISIONS_FALSE }): PolicyEnforcementPoint =>
    async (pip: PolicyInformation): Promise<PolicyInformation> => {
        const message = getExceptionMessage(options, pip);
        if (message) {
            throw new ForbiddenError({ message: 'Forbidden', details: message });
        }
        return {
            ...pip,
            enforcementPointResults: {
                ...pip.enforcementPointResults,
                throwAuthZException: true
            }
        };
    };

export { makeThrowAuthZExceptionEnforcement, ThrowFailureCondition, ThrowFailureOptions };
