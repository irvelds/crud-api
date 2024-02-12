import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { parseBody, sendMethodResponse, sendMessageResponse, validUserData } from '../utilities';
import { STATUS_CODE, RESPONSE_MESSAGES } from '../constants';
import { usersState } from '../state';

export const createUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    try {
        const userData = await parseBody(req, res);
        const isData = await validUserData(res, userData);
        if (isData) {
            const user = { id: uuidv4(), ...userData };
            usersState.push(user);
            sendMethodResponse(res, STATUS_CODE.CREATE_OK, user);
        }
    } catch {
        sendMessageResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.SERVER_ERROR);
    }
};