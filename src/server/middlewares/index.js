import compose from 'koa-compose';

import logger from './logger';
import error from './error';
import id from './id';
import session from './session';

export default compose([
  logger,
  error,
  id,
  session,
]);
