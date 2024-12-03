import { UserProfile } from './authoriseByPolicy.types';

const requestMetadataKey = 'requestMetadataKey';
const userProfileMetadataKey = 'userProfileMetadataKey';
const domainIdMetadataKey = 'domainIdMetadataKey';
const domainIdsMetadataKey = 'domainIdsMetadataKey';
const authoriseByPolicyMetadataKey = 'authoriseByPolicyMetadataKey';

function request(target: any, propertyKey: string | symbol, parameterIndex: number) {
    Reflect.defineMetadata(requestMetadataKey, parameterIndex, target, propertyKey);
}

function user(target: any, propertyKey: string | symbol, parameterIndex: number) {
    Reflect.defineMetadata(userProfileMetadataKey, parameterIndex, target, propertyKey);
}

function domainIds(target: any, propertyKey: string | symbol, parameterIndex: number) {
    Reflect.defineMetadata(domainIdsMetadataKey, parameterIndex, target, propertyKey);
}

function domainId(target: any, propertyKey: string | symbol, parameterIndex: number) {
    Reflect.defineMetadata(domainIdMetadataKey, parameterIndex, target, propertyKey);
}

const isDefined = <T>(value: T | undefined | null): value is T => !isUndefinedOrNull(value);

const isString = (s: any): s is string => {
    return typeof s === 'string';
};

const isNumber = (value: any): boolean => {
    return typeof value === 'number' && !isNaN(value);
};

const isUndefinedOrNull = (value: any): value is null | undefined => {
    return value === undefined || value === null;
};

const findIndex = (target: any, propertyKey: any, key: string, name: string, isRequired = true): number => {
    const index: number = Reflect.getMetadata(key, target, propertyKey);
    if (!isNumber(index) && isRequired) {
        throw new Error(`Missing @${name} parameter decorator`);
    }
    return index;
};

const findUserIndex = (target: any, propertyKey: any, isRequired = true): number => {
    return findIndex(target, propertyKey, userProfileMetadataKey, 'user', isRequired);
};

const findUser = (target: any, propertyKey: any, args: any[]): UserProfile => {
    return [args[findUserIndex(target, propertyKey, false)], args.find((x) => x && isDefined(x.user))?.user].filter(isDefined)[0];
};

const findRequestIndex = (target: any, propertyKey: any, isRequired = true): number => {
    return findIndex(target, propertyKey, requestMetadataKey, 'request', isRequired);
};

const findRequest = (target: any, propertyKey: any, args: any[]): { headers: { user: UserProfile } } => {
    return [args[findRequestIndex(target, propertyKey, false)], args.find((x) => x && isDefined(x.request))?.request].filter(isDefined)[0];
};

const findDomainIdIndex = (target: any, propertyKey: any, isRequired = true): number => {
    return findIndex(target, propertyKey, domainIdMetadataKey, 'domainId', isRequired);
};

const findDomainIdFromParameters = (target: any, propertyKey: any, args: any[]): string | undefined => {
    const domainId = args[findDomainIdIndex(target, propertyKey, false)];
    if (isString(domainId) && domainId.length > 0) {
        return domainId;
    }
};

const findDomainType = (target: any): string => {
    const domainType = (target as any).domainType;
    if (isDefined(domainType)) {
        return domainType;
    }
    throw new Error('Unable to determine domainType, have you added AuthorisableByResource class decorator?');
};

const getUserFromParametersOrThrow = (target: any, propertyKey: any, args: any[]): UserProfile => {
    const user = findUser(target, propertyKey, args);
    if (user) {
        return user;
    }
    const request = findRequest(target, propertyKey, args);
    if (request) {
        return request.headers.user;
    }
    throw new Error('Could not find user in @request or @user parameters');
};

const shouldSkip = (skipForActivities: string[] | undefined, user: { activities: string[] }): boolean => {
    if (!Array.isArray(skipForActivities) || !Array.isArray(user.activities)) {
        return false;
    }
    for (const activity of user.activities) {
        if (skipForActivities.includes(activity)) {
            return true;
        }
    }
    return false;
};

export {
    getUserFromParametersOrThrow,
    user,
    request,
    domainId,
    domainIds,
    shouldSkip,
    findDomainType,
    findDomainIdFromParameters,
    authoriseByPolicyMetadataKey
};
