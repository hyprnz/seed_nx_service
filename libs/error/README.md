# `@hyprnz/errors`

This package is designed to help you handle common HTTP errors when working with microservices.

## Requirements

You must have an up-to-date version of the following to use this package

-   express 4.x

## Installation

```sh
npm install @hyprnz/error
```

## Usage: global error handling with middleware

To catch common error thrown by many of the packages in this mono-repo and return then in the correct format just register
the following middleware

```ts
import { errorHandlerMiddleware } from '@packages/error';
app.use(makeErrorHandlerMiddleware(logger));
```

NOTE: if NODE_ENV is set to 'development' then you will also get a stack trace returned when an error occurs

then indicate which routes who's error you'd like the errorMiddleware to manage. E.g. in the case of the route "/users"
you can decorate usersController.getUsers with the higher order function withErrorHandlerSupport

```ts
import { withErrorHandlerSupport } from '@packages/error';

app.get('/users', withErrorHandlerSupport(usersController.getUsers.bind(usersController)));
```

## Usage: Create meaningful exceptions

Import the abstract BaseError and create your custom exception:

```ts
import { BaseError, ErrorPayloadOptions } from '@packages/error';

export class CanNotFetchUserDataError extends BaseError {
    constructor(payload: ErrorPayloadOptions) {
        super({
            statusCode: 500,
            name: 'CanNotFetchUserDataError',
            payload
        });
    }
}
```

## Throwing errors

To use the built-in exceptions, simply import the error in your code.

```ts
import { NotFoundError } from '@packages/error';

throw new NotFoundError('Resource id xxx not found');
```

Or throw your own exceptions:

```ts
import { CanNotFetchUserDataError } from './error';

throw new CanNotFetchUserDataError({
    message: 'Atomic service not available',
    details: 'Example: Connection timeout'
});
```

Error object structure

```json
{
    "error": {
        "statusCode": 999,
        "name": "ErrorName",
        "message": "Error message",
        "details": "error details"
    },
    "stack": [
        "ErrorName: ",
        "    at UsersController.getUsers (...)",
        "    at C:\\Users\\modernise\\sandbox\\packages-common\\packages\\validation\\src\\validation\\validation.validator.ts:24:36"
    ],
    "correlationId": "55504dff-d254-03db-58c5-9d1dd5995b6f"
}
```

-   The stack information is only available when NODE_ENV is 'development'
-   The correlationId is picking from the "x-Organisation-Correlation-Id" headers which is injected by 3scale. If the header is not present, the correlationId value will be null.

## List of Errors

Below is a list of built-int errors which are included in this package:

**1. BadRequestError**

```json
{
    "error": {
        "statusCode": 400,
        "name": "BadRequestError",
        "message": "Bad Request",
        "details": "Invalid request message framing"
    }
}
```

**2. NotFoundError**

```json
{
    "error": {
        "statusCode": 404,
        "name": "NotFoundError",
        "message": "Not Found",
        "details": "Resource not found"
    }
}
```

**3. ForbiddenError**

```json
{
    "error": {
        "statusCode": 403,
        "name": "ForbiddenError",
        "message": "Forbidden",
        "details": "Access denied"
    }
}
```

**4. UnauthorizedError**

```json
{
    "error": {
        "statusCode": 401,
        "name": "UnauthorizedError",
        "message": "Unauthorized",
        "details": "JWT token not valid"
    }
}
```

**5. InternalServerError**

```json
{
    "error": {
        "statusCode": 500,
        "name": "InternalServerError",
        "message": "Internal Server Error",
        "details": "Could not read file"
    }
}
```

**6. UnknownError**

```json
{
    "error": {
        "statusCode": 520,
        "name": "UnknownError",
        "message": "Unknown Error",
        "details": "JSON malformed error"
    }
}
```

**7. ValidationError**

```json
{
    "error": {
        "statusCode": 400,
        "name": "ValidationError",
        "message": "Joi schema validation error",
        "details": "Email is required"
    }
}
```

## The UnknownError

The propose of this error class is handle the "unhandled" errors:

-   Third-party libraries exceptions.
-   Exceptions that doesn't have a meaningful representation.
-   Run time exceptions which are not neccesary mapping are Internal Server Errors.
