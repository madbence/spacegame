import koa from 'koa';
import http from 'http';
import ws from 'ws';
import { get } from 'koa-route';
import fs from 'fs';

const app = koa();

function serve(url, path, type) {
  return get(url, function* () {
    this.body = fs.createReadStream(path);
    this.type = type;
  });
}

app
  .use(serve('/bundle.js', './assets/bundle.js', 'application/javascript'))
  .use(serve('/style.css', './assets/style.css', 'text/css'))
  .use(get('/', function* () {
    this.body = '<link rel=stylesheet href=style.css /><div id=mount></div><script src=bundle.js></script>';
  }));

const server = http.createServer(app.callback());
const wsServer = new ws.Server({server});

server.listen(3000);

let uid = 0;
const clients = new Set();

function broadcast(action) {
  const message = JSON.stringify(action);
  [...clients].forEach(client => {
    client.send(message);
  });
}

function act(type, payload, meta) {
  return {
    type,
    payload,
    meta,
  };
}

wsServer.on('connection', client => {
  client.id = uid++;
  broadcast(act('ADD_USER', {
    id: client.id,
  }));
  clients.add(client);
  client.on('message', message => {
    const action = JSON.parse(message);
    switch(action.type) {
      case 'ADD_MESSAGE':
      setTimeout(() => {
        broadcast(act('ADD_MESSAGE', {
          message: action.payload.message,
          author: client.id,
          date: new Date(),
        }, {
          done: true,
          id: action.meta.id,
        }));
      }, 1000);
    }
  }).on('close', () => {
    clients.delete(client);
    broadcast(act('DEL_USER', {
      id: client.id,
    }));
  });
});
