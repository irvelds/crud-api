import { IncomingMessage, ServerResponse } from 'http';
import { METHODS, STATUS_CODE, RESPONSE_MESSAGES, ENDPOINT } from './constants';
import { IUser } from './types';
import { getUser } from './api/getUser';
import { getAllUsers } from './api/getAllUser';
import { deleteUser } from './api/deleteUser';
import { createUser } from './api/postUser';
import { putUser } from './api/putUser';
import { sendMessageResponse } from './utilities';
import { usersState, updateUsersState } from './state';
import cluster from 'cluster';

export const handler = async (req: IncomingMessage, res: ServerResponse) => {
    if (cluster.isWorker) {
        await balancer(req, res);
    } else {
        await router(req, res, usersState);
    }
};

export const balancer = async (req: IncomingMessage, res: ServerResponse) => {
    process.send!({ action: 'get' });
    process.once('message', async (user: IUser[]) => {
        const usersData = await router(req, res, user);
        process.send!({ action: 'send', usersData: usersData });
    });
};

export const router = async (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    usersState: IUser[],
): Promise<IUser[] | undefined> => {
    res.setHeader('Content-Type', 'application/json');
    let parseId: string | null = null;
    if (req.url) {
        parseId = req.url.replace(`${ENDPOINT}`, '');
        parseId = parseId.length > 1 ? parseId.slice(1) : null;
    }

  

    try {
        updateUsersState(usersState);
        if (req.url && !req.url.startsWith(ENDPOINT)) {
            sendMessageResponse(res, STATUS_CODE.NOT_FOUND, RESPONSE_MESSAGES.ENDPOINT_ERROR);
            return;
        }
        switch (req.method) {
            case METHODS.GET:
                if (parseId && req.url!.startsWith(`${ENDPOINT}\/`)) {
                    await getUser(req, res, parseId);
                } else  {
                    await getAllUsers(req, res);
                }
                break;
            case METHODS.POST:
                if (parseId || (req.url !== ENDPOINT && req.url !== `${ENDPOINT}\/`)) {
                    sendMessageResponse(
                        res,
                        STATUS_CODE.NOT_FOUND,
                        RESPONSE_MESSAGES.ENDPOINT_ERROR,
                    );
                } else {
                    await createUser(req, res);
                }
                break;
            case METHODS.DELETE:
                if (parseId && req.url!.startsWith(`${ENDPOINT}\/`)) {
                    await deleteUser(req, res, parseId);
                } else {
                    sendMessageResponse(
                        res,
                        STATUS_CODE.NOT_FOUND,
                        RESPONSE_MESSAGES.ENDPOINT_ERROR,
                    );
                }
                break;
            case METHODS.PUT:
                if (parseId && req.url!.startsWith(`${ENDPOINT}\/`)) {
                    await putUser(req, res, parseId);
                } else {
                    sendMessageResponse(
                        res,
                        STATUS_CODE.NOT_FOUND,
                        RESPONSE_MESSAGES.ENDPOINT_ERROR,
                    );
                }
                break;
            default:
                sendMessageResponse(res, STATUS_CODE.BAD_REQUEST, RESPONSE_MESSAGES.METHOD_ERROR);
        }
    } catch {
        sendMessageResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.SERVER_ERROR);
    }
    return usersState;
};


