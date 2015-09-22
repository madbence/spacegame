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

wsServer.on('connection', client => {
  client.on('message', message => {})
        .on('close', () => {})
});
