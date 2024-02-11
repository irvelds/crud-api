import { ServerResponse } from 'http';
import { STATUS_CODE, RESPONSE_MESSAGES } from '../constants';
import { sendMethodResponse, sendMessageResponse} from '../utilities';
import { usersState } from '../state';

export const getAllUsers = async (res: ServerResponse): Promise<void> => {
    try {
        sendMethodResponse(res, STATUS_CODE.OK, usersState);
    } catch {
        sendMessageResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.SERVER_ERROR);
    }
};
