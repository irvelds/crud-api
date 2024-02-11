import { IncomingMessage, ServerResponse } from 'http';
import { STATUS_CODE, RESPONSE_MESSAGES } from '../constants';
import { sendMethodResponse, sendMessageResponse, validUserId } from '../utilities';
import {usersState} from '../state'
export const getUser = async (req: IncomingMessage, res: ServerResponse, id: string): Promise<void> => {
    try {
        const isId = await validUserId(res, id);
        if (isId) {
            const user = usersState.find((user) => user.id === id);
            sendMethodResponse(res, STATUS_CODE.OK, user);
        }
    } catch {
        sendMessageResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.SERVER_ERROR);
    }
};