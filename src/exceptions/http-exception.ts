export type HttpStatus = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 500;
export const HttpStatus = {
    OK: 200 as HttpStatus,
    CREATED: 201 as HttpStatus,
    NOT_CONTENT: 204 as HttpStatus,
    BAD_REQUEST: 400 as HttpStatus,
    UNAUTHORIZED: 401 as HttpStatus,
    FORBBIDEN: 403 as HttpStatus,
    NOT_FOUND: 404 as HttpStatus,
    CONFLICT: 409 as HttpStatus,
    INTERNAL_SERVER_ERROR: 500 as HttpStatus,
} as const;

export class HttpException extends Error {
    public statusCode: number;

    public constructor(statusCode: number, message: string) {
        (super(message), (this.statusCode = statusCode));
    }
}
