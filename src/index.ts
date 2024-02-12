import dotenv from 'dotenv';
import { createServer } from 'http';
import { env } from 'process';
import { handler } from './router';
import { STATUS_TYPE } from './constants'

// import crypto from 'crypto'

// console.log(crypto.randomUUID());

dotenv.config();

export const server = createServer(handler);
const PORT = env['SERVER_PORT'] || 4000;

process.on('unhandledRejection', (error) => {
    throw error;
});

process.on('uncaughtException', (error) => {
    console.error(`${error}`);
});

server.listen(PORT, () => console.log(`${STATUS_TYPE.SERVER}: : ${PORT}`));

