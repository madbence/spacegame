import compose from 'koa-compose';

import assets from './assets';
import main from './main';

export default compose([
  assets,
  main,
]);
