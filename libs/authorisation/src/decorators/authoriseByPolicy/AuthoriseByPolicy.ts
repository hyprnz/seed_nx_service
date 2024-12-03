import {
    authoriseByPolicyMetadataKey,
    findDomainIdFromParameters,
    findDomainType,
    getUserFromParametersOrThrow,
    shouldSkip
} from './authoriseByPolicy.util';
import { AllowDeny, PolicyInformation } from '../../policy';
import { AuthoriseByPolicyOptions } from './authoriseByPolicy.types';

const decorateWithPolicyAuthorisation = (originalMethod: any, target: any, propertyKey: any, receiver: any) => {
    const domainType = findDomainType(target);
    const options: AuthoriseByPolicyOptions = Reflect.getMetadata(authoriseByPolicyMetadataKey, target, propertyKey);
    return function (...args: any[]) {
        const user = getUserFromParametersOrThrow(target, propertyKey, args);

        if (options && shouldSkip(options.skip, user)) {
            return originalMethod.apply(receiver, args);
        }
        const domainId = findDomainIdFromParameters(target, propertyKey, args);

        const pip: PolicyInformation = {
            subject: {
                identityAssertions: user.subject ? [user.subject] : [],
                activities: user.activities
            },
            object: {
                id: domainId,
                type: domainType
            },
            actions: options.actions ? options.actions : []
        };
        return options.policy(pip).then((result: any) => {
            if (result === true || result.allow === AllowDeny.ALLOW) {
                return originalMethod.apply(receiver, args);
            }
            if (domainId) {
                throw new Error(`Unauthorised for ${domainType} with ids: ${domainId} and/or you require missing activities ${options.actions}`);
            }
            throw new Error(`Unauthorised. You require missing activities ${options.actions}`);
        });
    };
};

const AuthoriseByPolicy = (options: AuthoriseByPolicyOptions) => {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(authoriseByPolicyMetadataKey, options, target, propertyKey);
    };
};

export { AuthoriseByPolicy, decorateWithPolicyAuthorisation };
