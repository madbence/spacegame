import koa from 'koa';

import middlewares from './middlewares';
import routes from './routes';

const app = koa();

app
  .use(middlewares)
  .use(routes);

export default app;
