# `@hyprnz/validation`

This package is designed to provide easy out-of-the-box custom annotated validation for controllers and general
validation for all API calls as middleware.

## Requirements

You must have an up-to-date version of the following to use this package

-   express 4.x

## Installation

```sh
npm install @hyprnz/validation
```

## Usage: controller validation

To use with your controller, do the following. This is an example of an API call that returns a list of users whereby the
caller has to provide a valid email address. The controller file is called users.ts

Create a file called users.validator.ts to create your validator

```ts
import { z } from 'zod';

const getUsersSchema: z.Schema = z.object({
    query: z
        .object({
            email: z.string({ required_error: 'Email is required' }).email({ message: 'Not an email' })
        })
        .required({ email: true })
});

export { getUsersSchema };
```

Now use your validator with your controller users.ts

```ts
import { validateWithSchema } from '@hyprnz/validation';

class UsersController {
    @validateWithSchema(getUsersSchema)
    public getUsers(req: Request, res: Response) {
        this.logger.info('getUsers was called', { some: 'meta', data: 'to show' });
        return successResponse(res, getUsersSample);
    }
}
```

**NOTE: `@validateWtihSchema` is pre-built with the following Zod settings**

-   **passThrough=true** (not fail on extra unknown fields to support backwards/forwards compatability)
-   **abortEarly=false** (to ensure we return the complete list of validation errors not just the first one)

This will result in a Validation error being caught. If you are using this packages error middleware then this will
be formatted correctly when sent back to the caller - [Error package](@hyprnz/error)

## Usage: middleware validation

To use the package to validate things that every API call should have you can use the middleware implementation

For example, to validate to make sure every API call has a correlation Id by registering the following middleware

```ts
import { makeValidateRequestHeadersMiddleware } from '@hyprnz/validation';

app.use(makeValidateRequestHeadersMiddleware(['X-Organisation-Correlation-Id']));
```

NOTE: instead of a Validation error, this will through a BadRequest Error instead
