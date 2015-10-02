import koa from 'koa';
import http from 'http';
import { get } from 'koa-route';
import mount from 'koa-mount';
import assets from './routes/assets';

const app = koa();

app

  // serve assets (css, js, etc...)
  .use(mount(assets))

  // serve main page, it's nothing fancy
  // this should be definitely improved :)
  .use(get('/', function* () {
    this.body = '<link rel=stylesheet href=style.css /><div id=mount></div><canvas id=canvas width=500 height=500></canvas><script src=bundle.js></script>';
  }));

export default app;
