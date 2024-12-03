import 'reflect-metadata';
import { ZodError, ZodSchema } from 'zod';
import { ValidationError } from '@hyprnz/error';
import { getValidFromParametersOrThrow } from './validation.util.ts';

/**
 * Annotations have been re-written. This is only doc you can rely on that explains how to use
 * decorators - https://github.com/tc39/proposal-decorators
 */

/**
 * Provide a customer validator that can throw validation exceptions
 *
 * @param validator custom validator
 */
const ValidateWith = (validator: (payload: any) => Promise<void>): any => {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        const annotatedArtefact = descriptor.value;
        if (typeof annotatedArtefact === 'function') {
            descriptor.value = async function (...args: any[]) {
                const payloadToValidate = getValidFromParametersOrThrow(target, propertyKey, args);
                return validator(payloadToValidate).then(() => {
                    return annotatedArtefact.call(this, ...args);
                });
            };
        }
        return descriptor;
    };
};

/**
 * Normally we would use a parameter annotation to find the payload instead of relying on an index but
 * Microsoft has re-written decorators and haven't yet implemented parameter annotations
 * Refer: https://blog.logrocket.com/practical-guide-typescript-decorators/
 *
 * @param schema Zod based schema to provide main validation
 * processThrough=true and abortEarly=false
 * @throws ValidationError
 */
const ValidateWithSchema = (schema: ZodSchema): any => {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        const annotatedArtefact = descriptor.value;
        if (typeof annotatedArtefact === 'function') {
            descriptor.value = function (...args: any[]) {
                const payloadToValidate = getValidFromParametersOrThrow(target, propertyKey, args);
                try {
                    schema.parse(payloadToValidate);
                } catch (error: any) {
                    if (error instanceof ZodError) {
                        throw new ValidationError({
                            message: error.name,
                            details: error.errors
                        });
                    }
                    throw error;
                }
                return annotatedArtefact.call(this, ...args);
            };
        }
        return descriptor;
    };
};

export { ValidateWithSchema, ValidateWith };
