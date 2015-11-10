import compose from 'koa-compose';
import id from './id';
import error from './error';

export default compose([
  error,
  id,
]);
