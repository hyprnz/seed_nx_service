import { undefined, z, ZodError, ZodIssue, ZodIssueCode, ZodParsedType } from 'zod';
import { ValidateWith, ValidateWithSchema } from './validation.validator';
import { describe, expect, it } from 'vitest';
import { valid } from './validation.util.ts';

const getUsersSchema = z.object({
    query: z
        .object({
            email: z.string({ required_error: 'email is required' }).email({ message: 'Not an email' })
        })
        .required({ email: true })
});

const customEmailRequiredAsyncValidator = async (args: any[]) => {
    if (args[0]?.query?.email === undefined) {
        const validationError: ZodError = ZodError.create([]);
        validationError.addIssue({
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.string,
            inclusive: true,
            message: 'Email is a required field',
            options: [],
            received: ZodParsedType.undefined,
            type: 'string'
        } as unknown as ZodIssue);
        throw validationError;
    }
};

/* eslint-disable */
class MockClass {
    @ValidateWithSchema(getUsersSchema)
    public getUsers(@valid payload: { query: { email: string } }) {}

    @ValidateWith(customEmailRequiredAsyncValidator)
    public getUsersCustomSync(@valid payload: { query: { email: string } }) {}

    @ValidateWith(customEmailRequiredAsyncValidator)
    public async getUsersCustomAsync(@valid payload: { query: { email: string } }) {}
}

/* eslint-enable */

describe('Validator annotations test suite', () => {
    it('should be able to validate using a provided JOI schema', () => {
        // Assemble
        const mockValidPayload: any = { query: { email: 'abc@domain.com' } };
        const mockPayloadRequired: any = { query: { email: undefined } };
        const mockPayloadNotFormatted: any = {
            query: { email: 'thisIsNotAnEmail' }
        };

        // Act / Assert
        try {
            new MockClass().getUsers(mockValidPayload);
        } catch (error) {
            throw new Error(`Should not have had a failure with valid data. Got ${error}`);
        }

        try {
            new MockClass().getUsers(mockPayloadRequired);
        } catch (error: any) {
            expect(error.name).toEqual('ValidationError');
            expect(error.options.payload.details[0]).toEqual({
                code: expect.any(String),
                expected: 'string',
                message: 'Expected string, received function',
                path: ['query', 'email'],
                received: expect.any(String)
            });
        }

        try {
            new MockClass().getUsers(mockPayloadNotFormatted);
            // fail("Should have thrown a validation error");
        } catch (error: any) {
            expect(error.name).toEqual('ValidationError');
            expect(error.options.payload.details[0]).toEqual({
                code: expect.any(String),
                message: 'Not an email',
                path: ['query', 'email'],
                validation: expect.any(String)
            });
        }
    });

    it('should be able to validate using a custom synchronous function', async () => {
        // Assemble
        const mockValidPayload: any = { query: { email: 'abc@domain.com' } };
        const mockPayloadRequired: any = { query: { email: undefined } };

        // Act / Assert
        try {
            await new MockClass().getUsersCustomSync(mockValidPayload);
        } catch (error) {
            throw new Error(`Should not have had a failure with valid data. Got ${error}`);
        }

        try {
            await new MockClass().getUsersCustomSync(mockPayloadRequired);
            // fail("Should have thrown a validation error");
        } catch (error: any) {
            expect(error.name).toEqual('ZodError');
            expect(JSON.parse(error.message)).toEqual([
                {
                    code: 'invalid_type',
                    expected: 'string',
                    inclusive: true,
                    message: 'Email is a required field',
                    options: [],
                    received: 'undefined',
                    type: 'string'
                }
            ]);
        }
    });

    it('should be able to validate using a custom asynchronous function', async () => {
        // Assemble
        const mockValidPayload: any = { query: { email: 'abc@domain.com' } };
        const mockPayloadRequired: any = { query: { email: undefined } };

        // Act / Assert
        try {
            await new MockClass().getUsersCustomAsync(mockValidPayload);
        } catch (error) {
            throw new Error(`Should not have had a failure with valid data. Got ${error}`);
        }

        try {
            await new MockClass().getUsersCustomAsync(mockPayloadRequired);
            // fail("Should have thrown a validation error");
        } catch (error: any) {
            expect(error.name).toEqual('ZodError');
            expect(JSON.parse(error.message)).toEqual([
                {
                    code: 'invalid_type',
                    expected: 'string',
                    inclusive: true,
                    message: 'Email is a required field',
                    options: [],
                    received: 'undefined',
                    type: 'string'
                }
            ]);
        }
    });
});
