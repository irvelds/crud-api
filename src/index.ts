import dotenv from 'dotenv';
import { createServer } from 'http';
import { env } from 'process';
import { handler } from './router';

import crypto from 'crypto'

console.log(crypto.randomUUID());

dotenv.config();

export const server = createServer(handler);
const PORT = env['SERVER_PORT'] || 4000;

server.listen(PORT, () => console.log(`The server started on the port : ${PORT}`));
