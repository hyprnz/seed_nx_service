import { PolicyComponentPoint, PolicyDecisionPoint, PolicyExecutor, PolicyInformation } from './policy.types';
import { andThen, lensPath, map, pipeWith, set, values } from 'ramda';
import { allTrue, withPerformanceMetrics } from './policy.util';
import { ForbiddenError } from '@hyprnz/error';

const configDisabledLens = lensPath(['config', 'disabled']);
const setConfigDisabled = (disabled: boolean = false, pip: PolicyInformation) => set(configDisabledLens, disabled, pip);
const currentDecisionsPass = (pip: PolicyInformation): boolean => {
    if (pip.decisionPointResults) {
        const results = map((decision: boolean) => decision)(values(pip.decisionPointResults));
        return allTrue(results);
    }
    return true;
};

const currentEnforcementsPass = (pip: PolicyInformation): boolean => {
    if (pip.enforcementPointResults) {
        return allTrue(values(pip.enforcementPointResults));
    }
    return true;
};

const ignoreIfPreviousPasses =
    (component: PolicyComponentPoint): PolicyDecisionPoint =>
    async (pip: PolicyInformation): Promise<PolicyInformation> => {
        if (currentDecisionsPass(pip) && currentEnforcementsPass(pip)) {
            return pip;
        }
        return await component(pip);
    };

const createPolicyEnforcerResult = (processedPolicyInfo: PolicyInformation) => {
    const enforcementPointResults = Object.values(processedPolicyInfo?.enforcementPointResults ?? {});
    //  return first enforcement that has a value
    return enforcementPointResults.find((result: any) => !!result);
};
const composePolicyEnforcer = (...policyComponents: PolicyComponentPoint[]): PolicyExecutor => {
    const policyPipeWithPerformance = withPerformanceMetrics('composePolicyEnforcer', pipeWith(andThen)(policyComponents as any));
    return async (pip: PolicyInformation): Promise<any> => {
        const processedPolicyInfo: PolicyInformation = await policyPipeWithPerformance(pip);
        if (processedPolicyInfo.enforcementPointResults) {
            return createPolicyEnforcerResult(processedPolicyInfo);
        }
        const message = 'No EnforcementPolicyPoint configured. ' + 'Please configured one when creating your PolicyExecutor';
        throw new ForbiddenError({ message, details: message });
    };
};

export { ignoreIfPreviousPasses, composePolicyEnforcer, setConfigDisabled };
