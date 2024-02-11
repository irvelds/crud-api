import { IncomingMessage, ServerResponse } from 'http';
import { STATUS_CODE, RESPONSE_MESSAGES } from '../constants';
import { sendMethodResponse, sendMessageResponse } from '../utilities';
import { usersState } from '../state';

const BASE_URL = /^[\/](api\/users)[\/]?$/;

export const getAllUsers = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    try {
        if (!BASE_URL.test(req.url as string)) {
            sendMessageResponse(res, STATUS_CODE.NOT_FOUND, RESPONSE_MESSAGES.ENDPOINT_ERROR);
            return
        }
        sendMethodResponse(res, STATUS_CODE.OK, usersState);
    } catch {
        sendMessageResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.SERVER_ERROR);
    }
};
