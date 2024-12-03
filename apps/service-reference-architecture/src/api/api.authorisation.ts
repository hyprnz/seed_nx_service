import { makeHasActionsDecision, makeThrowAuthZExceptionEnforcement, PolicyBuilder } from '@hyprnz/authorisation';

const userHasActionsPolicy = PolicyBuilder.make()
    .addDecisionPoint(makeHasActionsDecision())
    .addEnforcementPoint(makeThrowAuthZExceptionEnforcement())
    .build();

export { userHasActionsPolicy };
