const validMetadataKey = 'validMetadataKey';

function valid(target: any, propertyKey: string | symbol, parameterIndex: number) {
    Reflect.defineMetadata(validMetadataKey, parameterIndex, target, propertyKey);
}

const isUndefinedOrNull = (value: any): value is null | undefined => {
    return value === undefined || value === null;
};

const isDefined = <T>(value: T | undefined | null): value is T => !isUndefinedOrNull(value);

const isNumber = (value: any): boolean => {
    return typeof value === 'number' && !isNaN(value);
};

const findIndex = (target: any, propertyKey: any, key: string, name: string, isRequired = true): number => {
    const index: number = Reflect.getMetadata(key, target, propertyKey);
    if (!isNumber(index) && isRequired) {
        throw new Error(`Missing @${name} parameter decorator`);
    }
    return index;
};

const findValidIndex = (target: any, propertyKey: any, isRequired = true): number => {
    return findIndex(target, propertyKey, validMetadataKey, 'valid', isRequired);
};

const findValid = (target: any, propertyKey: any, args: any[]): any => {
    return [args[findValidIndex(target, propertyKey, false)], args.find((x) => x && isDefined(x.valid))?.valid].filter(isDefined)[0];
};

const getValidFromParametersOrThrow = (target: any, propertyKey: any, args: any[]): any => {
    const valid = findValid(target, propertyKey, args);
    if (valid) {
        return valid;
    }
    throw new Error('Could not object to validate in @valid parameter');
};

export { valid, getValidFromParametersOrThrow };
