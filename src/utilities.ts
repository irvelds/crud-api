
import { IncomingMessage, ServerResponse } from 'http';
import { RESPONSE_MESSAGES, STATUS_CODE } from './constants';
import { IUser } from './types';
import { validate as uuidValid, version as uuidVersion } from 'uuid';
import { usersState } from './state';


export const sendMethodResponse = (
    res: ServerResponse,
    statusCode: number,
    response: IUser | IUser[] | null | undefined,
): void => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ code: statusCode, response }));
};

export const sendMessageResponse = (
    res: ServerResponse,
    statusCode: number,
    message: string,
): void => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ code: statusCode, message}));
};


export const isExistUser = (id: string): IUser | null => {
    const userId = usersState.find((user) => user.id === id);
    return userId ? userId : null;
};

export const validUserId = async (res: ServerResponse, id: string) => {
    try {
        if (!(uuidValid(id) && uuidVersion(id) === 4)) {
            sendMessageResponse(res, STATUS_CODE.BAD_REQUEST, RESPONSE_MESSAGES.NOT_UUID);
            return false;
        }
        if (!isExistUser(id)) {
            sendMessageResponse(res, STATUS_CODE.NOT_FOUND, RESPONSE_MESSAGES.NOT_USER_ID);
            return false;
        }
    } catch {
        sendMessageResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.SERVER_ERROR);
        return false;
    }
    return true;
};




export const parseBody = (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
): Promise<IUser> => {
    return new Promise((resolve) => {
        const chunks: Uint8Array[] = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => {
            try {
                const userData = JSON.parse(Buffer.concat(chunks).toString());
                resolve(userData);
            } catch {
                sendMessageResponse(res, STATUS_CODE.BAD_REQUEST, RESPONSE_MESSAGES.INVALID_BODY);
            }
        });
    });
};

export const validUserData = async (res: ServerResponse, userData: IUser) => {
    try {
        if (
            !userData.age ||
            !userData.hobbies ||
            !userData.username ||
            Object.keys(userData).length === 0
        ) {
            sendMessageResponse(
                res,
                STATUS_CODE.BAD_REQUEST,
                RESPONSE_MESSAGES.REQUARED_FIELDS_ERROR,
            );
            return false;
        }
        if (
            typeof userData.username !== 'string' ||
            typeof userData.age !== 'number' ||
            !Array.isArray(userData.hobbies) ||
            !(
                userData.hobbies.filter((e) => typeof e === 'string').length ===
                userData.hobbies.length
            )
        ) {
            sendMessageResponse(res, STATUS_CODE.BAD_REQUEST, RESPONSE_MESSAGES.INVALID_DATA);
            return false;
        }
    } catch {
        sendMessageResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.SERVER_ERROR);
        return false;
    }
    return true;
};
