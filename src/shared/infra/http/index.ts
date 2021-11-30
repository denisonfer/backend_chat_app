import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import routes from './routes';

const app = express();
app.use(express.json());
app.use(routes);

const serverHTTP = http.createServer(app);
const io = new Server(serverHTTP);

export { serverHTTP, io };
