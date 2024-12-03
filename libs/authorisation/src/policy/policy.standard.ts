import {
    makeHasAtLeastOneActionDecision,
    makeThrowAuthZExceptionEnforcement,
    PolicyBuilder,
    PolicyExecutor,
    ThrowFailureCondition
} from './index.ts';
import { makeIsOwnerDecision } from './decisionPoints/isOwnerDecision/isOwnerDecision';
import { MakeIsOwnerDecisionOptions } from './decisionPoints/isOwnerDecision/isOwnerDecision.types';

const makeIsOwnerOrHasAtLeastOneActionPolicy = (options: { isOwnerOptions: MakeIsOwnerDecisionOptions }): PolicyExecutor =>
    PolicyBuilder.make()
        .addDecisionPoint(makeIsOwnerDecision(options.isOwnerOptions))
        .addDecisionPoint(makeHasAtLeastOneActionDecision())
        .addEnforcementPoint(
            makeThrowAuthZExceptionEnforcement({
                failureCondition: ThrowFailureCondition.THROW_ON_ALL_DECISIONS_FALSE
            })
        )
        .build();

export { makeIsOwnerOrHasAtLeastOneActionPolicy };
