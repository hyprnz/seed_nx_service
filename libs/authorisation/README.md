# Authorisation Package

## Contents

- [Getting Started](#getting-started)
- [Convenience or ready to use policy executors](#convenience-or-ready-to-use-policy-executors)
- [Overview](#overview)
- [Developer values that guide this package's development](#developer-values-that-guide-this-packages-development)
- [Available Information Points](src/informationPoints/README.md)
- [Available Decision Points](src/decisionPoints/README.md)
- [Available Enforcement Points](src/enforcementPoints/README.md)
- [Annotations/Decorators](#annotationsdecorators)

## Getting started

### Annotations/Decorators
You can use either @request or @user to provide UserContext
@user - expects userObject to have this structure
```typescript
interface UserContext {
    subject: string;
    activities: string[];
}
```
@request - expects request to have user on its scope
```typescript
interface Request {
    user: UserContext
}
```

```typescript
import {user, request, AuthorisableByResource, AuthoriseByPolicy} from '@hyprnz/authorisation';

@AuthorisableByResource('event')
export class EventController {

    @AuthoriseByPolicy({ policy: postEventPolicy, actions: ['*:resource:event:create'] })
    public authWithUserAndActivity(@user user: UserContext) {

    }

    @AuthoriseByPolicy({ policy: postEventPolicy, actions: ['*:resource:event:create'] })
    public authWithRequestAndActivity(@request request: Request) {

    }
}
```

## Convenience or ready to use policy executors

These are located in src/policy.standard and are provided as simple starter authorisation policy executors but you should really
make your own

| Policy                 | description                                                                                 | inputs                       | outputs                                         |
|------------------------|---------------------------------------------------------------------------------------------|------------------------------|-------------------------------------------------|
| makeIsOwnerOrHasAtLeastOneActionPolicy | Returns ALLOW only when at least one required action can be found in pip.subject.activities | pip.actions must be provided | Throws exception if DENY. Returns ALLOW on true |

## Overview

Implementing authorisation or decision-making in an application can be hard to implement and harder to reason about.
It can result in fragments of scattered code across your service and data from multiple locations or other services like
profile data. This package attempts to centralise that implementation and lower the learning curve or entry point
to do simple and complex authorisation or policy decisions in a node.js service.

An example of an implementation using this package is below. It only marks the enforcement as true, if for a specific
action, the user has the right activity before making an enforcement decision. E.g. what follows are OO and functional examples
depending on your style or preference

```typescript
import { PolicyInformation } from './policy.types';

interface PolicyInformation {
    subject: {
        identityAssertions?: string[]   // Identities of the user
        activities: string[]            // Activities the user has
    }
    object: {                           // Thing you want access to
        id?: string;
        type?: string;
        owners?: string[];
        data?: any;
    }                    
    actions: string                     // Activities or actions (verb or predicate) thing you are trying to do 
}

// Policy information going into policy decision
const policyInfo: PolicyInformation = {
    subject: {
        identityAssertions: [
            'azureAD:subject:12345'
        ],
        activities: [
            'request:resource:request:create',
            'request:resource:request:re-open'
        ]
    },
    object: {
        id: 'request:id:12345'
    },
    actions: ['request:resource:request:create']
};


// Policy decision and enforcement configuration
// OO implementation
const OO_EXECUTOR: PolicyExecutor = new PolicyExecutorBuilder()
    .addInformationPoint(makeAccessTokenInformationPoint(accessToken))
    .addDecisionPoint(makeHasActionDecision())
    .addDecisionPoint(makeHasOneOrMoreActivities(['request:resource:request:re-open']))
    .addEnforcementPoint(makeReturnAllowDeny())
    .build();


// Functional implementation
const FUNCTIONAL_EXECUTOR: PolicyExecutor = composePolicyExecutor(
    makeAccessTokenInformationPoint(getUserInfo),
    makeHasActionDecision(),
    makeHasOneOrMoreActivities(['request:resource:request:re-open']),
    makeReturnAllowDeny()
);


// Policy enforcement/execution
await OO_EXECUTOR(policyInfo);
await FUNCTIONAL_EXECUTOR(policyInfo);
```

Let's break this down a bit. The architecture of policies are split up into the following:

**PIP (policy information point)**
Data used to make a decision e.g. activities, access token. Has the structure

- **subject** - The person/user requesting access e.g. oAuth or Person party user
- **object** - The thing they want access to e.g. request/group/claim/quote
- **actions/predicates** - What the subject wants to do with the object e.g. 'request:resource:request:create'

**PDP (policy decision point)**
Rules used to describing a decision e.g. hasActionsDecision, hasAtLeastOneActionDecision

**PEP (policy enforcement point)**
Actions, what to do when a decision or decisions are not true e.g. throw 403 Error, ignore, return ALLOW/DENY

NOTE: When using this package you do not need to do everything in one place. You may decide to make a decision but
enforce it somewhere else. This architecture accepts that the information, decisions and
enforcement of those decisions are not necessarily done by the same service in the same place.

## Special modifiers

### Configuration

If you need to fine tune your authorisation pipeline such as turning authZ off dynamically, there is a config
section you can add to do this. This example shows how you can disable authorisation dynamically at runtime.

```typescript
await authorise({
  config: {
    disabled: options?.ignoreAuthorisation
  },
  subject: {
    identityAssertions: ['azureAD:subject:12345']
  },
  object: {
    id: 'request:id:12345'
  },
  actions: ['request:resource:request:create']
});
```

#### Possible config options

| Config Option | Description                                                                                                                                                                                                                               | Options/Configuration                                        | Notes |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|-------|
| disabled      | when set to true at runtime, the policy executor will not run. <br/>It will immediately return a happy true case similar to if it had <br/>run and all decisions had passed. No network calls are made, <br/>no policy components are run | **Possible values**: true/false. <br/><br/>Defaults to false |       |

### ignoreIfPreviousPasses

Say you have the following executor

```typescript
const OO_EXECUTOR: PolicyExecutor = new PolicyExecutorBuilder()
  .addDecisionPoint(makeHasActionsDecision())
  .addDecisionPoint(makeHasOneOrMoreActivities(['request:resource:request:re-open'])
  .addEnforcementPoint(makeReturnAllowDeny())
  .build();
```

and you don't want to bother running the _isOwnerDecision_ if the executor has already passed the
_hasActionDecision_ check. You can use the higher order function **ignoreIfPreviousPasses** to do this like
so

```typescript
const OO_EXECUTOR: PolicyExecutor = new PolicyBuilder()
  .addDecisionPoint(makeHasActionsDecision())
  .addDecisionPoint(ignoreIfPreviousPasses(makeHasOneOrMoreActivities(['request:resource:request:re-open']))
  .addEnforcementPoint(makeReturnAllowDeny())
  .build();
```

This will instruct the policy executor to make sure that the _makeHasOneOrMoreActivities_ check is ignored if the
previous decision
_hasAction_ has already passed

### setConfigDisabled

It can get tiresome writing the following all the time when you want to control when authorisation is enabled

```typescript
await authorise({
  config: {
    disabled: options?.ignoreAuthorisation
  },
  subject: {
    identityAssertions: ['azureAD:subject:12345']
  },
  object: {
    id: 'request:id:12345'
  },
  actions: ['request:resource:request:create']
});
```

Now you can write this instead and let a higher order function set it for you

```typescript
const pip: PolicyInformation = {
  subject: {
    identityAssertions: ['azureAD:subject:12345']
  },
  object: {
    id: 'request:id:12345'
  },
  actions: ['request:resource:request:create']
};
const policyInfoWithConfig = setConfigDisabled(options?.ignoreAuthorisation, pip);
await authorise(policyInfoWithConfig);
```

Keep a lookout for more of these higher order functions to create declarative config pipes to build out your
policy information
