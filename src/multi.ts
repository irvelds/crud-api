import cluster from 'cluster';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { env } from 'process';
import { STATUS_TYPE } from './constants';
import { handler } from './router';
import os from 'os';
import { usersState, updateUsersState } from './state';

dotenv.config();

const server = createServer(handler);
const PORT = env['SERVER_PORT'] || 4000;


process.on('unhandledRejection', (error) => {
    throw error;
});
process.on('uncaughtException', (error) => {
    console.error(`${error}`);
});

if (cluster.isPrimary) {
    server.listen(PORT, () => console.log(`${STATUS_TYPE.PRIMARY}: ${PORT}`));
    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork({ SERVER_PORT: +(PORT) + i + 1 });
        // worker.send!(process.pid);
    }

    cluster.on('message', (worker, data) => {
        if (data.action === 'send') {
            updateUsersState(data.usersData);
        }
        if (data.action === 'get') {
            worker.send(usersState);
        }
    });
}
if (cluster.isWorker) {
    server.listen(PORT, () => console.log(`${STATUS_TYPE.WORKER}: ${PORT}`));
    // process.on('message', () => {
    // });
}

