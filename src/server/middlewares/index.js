import compose from 'koa-compose';
import bodyParser from 'koa-bodyparser';

import logger from './logger';
import error from './error';
import id from './id';
import session from './session';
import auth from './auth';

export default compose([
  logger,
  error,
  id,
  session,
  bodyParser(),
  auth,
]);
