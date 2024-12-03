import { PolicyDecisionPoint, PolicyInformation } from '../../policy.types';
import { innerJoin, isEmpty, isNil, not } from 'ramda';
import { isAuthorisedByActivity } from '../decisionPoints.util';
import { isNilOrEmpty, withPerformanceMetrics } from '../../policy.util';
import { makeLogger } from '@hyprnz/logger';
import { MakeIsOwnerDecisionOptions } from './isOwnerDecision.types';

const logger = makeLogger('policyEnforcer:decisionPoint:isOwner');

const identitiesMatch = (left: string, right: string) => (left && right ? left.toLowerCase().trim() === right.toLowerCase().trim() : false);
const canRunDecision = (pip: PolicyInformation) => not(isNilOrEmpty(pip.object?.id)) && not(isNilOrEmpty(pip.subject.identityAssertions));

const subjectIsOwnerOfObject = (pip: PolicyInformation) => {
    if (pip.object?.owners && pip.subject.identityAssertions) {
        return not(isEmpty(innerJoin(identitiesMatch, pip.subject.identityAssertions || [], pip.object.owners || [])));
    }
    logger.warn(
        `${pip.object?.type} is not supported for isOwner decision. Please update isOwner to support object ` +
            `type ${pip.object?.type}. isOwner will return false until then`
    );
    return false;
};

const isOwner = (pip: PolicyInformation, owningActivity: string | undefined): boolean =>
    pip.object?.owners && subjectIsOwnerOfObject(pip)
        ? isNilOrEmpty(owningActivity)
            ? true
            : isAuthorisedByActivity(owningActivity as string, pip.subject.activities || [])
        : false;

const hydratePipWithObjectOwners = async (
    pip: PolicyInformation,
    getOwnersForObjectId?: (id: string) => Promise<string[]>
): Promise<PolicyInformation> => {
    if (not(isNilOrEmpty(pip?.object?.owners)) || isNil(getOwnersForObjectId)) {
        return pip;
    } else {
        const getOwnersForObjectIdWithPerformance = withPerformanceMetrics('ownersForObject', getOwnersForObjectId);
        return {
            ...pip,
            object: {
                ...pip.object,
                owners: not(isNilOrEmpty(pip.object?.owners))
                    ? pip.object?.owners
                    : isNil(pip.object?.id)
                    ? []
                    : await getOwnersForObjectIdWithPerformance(pip.object?.id)
            }
        };
    }
};

const makeIsOwnerDecisionResult = (pip: PolicyInformation, isOwnerResult: boolean): PolicyInformation => ({
    ...pip,
    decisionPointResults: {
        ...pip.decisionPointResults,
        isOwner: isOwnerResult
    }
});

/**
 * A user is an owner under the following conditions
 * 1. pip.object.owners overlaps with pip.subject.identityAssertions
 * 2. AND / OR owningActivity (if provided) overlaps with pip.subject.identityAssertions
 *
 * @param options {
 *     owningActivity - if provided then users must have this activity in order to access objects they own
 *     getOwnersForObjectId - optional alternative to using pip.object.owners. This function can get
 *          this list instead when figuring out if subject is owner of object
 * }
 */
const makeIsOwnerDecision =
    (options?: MakeIsOwnerDecisionOptions): PolicyDecisionPoint =>
    async (pip: PolicyInformation): Promise<PolicyInformation> => {
        if (canRunDecision(pip)) {
            const hydratedPipWithObjectOwners: PolicyInformation = await hydratePipWithObjectOwners(pip, options?.getOwnersForObjectId);
            return makeIsOwnerDecisionResult(hydratedPipWithObjectOwners, isOwner(hydratedPipWithObjectOwners, options?.owningActivity));
        }
        return makeIsOwnerDecisionResult(pip, false);
    };

export { makeIsOwnerDecision };
