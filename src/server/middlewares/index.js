import compose from 'koa-compose';

import logger from './logger';
import error from './error';
import id from './id';

export default compose([
  logger,
  error,
  id,
]);
