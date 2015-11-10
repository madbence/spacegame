import koa from 'koa';
import { get } from 'koa-route';
import mount from 'koa-mount';

import middlewares from './middlewares';
import assets from './routes/assets';

const app = koa();

app

  // common middlewares
  .use(middlewares)

  // serve assets (css, js, etc...)
  .use(mount(assets))

  // serve main page, it's nothing fancy
  // this should be definitely improved :)
  .use(get('/', function* () {
    this.body = '<link rel=stylesheet href=style.css /><div id=mount></div><script src=bundle.js></script>';
  }));

export default app;
