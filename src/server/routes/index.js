import compose from 'koa-compose';
import mount from 'koa-mount';

import assets from './assets';
import main from './main';
import clients from './clients';

export default compose([
  assets,
  main,
  mount('/clients', clients),
]);
