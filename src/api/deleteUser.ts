import { IncomingMessage, ServerResponse } from 'http';
import { RESPONSE_MESSAGES, STATUS_CODE } from '../constants';
import { sendMethodResponse, sendMessageResponse, validUserId } from '../utilities';
import { IUser } from '../types'
import { usersState } from '../state';

const deleteUserByID = async (id: string) => {
    // const userId = userData.filter((item) => item.id === id)[0];
    const indexId = usersState.findIndex((user: IUser) => user.id === id);
    const user = usersState.splice(indexId, 1);
    return user;
};

export const deleteUser = async (req: IncomingMessage, res: ServerResponse, id: string): Promise<void> => {
    try {
        const isId = await validUserId(req, res, id);
        if (isId) {
            const user = await deleteUserByID(id);
            sendMethodResponse(res, STATUS_CODE.DELETE_OK, user);
        }
    } catch {
        sendMessageResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.SERVER_ERROR);
    }
};
