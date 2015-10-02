import app from './http';
import handler from './ws';

import http from 'http';
import ws from 'ws';

const server = http.createServer(app.callback());
const wss = new ws.Server({server});
wss.on('connection', handler);

server.listen(3000);
