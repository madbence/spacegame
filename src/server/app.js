import koa from 'koa';
import http from 'http';
import ws from 'ws';
import { get } from 'koa-route';
import fs from 'fs';

const app = koa();

app
  .use(get('/bundle.js', function* () {
    this.body = fs.createReadStream('./assets/bundle.js');
    this.type = 'application/javascript';
  }))
  .use(get('/style.css', function* () {
    this.body = fs.createReadStream('./assets/style.css');
    this.type = 'text/css';
  }))
  .use(get('/', function* () {
    this.body = '<link rel=stylesheet href=style.css /><div id=mount></div><script src=bundle.js></script>';
  }));

const server = http.createServer(app.callback());
const wsServer = new ws.Server({server});

server.listen(3000);

const clients = new Set();
let uid = 0;

wsServer
  .on('connection', client => {
    client.id = uid++;
    clients.add(client);
    clientList();

    function broadcast(message) {
      clients.forEach(client => client.send(JSON.stringify(message)));
    }
    function send(message) {
      client.send(JSON.stringify(message));
    }

    function clientList() {
      broadcast({
        type: 'CLIENT_LIST',
        clients: Array.from(clients).map(function (client) {
          return client.id
        }),
      });
    }

    client
      .on('message', message => {
        message = JSON.parse(message);
        switch(message.type) {
          case 'HELLO':
          send({ 
            id: client.id,
            type: 'HELLO',
          });
          break;
          default:
          console.error('Unknown message: %j', message);
        }
      })
      .on('close', () => {
        clients.delete(client);
        clientList();
      })
  });
