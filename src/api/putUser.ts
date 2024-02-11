import { IncomingMessage, ServerResponse } from 'http';
import { parseBody, sendMethodResponse, sendMessageResponse, validUserData, validUserId } from '../utilities';
import { RESPONSE_MESSAGES, STATUS_CODE } from '../constants';
import { IUser } from '../types';
import { usersState } from '../state';

const putByID = (id: string, user: IUser) => {
    const indexId = usersState.findIndex((user) => user.id === id);
    if (indexId !== -1) {
        usersState[indexId] = { id, ...user };
        return usersState[indexId];
    }
    else { return null }
};

export const putUser = async (req: IncomingMessage, res: ServerResponse, id: string) => {
    try {
        const resultId = await validUserId(res, id);
        if (resultId) {
            const userData = await parseBody(req, res);
            const validData = await validUserData(res, userData);
            if (validData) {
                const user = putByID(id, userData);
                sendMethodResponse(res, STATUS_CODE.OK, user);
            }
        }
    } catch {
        sendMessageResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.SERVER_ERROR);
    }
};
