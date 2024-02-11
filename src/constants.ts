export const STATUS_CODE = {
    OK: 200,
    CREATE_OK: 201,
    DELETE_OK: 204,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    Not_Implemented: 501,
};


export const METHODS = {
    GET: 'GET',
    POST: 'POST',
    DELETE: 'DELETE',
    PUT: 'PUT',
};

export const ENDPOINT = '/api/users';

export const RESPONSE_MESSAGES = {
    NOT_USER_ID: 'User does not exist with this id',
    NOT_UUID: 'Provided ID is not a valid uuid value',
    INVALID_BODY: 'Invalid Body',
    REQUARED_FIELDS_ERROR: 'Body does not contain required fields',
    INVALID_DATA: 'Invalid User data',
    SERVER_ERROR: 'An error occurred on the server side',
    ENDPOINT_ERROR: 'Non-existing endpoints',
    METHOD_ERROR: 'Method is invalid',
};