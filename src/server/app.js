import app from './http';
import handler from './ws';

import http from 'http';
import ws from 'ws';

import config from '../../config';

const server = http.createServer(app.callback());
const wss = new ws.Server({server});
wss.on('connection', handler);

server.listen(config.port);
