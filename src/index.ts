import dotenv from 'dotenv';
import { createServer } from 'http';
import { env } from 'process';
dotenv.config();

export const server = createServer();
const PORT = env['SERVER_PORT'] || 4000;

server.listen(PORT, () => console.log(`The server started on the port : ${PORT}`));
