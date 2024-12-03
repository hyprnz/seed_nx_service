import { UnauthorizedError, BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnknownError, ValidationError } from './errors';
export type APIError = BadRequestError | ForbiddenError | InternalServerError | NotFoundError | UnauthorizedError | UnknownError | ValidationError;
